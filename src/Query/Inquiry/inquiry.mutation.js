import Axios from '../../axios'

export async function addInquiry(data) {
  return Axios.put('/v1/inquiry/add', data)
}

export async function updateInquiry(data) {
  return Axios.patch(`/v1/inquiry/edit/${data?.id}`, data.addData)
}

export function deleteInquiry(id) {
  return Axios.delete(`/v1/inquiry/delete/${id}`)
}

// inquiry visit
export async function addInquiryVisit(data) {
  return Axios.put('/v1/inquiryVisit/add', data.addData)
}

export async function updateInquiryVisit(data) {
  return Axios.patch(`/v1/inquiryVisit/edit/${data?.inquiryVisitId}`, data.onSubmitData)
}

export function deleteInquiryVisit(deleteId, inquiryId) {
  return Axios.delete(`/v1/inquiryVisit/delete?id=${deleteId}&inquiryId=${inquiryId}`)
}

// inquiry followUp
export async function addInquiryFollowUp(data) {
  return Axios.put('/v1/inquiryFollowup/add', data.addData)
}

export async function updateInquiryFollowUp(data) {
  return Axios.patch(`/v1/inquiryFollowup/edit/${data?.followUpId}`, data.addData)
}

export function deleteInquiryFollowUp(deleteId) {
  return Axios.delete(`/v1/inquiryFollowup/delete/${deleteId}`)
}
