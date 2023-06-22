import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getInquiryList(query) {
  return Axios.get(`/v1/inquiry/list/all?${addQueryParams(query)}`)
}
export function getSpecificInquiry(id) {
  return Axios.get(`/v1/inquiry?id=${id}`)
}

// inquiry Visit queries
export function getInquiryVisitList(id) {
  console.log('visit id >> ', id)
  return Axios.get(`/v1/inquiryVisit/list/all?id=${id}`)
}

// inquiry FollowUp queries
export function getInquiryFollowUpList(id) {
  return Axios.get(`/v1/inquiryFollowup/list/all?${id}`)
}