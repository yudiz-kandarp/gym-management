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
  console.log('visit id >> ', id, ', q', query)
  return Axios.get(`/v1/inquiryVisit/list/all?${addQueryParams(query)}&id=${id}`)
}

export function getSpecificInquiryVisit(id) {
  console.log('specific id >> ', id)
  return Axios.get(`/v1/inquiryVisit/${id}`)
}

// inquiry FollowUp queries
export function getInquiryFollowUpList(id, query) {
  console.log('id >> ', id)
  return Axios.get(`/v1/inquiryFollowup/list/all?${addQueryParams(query)}&id=${id}`)
}

export function getSpecificInquiryFollowUp(id) {
  console.log('specific FollowUp id >> ', id)
  return Axios.get(`/v1/inquiryFollowup/${id}`)
}