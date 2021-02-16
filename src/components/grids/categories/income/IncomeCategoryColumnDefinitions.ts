import { ColDef } from "ag-grid-community";

export enum IncomeCategoryColumnFields {
  NAME = "name"
}

export const IncomeCategoryColumnDefinitions: ColDef[] = [
  {
    headerName: "Name",
    field: IncomeCategoryColumnFields.NAME,
    resizable: false
  }
]

export const IncomeCategoryDefaultColumnDefinition: ColDef = {
  cellStyle: { textAlign: 'left' },
  sortable: true,
  filter: true,
  resizable: true,
}