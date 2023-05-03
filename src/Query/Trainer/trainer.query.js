import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getTrainerList(query) {
  return Axios.get(`/v1/trainer/list/all?${addQueryParams(query)}`)
}
export function getSpecificTrainer(id) {
  return Axios.get(`/v1/trainer/${id}`)
}