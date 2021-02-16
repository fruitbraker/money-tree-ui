import { ColDef } from "ag-grid-community";

export enum ExpenseCategoryColumnFields {
  NAME = "name",
  TARGET_AMOUNT = "targetAmount"
}

export const ExpenseCategoryColumnDefinitions: ColDef[] = [
  {
    headerName: "Name",
    field: ExpenseCategoryColumnFields.NAME,
    resizable: false
  },
  {
    headerName: "Target Amount",
    field: ExpenseCategoryColumnFields.TARGET_AMOUNT,
    resizable: false
  }
]

export const ExpenseCategoryDefaultColumnDefinitions: ColDef = {
  cellStyle: { textAlign: 'left' },
  sortable: true,
  filter: true,
  resizable: true,
}