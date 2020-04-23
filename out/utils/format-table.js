"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function formatTable(str, cog) {
    let table = splitStringToTable(str);
    table = fillInMissingColumns(table);
    let headerMaxLength = [];
    return table
        .map((row, row_index) => {
        const rowStr = row
            .map((cell, column_index) => {
            if (row_index === 0) {
                headerMaxLength[column_index] = cell.length;
            }
            const needSpacePadding = cog.keepFirstAndLastPipes && cog.spacePadding;
            if (row_index === 1) {
                return padHeaderSeparatorString(cell, headerMaxLength[column_index] + (needSpacePadding ? 2 : 0));
            }
            return needSpacePadding ? ` ${cell} ` : cell;
        })
            .join('|');
        return cog.keepFirstAndLastPipes ? `|${rowStr}|` : rowStr;
    })
        .join('\n');
}
exports.formatTable = formatTable;
function splitStringToTable(str) {
    return (str
        .trim()
        .split('\n')
        // trim space and "|", but respect empty first column
        // E.g. "| | Test a | Test b |"
        //   => "| Test a | Test b"
        .map((row) => row.replace(/^(\s*\|\s*|\s+)/, '').replace(/[\|\s]+$/, ''))
        // Split rows into columns
        .map((row) => {
        let inCode = false;
        return (row
            .split('')
            // Split by "|", but only if not inside inline-code
            // E.g. "| Command | `ls | grep foo` |"
            //  =>  [ "Command","`ls | grep foo`" ]
            .reduce((columns, c) => {
            if (c === '`') {
                // Switch mode
                inCode = !inCode;
            }
            if (c === '|' && !inCode) {
                // Add new Column
                columns.push('');
            }
            else {
                // Append char to current column
                columns[columns.length - 1] += c;
            }
            return columns;
        }, [''])
            // Trim space in columns
            .map((column) => column.trim()));
    }));
}
function fillInMissingColumns(table) {
    const max = table.reduce((max, item) => Math.max(max, item.length), 0);
    return table.map((row) => row.concat(Array(max - row.length).fill('')));
}
function padHeaderSeparatorString(str, len) {
    switch (getAlignment(str)) {
        case 'c':
            return ':' + '-'.repeat(Math.max(1, len - 2)) + ':';
        case 'r':
            return '-'.repeat(Math.max(1, len - 1)) + ':';
        case 'l':
        default:
            return '-'.repeat(Math.max(1, len));
    }
}
function getAlignment(str) {
    if (str.endsWith(':')) {
        if (str.startsWith(':')) {
            return 'c';
        }
        return 'r';
    }
    return 'l';
}
//# sourceMappingURL=format-table.js.map