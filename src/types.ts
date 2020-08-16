export interface Config {
  /**
   * Enable/disable Markdown Inline Table Formatter.
   */
  enable: boolean;
  /**
   * How many spaces between left and right of each column content.
   */
  spacePadding: boolean;
  /**
   * Keep first and last pipes `|` in table formatting. Tables are easier to format when pipes are kept.
   */
  keepFirstAndLastPipes: boolean;
  /**
   * The default data when the cell is empty, default: `-`
   */
  emptyPlaceholder: string;
}
