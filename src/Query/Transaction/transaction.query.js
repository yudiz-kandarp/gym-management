import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getTransactionList(query) {
  console.log('query >> ', query)
  return Axios.get(`/v1/transaction/list/all?${addQueryParams(query)}`)
}
export function getSpecificTransaction(id) {
  return Axios.get(`/v1/transaction/${id}`)
}