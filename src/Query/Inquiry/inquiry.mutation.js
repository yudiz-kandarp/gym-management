import Axios from '../../axios'

export async function addInquiry(data) {
  return Axios.put('/v1/inquiry/add', data)
}

export async function updateInquiry(data) {
  console.log('edit data >> ', data)
  return Axios.patch(`/v1/inquiry/edit/${data?.id}`, data.data)
}

export function deleteInquiry(id) {
  return Axios.del(`/v1/inquiry/delete/${id}`)
}

// inquiry visit
export async function addInquiryVisit(data) {
  return Axios.put('/v1/inquiryVisit/add', data)
}
