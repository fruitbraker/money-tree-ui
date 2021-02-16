export interface ExpenseSummary {
  id: string | undefined,
  transactionDate: string,
  transactionAmount: number,
  vendorId: string,
  vendorName: string,
  expenseCategoryId: string,
  expenseCategoryName: string,
  notes: string,
  hide: boolean
}

export interface Expense {
  id: string | undefined,
  transactionDate: string,
  transactionAmount: number,
  vendor: string,
  expenseCategory: string,
  notes: string,
  hide: boolean
}
