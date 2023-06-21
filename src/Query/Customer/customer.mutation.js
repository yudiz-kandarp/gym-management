import Axios from '../../axios'

export async function addCustomer(data) {
  console.log('add customer >> ', data)
  return Axios.put('/v1/customer/add', data)
}

export async function updateCustomer(data) {
  return Axios.patch(`/v1/customer/edit/${data?.id}`, data.data)
}

export function deleteCustomer(id) {
  return Axios.del(`/v1/customer/delete/${id}`)
}
