import axios from 'axios';
import Vendor from "../domain/entities/Vendor";

export async function getVendor(): Promise<Vendor[]> {
  const response = await axios({
      method: 'get',
      url: 'http://localhost:9000/vendor',
      responseType: "json"
  })
      
  return (response.data as Array<any>).map(it => {
      return {
          id: it.id,
          name: it.name
      } as Vendor
  });
}