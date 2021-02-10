import axios from 'axios';
import { ExpenseCategory, IncomeCategory } from '../domain/entities/Category';

export async function getExpenseCategory(): Promise<ExpenseCategory[]> {
  const response = await axios({
      method: 'get',
      url: 'http://localhost:9000/category/expense',
      responseType: "json"
  })
      
  return (response.data as Array<any>).map(it => {
      return {
          id: it.id,
          name: it.name,
          targetAmount: it.targetAmount
      } as ExpenseCategory
  });
}

export async function getIncomeCategory(): Promise<IncomeCategory[]> {
  const response = await axios({
      method: 'get',
      url: 'http://localhost:9000/category/income',
      responseType: "json"
  })
      
  return (response.data as Array<any>).map(it => {
      return {
          id: it.id,
          name: it.name,
      } as IncomeCategory
  });
}

