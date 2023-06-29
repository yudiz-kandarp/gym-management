import Axios from '../../axios'

export async function addQuestion(data) {
  return Axios.put('/v1/question/add', data)
}

export async function updateQuestion(data) {
  return Axios.patch(`/v1/question/edit/${data?.questionId}`, data.addData)
}

export function deleteQuestion(id) {
  return Axios.delete(`/v1/question/delete/${id}`)
}
