import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getCustomerList(query) {
  return Axios.get(`/v1/customer/list/all?${addQueryParams(query)}`)
}
export function getSpecificCustomer(id) {
  return Axios.get(`/v1/customer/${id}`)
}