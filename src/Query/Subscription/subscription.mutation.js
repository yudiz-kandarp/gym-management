import Axios from '../../axios'

export async function addSubscription(data) {
  return Axios.put('/v1/subscription/add', data)
}

export async function updateSubscription(data) {
  return Axios.patch(`/v1/subscription/edit/${data?.id}`, data.data)
}

export function deleteSubscription(id) {
  return Axios.delete(`/v1/subscription/delete/${id}`)
}
