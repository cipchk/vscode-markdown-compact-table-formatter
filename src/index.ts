import { Config } from './types';
import * as vscode from 'vscode';
import { extractTables } from './utils/extract-tables';
import { formatTable } from './utils/format-table';

function loadConfig(): Config {
  const config = vscode.workspace.getConfiguration('vscode-markdown-compact-table-formatter');
  return {
    enable: config.get<boolean>('enable', true),
    spacePadding: config.get<boolean>('spacePadding', true),
    keepFirstAndLastPipes: config.get<boolean>('keepFirstAndLastPipes', true),
    emptyPlaceholder: config.get<string>('emptyPlaceholder', '-'),
  };
}

let cog = loadConfig();

vscode.workspace.onDidChangeConfiguration(() => (cog = loadConfig()));

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider('markdown', {
      provideDocumentFormattingEdits(document) {
        if (!cog.enable) {
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
            text = text.replace(re, () => formatTable(table, cog));
          });
          result.push(new vscode.TextEdit(range, text));
        }

        return result;
      },
    })
  );
}

// tslint:disable-next-line: no-empty
export function deactivate() {}
