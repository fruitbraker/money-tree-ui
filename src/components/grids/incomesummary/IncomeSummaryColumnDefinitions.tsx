import { ColDef } from "ag-grid-community";

export enum IncomeSummaryColumnFields {
  TRANSACTION_DATE = "transactionDate",
  TRANSACTION_AMOUNT = "transactionAmount",
  SOURCE = "source",
  INCOME_CATEGORY = "incomeCategoryName",
  NOTES = "notes",
  hide = "hide"
}

export const IncomeSummaryColumnDefinitions: ColDef[] = [
  {
    headerName: "Date",
    field: IncomeSummaryColumnFields.TRANSACTION_DATE,
    maxWidth: 120,
    resizable: false
  },
  {
    headerName: "Transaction Amount",
    field: IncomeSummaryColumnFields.TRANSACTION_AMOUNT,
    cellStyle: { textAlign: 'right' },
    maxWidth: 180
  }, 
  {
    headerName: "Source",
    field: IncomeSummaryColumnFields.SOURCE,
    maxWidth: 360
  },
  {
    headerName: "Income Category",
    field: IncomeSummaryColumnFields.INCOME_CATEGORY,
    maxWidth: 360
  },
  {
    headerName: "Notes",
    field: IncomeSummaryColumnFields.NOTES,
  },
]

export const IncomeSummaryDefaultColumnDefinition: ColDef = {
  cellStyle: { textAlign: 'left' },
  sortable: true,
  filter: true,
  resizable: true,
}