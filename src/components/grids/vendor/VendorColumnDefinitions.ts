import { ColDef } from "ag-grid-community";

export enum VendorColumnFields {
  NAME = "name"
}

export const VendorColumnDefinitions: ColDef[] = [
  {
    headerName: "Name",
    field: VendorColumnFields.NAME,
    resizable: false
  }
]

export const VendorDefaultColumnDefinition: ColDef = {
  cellStyle: { textAlign: 'left' },
  sortable: true,
  filter: true,
  resizable: true,
}