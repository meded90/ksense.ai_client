import { TableProps as RcTableProps } from 'rc-table/lib/Table';
import { ColumnType } from "antd/lib/table/interface";

export enum IHeaderItemType {
  TEXT = "TEXT",
  LONG = "LONG",
  DECIMAL = "DECIMAL",
}

export type IHeaderItemFormat = {
  split_thousands: true
}

export type IHeaderItem = {
  name: string,
  type: IHeaderItemType,
  format?: IHeaderItemFormat
}
export type IRow = Array<string | number>


export enum IStatus {
  init,
  loading,
  done,
  error
}

export interface IAbstractTableBuilderStore {
  status: IStatus;
  limit: number;
  offset: number;
  total: number;
  onChangePagination: (offset: number, limit: number) => void;
  dataSource: RcTableProps<any>['data'];
  rowKey: string;
  columns: Array< ColumnType<any> & {
    render_type: IHeaderItemType,
    render_format?: IHeaderItemFormat
  }>
}

