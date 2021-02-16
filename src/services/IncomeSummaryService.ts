import axios from 'axios';
import { Income, IncomeSummary } from "../domain/entities/Income";

export async function getIncomeSummary(): Promise<IncomeSummary[]> {
  return await axios({
    method: 'get',
    url: 'http://localhost:9000/income/summary',
    responseType: "json"
  }).then(response => {
    return (response.data as Array<any>).map(it => {
      return {
        id: it.id,
        source: it.source,
        incomeCategoryId: it.incomeCategoryId,
        incomeCategoryName: it.incomeCategoryName,
        transactionDate: it.transactionDate,
        transactionAmount: it.transactionAmount,
        notes: it.notes,
        hide: it.hide
      } as IncomeSummary
    });
  }).catch(response => {
    alert(response)
    return []
  })
}

export async function postIncome(newIncome: Income): Promise<string> {
  return await axios({
    method: 'post',
    url: 'http://localhost:9000/income',
    data: newIncome
  }).then(response => {
    if (response.status === 201) {
      return response.data.id
    }
    return ""
  }).catch(response => {
    console.log(response)
    return ""
  })
}
