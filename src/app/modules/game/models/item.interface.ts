export interface IItem {
  /**
   * Value % 2 === 0
   */
  value: number;
  row: number;
  col: number;
  /**
   * Must be deleted on next tick
   */
  isOnDelete?: boolean;
}
