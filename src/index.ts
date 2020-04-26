import { Config } from './types';
import * as vscode from 'vscode';
import { extractTables } from './utils/extract-tables';
import { formatTable } from './utils/format-table';
import { SortCodeLensProvider } from './sorter/code-lens.provider';

let config: Config;

function loadConfig(): void {
  const _ = vscode.workspace.getConfiguration('vscode-markdown-compact-table-formatter');
  config = {
    enable: _.get<boolean>('enable', true),
    enableSort: _.get<boolean>('enableSort', true),
    spacePadding: _.get<boolean>('spacePadding', true),
    keepFirstAndLastPipes: _.get<boolean>('keepFirstAndLastPipes', true),
  };
}

const sortCodeLensProvider = new SortCodeLensProvider();

export function activate(context: vscode.ExtensionContext) {
  loadConfig();

  sortCodeLensProvider.register(config);

  vscode.workspace.onDidChangeConfiguration(() => {
    loadConfig();

    if (config.enableSort === false) {
      sortCodeLensProvider.dispose();
    } else {
      sortCodeLensProvider.register(config);
    }
  });

  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider('markdown', {
      provideDocumentFormattingEdits(document) {
        if (!config.enable) {
          return;
        }

        const result: vscode.TextEdit[] = [];

        const start = new vscode.Position(0, 0);
        const end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
        const range = new vscode.Range(start, end);

        let text = document.getText(range);

        const tables = extractTables(text);
        if (tables) {
          tables.forEach((table) => {
            const re = new RegExp(
              String(table)
                .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
                .replace(/-/g, '\\u002d'),
              'g'
            );
            text = text.replace(re, () => formatTable(table, config));
          });
          result.push(new vscode.TextEdit(range, text));
        }

        return result;
      },
    })
  );
}

export function deactivate() {
  sortCodeLensProvider.dispose();
}
