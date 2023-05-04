import Axios from '../../axios'
import { encryption } from '../../helpers'

export function loginApi({ sEmail, sPassword, sPushToken }) {
  const encryptedPassword = encryption(sPassword)
  return Axios.post('/v1/admin/login', { sEmail, sPassword: encryptedPassword, sPushToken })
}

export function logoutApi() {
  return Axios.put('/api/employee/logout/v1')
}

