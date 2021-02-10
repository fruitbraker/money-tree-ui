import axios from 'axios';
import IncomeSummary from "../domain/entities/IncomeSummary";

export async function getIncomeSummary(): Promise<IncomeSummary[]> {
  const response = await axios({
      method: 'get',
      url: 'http://localhost:9000/income/summary',
      responseType: "json"
  })
      
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
}