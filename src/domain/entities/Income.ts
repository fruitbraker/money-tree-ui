export interface Income {
  id: string | undefined,
  source: string,
  incomeCategory: string,
  transactionDate: string,
  transactionAmount: number,
  notes: string,
  hide: boolean
}


export interface IncomeSummary {
  id: string | undefined,
  source: string,
  incomeCategoryId: string,
  incomeCategoryName: string,
  transactionDate: string,
  transactionAmount: number,
  notes: string,
  hide: boolean
}
