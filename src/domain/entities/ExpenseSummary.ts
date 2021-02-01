interface ExpenseSummary {
    id: string | undefined,
    transactionDate: string,
    transactionAmount: number,
    vendor: string,
    expenseCategory: string,
    notes: string,
    hide: boolean
}

export default ExpenseSummary