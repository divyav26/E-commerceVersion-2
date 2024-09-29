import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"

import {  statuses } from "../data/data"
import { Task } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
// import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value:any) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value:any) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px] text-xs"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "img",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product Image" />
    ),
    cell: ({ row }) => {
      const imgUrl = row.getValue<string>("img");
  
      return (
        <div className="flex space-x-2 items-center">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt="Product"
              className="h-8 w-8 object-cover rounded"
            />
          ) : (
            <span>No Image</span>
          )}
        </div>
      );
    },
  },
  

  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product Name" />
    ),
    cell: ({ row }) => {
     

      return (
        <div className="flex space-x-2">
          
          <span className="max-w-[350px] truncate font-normal text-xs">
            {row.getValue("name")}
          </span>
        </div>
      )
    },
  },
  
 
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
     

      return (
        <div className="flex space-x-2">
          
          <span className="max-w-[350px] truncate font-normal text-xs">
            {row.getValue("price")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
     

      return (
        <div className="flex space-x-2">
          
          <span className="max-w-[350px] truncate font-normal text-xs">
            {row.getValue("category")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
 

]
