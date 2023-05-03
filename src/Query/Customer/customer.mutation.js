import Axios from '../../axios'

export async function addCustomer(data) {
  return Axios.post('/v1/customer/add', data)
}

export async function updateCustomer(data) {
  return Axios.put(`/v1/customer/edit/${data?.id}`, data.data)
}

export function deleteCustomer(id) {
  return Axios.delete(`/v1/customer/delete/${id}`)
}
