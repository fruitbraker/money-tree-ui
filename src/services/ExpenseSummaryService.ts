import axios from 'axios';
import { ExpenseSummary, Expense } from '../domain/entities/Expense';

export async function getExpenseSummary(): Promise<ExpenseSummary[]> {
  return await axios({
    method: 'get',
    url: 'http://localhost:9000/expense/summary',
    responseType: "json"
  }).then(response => {
    return (response.data as Array<any>).map(it => {
      return {
        id: it.id,
        transactionDate: it.transactionDate,
        transactionAmount: it.transactionAmount,
        vendorId: it.vendorId,
        vendorName: it.vendorName,
        expenseCategoryId: it.expenseCategoryId,
        expenseCategoryName: it.expenseCategoryName,
        notes: it.notes,
        hide: it.hide
      } as ExpenseSummary
    });
  }).catch(response => {
    return []
  })
}

export async function postExpense(newExpense: Expense): Promise<boolean> {
  return await axios({
    method: 'post',
    url: 'http://localhost:9000/expense',
    data: newExpense
  }).then(response => {
    if (response.status === 201) {
      return true
    }
    return false
  }).catch(response => {
    console.log(response)
    return false
  })
}
