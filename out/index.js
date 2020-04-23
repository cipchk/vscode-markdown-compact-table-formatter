"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_1 = require("vscode");
const extract_tables_1 = require("./utils/extract-tables");
const format_table_1 = require("./utils/format-table");
function loadConfig() {
    let config = vscode_1.workspace.getConfiguration('vscode-markdown-compact-table-formatter');
    return {
        enable: config.get('enable', true),
        spacePadding: config.get('spacePadding', true),
        keepFirstAndLastPipes: config.get('keepFirstAndLastPipes', true),
    };
}
let cog = loadConfig();
vscode_1.workspace.onDidChangeConfiguration(() => (cog = loadConfig()));
function activate(context) {
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('markdown', {
        provideDocumentFormattingEdits(document) {
            if (!cog.enable) {
                return;
            }
            const result = [];
            const start = new vscode.Position(0, 0);
            const end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
            const range = new vscode.Range(start, end);
            let text = document.getText(range);
            const tables = extract_tables_1.extractTables(text);
            if (tables) {
                tables.forEach((table) => {
                    var re = new RegExp(String(table)
                        .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
                        .replace(/-/g, '\\u002d'), 'g');
                    text = text.replace(re, () => format_table_1.formatTable(table, cog));
                });
                result.push(new vscode.TextEdit(range, text));
            }
            return result;
        },
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=index.js.map