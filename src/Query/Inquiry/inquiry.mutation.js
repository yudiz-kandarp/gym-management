import Axios from '../../axios'

export async function addInquiry(data) {
  return Axios.post('/v1/inquiry/add', data)
}

export async function updateInquiry(data) {
  return Axios.put(`/v1/inquiry/edit/${data?.id}`, data.data)
}

export function deleteInquiry(id) {
  return Axios.delete(`/v1/inquiry/delete/${id}`)
}
