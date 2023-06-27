import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getEmployeeList(query) {
    console.log('query >> ', query)
  return Axios.get(`/v1/employee/list/all?${addQueryParams(query)}`)
}