import { ColumnDef } from '@tanstack/react-table'
import { File } from '../../../../files/domain/models/File'
import { RowSelectionCheckbox } from './row-selection/RowSelectionCheckbox'
import { FileInfoCell } from './file-info-cell/FileInfoCell'
import { FileInfoHeader } from './FileInfoHeader'

export const columns: ColumnDef<File>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <RowSelectionCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
          disabled: table.getPageCount() === 0
        }}
      />
    ),
    cell: ({ row }) => (
      <RowSelectionCheckbox
        {...{
          checked: row.getIsSelected(),
          disabled: !row.getCanSelect(),
          indeterminate: row.getIsSomeSelected(),
          onChange: row.getToggleSelectedHandler()
        }}
      />
    )
  },
  {
    header: ({ table }) => (
      <FileInfoHeader
        pageCount={table.getPageCount()}
        pageSize={table.getState().pagination.pageSize}
        pageIndex={table.getState().pagination.pageIndex}
      />
    ),
    accessorKey: 'info',
    cell: (props) => <FileInfoCell file={props.row.original} />
  }
]