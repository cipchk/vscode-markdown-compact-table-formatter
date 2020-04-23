import { Config } from './types';
import * as vscode from 'vscode';
import { workspace } from 'vscode';
import { extractTables } from './utils/extract-tables';
import { formatTable } from './utils/format-table';

function loadConfig(): Config {
  let config = workspace.getConfiguration('vscode-markdown-compact-table-formatter');
  return {
    enable: config.get<boolean>('enable', true),
    spacePadding: config.get<boolean>('spacePadding', true),
    keepFirstAndLastPipes: config.get<boolean>('keepFirstAndLastPipes', true),
  };
}

let cog = loadConfig();

workspace.onDidChangeConfiguration(() => (cog = loadConfig()));

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
            var re = new RegExp(
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

export function deactivate() {}
