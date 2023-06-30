import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getQuestionsList(query) {
  return Axios.get(`/v1/question/list/all?${addQueryParams(query)}`)
}

export function getSpecificQuestion(id) {
    return Axios.get(`/v1/question/${id}`)
  }