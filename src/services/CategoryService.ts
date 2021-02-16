import axios from 'axios';
import { ExpenseCategory, IncomeCategory } from '../domain/entities/Category';

export async function getExpenseCategory(): Promise<ExpenseCategory[]> {
  return await axios({
    method: 'get',
    url: 'http://localhost:9000/category/expense',
    responseType: "json"
  }).then(response => {
    return (response.data as Array<any>).map(it => {
      return {
        id: it.id,
        name: it.name,
        targetAmount: it.targetAmount
      } as ExpenseCategory
    });
  }).catch(response => {
    alert(response)
    return []
  })
}

export async function postExpenseCategory(newExpenseCategory: ExpenseCategory): Promise<string> {
  return await axios({
    method: 'post',
    url: 'http://localhost:9000/category/expense',
    data: newExpenseCategory
  }).then(response => {
    if (response.status === 201) {
      return response.data.id
    }
    return ""
  }).catch(response => {
    alert(response)
    return ""
  })
}

export async function getIncomeCategory(): Promise<IncomeCategory[]> {
  return await axios({
    method: 'get',
    url: 'http://localhost:9000/category/income',
    responseType: "json"
  }).then(response => {
    return (response.data as Array<any>).map(it => {
      return {
        id: it.id,
        name: it.name,
      } as IncomeCategory
    });
  }).catch(response => {
    alert(response)
    return []
  })
}

export async function postIncomeCategory(newIncomeCategory: IncomeCategory): Promise<string> {
  return await axios({
    method: 'post',
    url: 'http://localhost:9000/category/income',
    data: newIncomeCategory
  }).then(response => {
    if (response.status === 201) {
      return response.data.id
    }
    return ""
  }).catch(response => {
    alert(response)
    return ""
  })
}
