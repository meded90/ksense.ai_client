import React, { useCallback } from 'react';
import { IAbstractTableBuilderStore, IHeaderItemFormat, IHeaderItemType, IStatus } from "./typings";
import { Table } from 'antd';
import { useObserver } from "mobx-react-lite";
import { ColumnType } from "antd/lib/table/interface";
import { separateThousands } from "../../helpers/separateThousands";


interface TableBuilderProps {
  store: IAbstractTableBuilderStore
}

export default function TableBuilder(props: TableBuilderProps) {

  const { store } = props;

  const handlerPaginationChange = useCallback((page, pageSize) => {
    store.onChangePagination((page - 1) * pageSize, pageSize)
  }, []);

  return useObserver(() => {
    const columns: ColumnType<any>[] = store.columns.map(item => {
      const { render_type, render_format, ...reg } = item

      return {
        ...reg,
        ...formatCeil(render_type, render_format)
      }
    })

    return (
      <div>

        <Table
          rowKey={store.rowKey}
          columns={columns}
          dataSource={store.dataSource}
          pagination={{
            total: store.total,
            current: Math.trunc(store.offset / store.limit) + 1,
            pageSize: store.limit,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: handlerPaginationChange,
            onShowSizeChange: handlerPaginationChange
          }}
          bordered
          loading={store.status === IStatus.loading}
          scroll={{  y: 'auto'}}
        />

      </div>
    )
  })
}

function formatCeil(type: IHeaderItemType, format: IHeaderItemFormat): ColumnType<any> {
  switch (type) {
    case IHeaderItemType.TEXT:
      return {}
      break;
    case IHeaderItemType.LONG:
      return {
        align: "right",
        render: (text) => {
          return formatNumber(text, format)
        }
      }
    case IHeaderItemType.DECIMAL:
      return {
        align: "right",
        render: (text) => {
          return formatNumber(text, format, 2)
        }
      }
    default:
      ASSERT_EXHAUSTIVE(type)
  }
}

function formatNumber(text: string | number, format?: IHeaderItemFormat, preset?: number) {
  let result = text;
  if (preset) {
    result = Number(result).toFixed(preset).toString()
  }
  if (format) {
    if (format.split_thousands) {
      result = separateThousands(text)
      if (Number(result) > 2000) {
        debugger;
      }
    }
  }
  return result;
}
