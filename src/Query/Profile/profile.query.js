import Axios from '../../axios'

export function getProfile() {
  return Axios.get('/v1/admin/profile')
}
