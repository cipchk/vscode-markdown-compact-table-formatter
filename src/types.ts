export interface Config {
  /**
   * Enable/disable Markdown Inline Table Formatter.
   */
  enable: boolean;
  /**
   * Enable or disable table sorter, can be set 'auto' should be auto sort by first column.
   */
  enableSort: boolean | 'auto';
  /**
   * How many spaces between left and right of each column content.
   */
  spacePadding: boolean;
  /**
   * Keep first and last pipes `|` in table formatting. Tables are easier to format when pipes are kept.
   */
  keepFirstAndLastPipes: boolean;
}
