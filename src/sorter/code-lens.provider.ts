import { Config } from '../types';
import { extractTables } from '../utils/extract-tables';
import { splitStringToTable } from '../utils/format-table';
import {
  CodeLens,
  CodeLensProvider,
  Disposable,
  languages,
  commands,
  workspace,
  Range,
  TextDocument,
  ProviderResult,
  TextEditor,
  TextEditorEdit,
} from 'vscode';

export class SortCodeLensProvider implements CodeLensProvider {
  private config: Config = {} as any;
  private _disposables: Disposable[] = [];

  get disposables() {
    return this._disposables;
  }

  register(config: Config): void {
    this.config = config;
    if (this._disposables.length > 0 || config.enableSort === false) return;

    this._disposables.push(languages.registerCodeLensProvider('markdown', this));
    this._disposables.push(commands.registerTextEditorCommand('sortTable', this.sortCommand, this));

    workspace.onDidOpenTextDocument((document) => {
      const fullDocumentRange = document.validateRange(new Range(0, 0, document.lineCount + 1, 0));
      // setExtensionTables(tablesIn(document, fullDocumentRange));
    });

    workspace.onDidChangeTextDocument((change) => {
      const fullDocumentRange = change.document.validateRange(new Range(0, 0, change.document.lineCount + 1, 0));
      // setExtensionTables(tablesIn(change.document, fullDocumentRange));
    });
  }

  provideCodeLenses(document: TextDocument): CodeLens[] | Thenable<CodeLens[]> {
    return extractTables(document.getText())
      .map(splitStringToTable)
      .filter((w) => Array.isArray(w) && w.length > 2 && w[0].length > 1)
      .map(this.codeLensForTable)
      .reduce((acc, val) => acc.concat(val), []);
  }

  resolveCodeLens(codeLens: CodeLens): ProviderResult<CodeLens> {
    return codeLens;
  }

  private codeLensForTable(table: string[][]): CodeLens[] {
    console.log('codeLensForTable', table);
    return table.map((row) => {
      return new CodeLens(table.range, {
        title: `${indicator}`,
        command: 'sortTable',
        arguments: [table.id, header_index, direction],
      });
    });
  }

  private sortCommand(editor: TextEditor, edit: TextEditorEdit, ...args: any[]) {
    const id = args[0];
    const index = args[1];
    const direction = args[2];
    console.log(id, index, direction);
  }

  dispose(): void {
    this._disposables.map((d) => d.dispose());
    this._disposables = [];
  }
}
