import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getInquiryList(query) {
  return Axios.get(`/v1/inquiry/list/all?${addQueryParams(query)}`)
}
export function getSpecificInquiry(id) {
  return Axios.get(`/v1/inquiry?id=${id}`)
}

// inquiry Visit queries
export function getInquiryVisitList(id, query) {
  return Axios.get(`/v1/inquiryVisit/list/all?${addQueryParams(query)}&id=${id}`)
}

export function getSpecificInquiryVisit(id) {
  return Axios.get(`/v1/inquiryVisit/${id}`)
}

// inquiry FollowUp queries
export function getInquiryFollowUpList(id, query) {
  return Axios.get(`/v1/inquiryFollowup/list/all?${addQueryParams(query)}&id=${id}`)
}

export function getSpecificInquiryFollowUp(id) {
  return Axios.get(`/v1/inquiryFollowup/${id}`)
}