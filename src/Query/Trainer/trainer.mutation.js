import Axios from '../../axios'

export async function addTrainer(data) {
  return Axios.put('/v1/employee/add', data)
}

export async function updateTrainer(data) {
  return Axios.patch(`/v1/employee/edit/${data?.id}`, data.data)
}

export function deleteTrainer(id) {
  return Axios.delete(`/v1/employee/delete/${id}`)
}
