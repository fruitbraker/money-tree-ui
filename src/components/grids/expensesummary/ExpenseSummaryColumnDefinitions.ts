import { ColDef } from "ag-grid-community";

export enum ExpenseSummaryColumnFields {
  TRANSACTION_DATE = "transactionDate",
  TRANSACTION_AMOUNT = "transactionAmount",
  VENDOR = "vendorName",
  EXPENSE_CATEGORY = "expenseCategoryName",
  NOTES = "notes",
  hide = "hide"
}

export const ExpenseCategoryColumnDefinitions: ColDef[] = [
  {
    headerName: "Date",
    field: ExpenseSummaryColumnFields.TRANSACTION_DATE,
    maxWidth: 120,
    resizable: false
  },
  {
    headerName: "Transaction Amount",
    field: ExpenseSummaryColumnFields.TRANSACTION_AMOUNT,
    cellStyle: { textAlign: 'right' },
    maxWidth: 180
  }, 
  {
    headerName: "Vendor",
    field: ExpenseSummaryColumnFields.VENDOR,
    maxWidth: 360
  },
  {
    headerName: "Expese Category",
    field: ExpenseSummaryColumnFields.EXPENSE_CATEGORY,
    maxWidth: 360
  },
  {
    headerName: "Notes",
    field: ExpenseSummaryColumnFields.NOTES,
  },
]

export const DefaultColumnDefinition: ColDef = {
  cellStyle: { textAlign: 'left' },
  sortable: true,
  filter: true,
  resizable: true,
}