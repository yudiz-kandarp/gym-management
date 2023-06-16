import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getInquiryList(query) {
  return Axios.get(`/v1/inquiry/list/all?${addQueryParams(query)}`)
}
export function getSpecificInquiry(id) {
  return Axios.get(`/v1/inquiry?id=${id}`)
}

// inquiry Visit queries
export function getInquiryVisitList() {
  return Axios.get(`/v1/inquiryVisit/list/all?id=6486ddd535c15c191dd10bb9`)
}

// inquiry FollowUp queries
export function getInquiryFollowUpList(query) {
  return Axios.get(`/v1/inquiryFollowup/list/all?${addQueryParams(query)}`)
}