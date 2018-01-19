export interface GTLDataInterface {
  rows: any[];
  cols: any[];
  settings?: any;
}

/**
 * @interface
 */
export interface ReportDataInterface {
  settings: any;
  perPage: any;
  gtlData: GTLDataInterface;
  gtlType: any;

  /**
   * Item click events.
   * @param item which item was clicked.
   * @param event which triggers click.
   * @return boolean value to stop propagation.
   */
  onItemClicked(item: any, event: any): boolean;

  /**
   * Action to trigger when item is selected.
   * @param item which item is in use.
   * @param isSelected boolean value for selecting and deselecting.
   */
  onItemSelect(item, isSelected): void;
}
