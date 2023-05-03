import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getSubscriptionList(query) {
  return Axios.get(`/v1/subscription/list/all?${addQueryParams(query)}`)
}
export function getSpecificSubscription(id) {
  return Axios.get(`/v1/subscription/${id}`)
}