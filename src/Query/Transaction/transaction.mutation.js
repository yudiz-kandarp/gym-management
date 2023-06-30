import Axios from '../../axios'

export async function addTransaction(data) {
  return Axios.put('/v1/transaction/add', data)
}

export async function updateTransaction(data) {
  return Axios.patch(`/v1/transaction/edit/${data?.id}`, data.data)
}

export function deleteTransaction(id) {
  return Axios.delete(`/v1/transaction/delete/${id}`)
}
