import axios from 'axios';
import Vendor from "../domain/entities/Vendor";

export async function getVendor(): Promise<Vendor[]> {
  return await axios({
    method: 'get',
    url: 'http://localhost:9000/vendor',
    responseType: "json"
  }).then(response => {
    return (response.data as Array<any>).map(it => {
      return {
        id: it.id,
        name: it.name
      } as Vendor
    });
  }).catch(response => {
    alert(response)
    return []
  })
}

export async function postVendor(newVendor: Vendor): Promise<string> {
  return await axios({
    method: 'post',
    url: 'http://localhost:9000/vendor',
    data: newVendor
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
