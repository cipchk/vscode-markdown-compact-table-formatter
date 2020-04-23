"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TABLE_EXP = /((?:(?:[^\n]*?\|[^\n]*)\ *)?(?:\r?\n|^))((?:\|\ *(?::?-+:?|::)\ *|\|?(?:\ *(?::?-+:?|::)\ *\|)+)(?:\ *(?::?-+:?|::)\ *)?\ *\r?\n)((?:(?:[^\n]*?\|[^\n]*)\ *(?:\r?\n|$))+)/g;
function extractTables(text) {
    return (text.match(TABLE_EXP) || []).map((s) => s.replace(/\n+$/, ''));
}
exports.extractTables = extractTables;
//# sourceMappingURL=extract-tables.js.map