import Axios from '../../axios'
import { encryption } from '../../helpers'

export function loginApi({ sEmail, sPassword, sPushToken }) {
  const encryptedPassword = encryption(sPassword)
  return Axios.post('/v1/admin/login', { sEmail, sPassword: encryptedPassword, sPushToken })
}

export function logoutApi() {
  return Axios.put('/api/employee/logout/v1')
}

export function forgotPasswordApi(sLogin) {
  return Axios.post('/api/employee/forgot-password', { sLogin })
}

export function resetPasswordApi({ sNewPassword, sConfirmPassword, token, sCode, isSetPassword }) {
  const encryptedNewPassword = encryption(sNewPassword)
  const encryptedConfirmPassword = encryption(sConfirmPassword)

  return Axios.post(`/api/employee/reset-password?token=${token}&type=${sCode ? 'otp' : isSetPassword ? 'set-link' : 'reset-link'}`, {
    sNewPassword: encryptedNewPassword,
    sConfirmPassword: encryptedConfirmPassword,
    sCode,
  })
}
export function changePasswordApi(changePasswordData) {
  const ebcryptedChnagePasswordObject = {
    sCurrentPassword: encryption(changePasswordData.sCurrentPassword),
    sNewPassword: encryption(changePasswordData.sNewPassword),
    sConfirmPassword: encryption(changePasswordData.sConfirmPassword),
  }

  return Axios.post('/api/employee/change-password/v1', ebcryptedChnagePasswordObject)
}
