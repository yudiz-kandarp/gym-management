import Axios from '../../axios'

export async function addTrainer(data) {
  return Axios.post('/v1/trainer/add', data)
}

export async function updateTrainer(data) {
  return Axios.put(`/v1/trainer/edit/${data?.id}`, data.data)
}

export function deleteTrainer(id) {
  return Axios.delete(`/v1/trainer/delete/${id}`)
}
