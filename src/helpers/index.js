import { Crypt } from 'hybrid-crypto-js'
import AltAvatar from 'Assets/Icons/altImage.svg'
import { queryClient } from 'App'

export const floatingNumber = /[a-z]?[A-Z]?[-]?[ $&+,:;`=_?@#|/'<>-^*()%!]*/g

// export const floatingNumber = /^(?![0-9]+(\.?[0-9]?[0-9]?)?)/g

export const onlyInt = /\D+/g

// Function for Verify Length
export function verifyLength(value, length) {
  return value?.length >= length
}

export function checkConfirmPassword(password, newPassword) {
  return newPassword === password && newPassword.trim().length > 0 && password.trim().length > 0
}

export function formatDate(date, separator = '-', reverseDate = false) {
  const d = new Date(date).toString().split(' ')
  const formatted = reverseDate ? [d[2], months[d[1]], d[3]].reverse() : [d[2], months[d[1]], d[3]]
  return date ? formatted.join(separator) : '-'
}

export const months = {
  Jan: '01',
  Feb: '02',
  Mar: '03',
  Apr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Aug: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dec: '12',
}

export function checkLength(data = '') {
  if (data?.trim()?.length !== 0) return false
  return true
}

export function removeSpaces(data) {
  return data?.trim()
}

export function removeAllSpaces(data) {
  return new Promise((resolve) => {
    Object.keys(data).forEach((k) => {
      data[k] = removeSpaces(data[k])
    })
    resolve(data)
  })
}

const publicKey = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAnOttI89r4Q9eZr2pleIY
pOtFD6Jz2INzRiNJmmAh0NQj2HE4/jhAqojAO6mU5h4UT4AxvF1EDz6QJ+OD6KW1
UlAjXJ7wm+M7IUUmpDmev1rTSEW5TKPgp85epnJnJJ/wYJ2hmj/cIpJHcoSl+xjM
T1x6fzsTirwnC6hRjTthBq1WZOsulAw+s0lkOmhO+WfZ1Dc6S3ljJJ2qYEN7H8gS
KXcMYzCSXdSfC0rU6ZynwwKvVnwhRvbT4FuU9T8U9cXfQ7I/PJJ32VDeCNTBD2rF
wLOpuEnOkjcc+QufliCV0sVMScIBXqEuyEHn4bQRFXl60K6zxfswMZYlnwaOSsIL
ycrpIvb72ALNUmeAPrgRUxTdy/uMzcahOw85UHewjN37yFPrVY9p3FHqGaAemtuY
8LDPU9zjKNtxwSyBnIpsK0Iil8s8BR8Y0V3zg4OQ9AneosNXSxGJjZcL9eoVNu+Q
Y4MdX4AfvPYeN//hXJ98MzYZ/Mg95mOeikryE4cL7D81erOh5rJeFLorAzQ3cRx8
K9M1qKPMC1Te51e8hfLX+H2fp0HeGKBAQKAnwyMTN6eRkXZ+cwtYN2xOkhBooU5T
Ydv+uMSN1/CjaiHsLsA1O8vvPyZqkTN66bVg8uzz25QB6nkP7Cf7ntoDYOsP1gPx
1af+T7DI3A/qiZq+GTlrg8UCAwEAAQ==
-----END PUBLIC KEY-----`

export function encryption(sPassword) {
  const crypt = new Crypt()
  const encrypted = crypt.encrypt(publicKey, sPassword)
  return encrypted.toString()
}

export const addQueryParams = (value) => {
  const data = { ...value }
  Object.keys(data).forEach((e) => (data[e] === '' || typeof data[e] === 'object' || !data[e]?.toString().length) && delete data[e])
  return new URLSearchParams(data)?.toString()
}

export function checkObjectId(id) {
  return /^[a-f\d]{24}$/i.test(id)
}

export function removeToken(isLocalStorage) {
  console.warn('removing token')
  if (isLocalStorage) {
    localStorage.clear('')
  } else {
    sessionStorage.clear('')
  }
}

export function addToken(token, remember) {
  if (remember) {
    localStorage.setItem('token', token)
  } else {
    sessionStorage.setItem('token', token)
  }
}

export const appendParams = (value) => {
  const data = { ...value }
  data.search = encodeURIComponent(data?.search || '')
  Object.keys(data).forEach((e) => (data[e] === '' || typeof data[e] === 'object' || !data[e]?.toString().length) && delete data[e])

  window.history.replaceState({}, null, `${location.pathname}?${new URLSearchParams(data).toString()}`)
}

export const parseParams = (params = '') => {
  const urlParams = new URLSearchParams(decodeURIComponent(params))
  const rawParams = decodeURIComponent(params).replace('?', '').split('&')

  const extractedParams = {}
  if (rawParams[0]) {
    rawParams.forEach((item) => {
      item = item.split('=')
      extractedParams[item[0]] = urlParams.get(item[0]) ? urlParams.get(item[0]) : ''
    })
    return extractedParams
  } else {
    return extractedParams
  }
}

export function handleAlterImage(e, src, isStyled) {
  e.target.onerror = null
  e.target.style = isStyled ? 'width:55%;height:55%;' : ''
  e.target.src = src || AltAvatar
}

export function getSortedColumns(TableColumns, urlData) {
  return TableColumns?.map((column) =>
    column.connectionName === urlData?.sort
      ? { ...column, sort: urlData?.order === 'asc' ? 1 : urlData?.order === 'desc' ? -1 : 0 }
      : column
  )
}

export function toaster(message, type = 'success') {
  queryClient.defaultOptions.message({ message, type })
}

export function imageAppendUrl(url) {
  return 'https://jr-web-developer.s3.ap-south-1.amazonaws.com/' + url
}

export function navigationTo(link) {
  emitEvent('navigateTo', link)
}

export function cell(data, optionalText = '-') {
  return data ?? optionalText
}

export function handleErrors(errors, errorSetter) {
  Array.isArray(errors) && errors?.forEach((error) => errorSetter(error.param, { type: 'custom', message: error.msg }))
}

export const bottomReached = ({ target }) => {
  return target.offsetHeight + target.scrollTop >= target.scrollHeight
}

export const transactionTags = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Parsial', value: 'Parsial' },
  { label: 'Full', value: 'full' },
]

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision)
  var n = precision < 0 ? number : 0.01 / factor + number
  return Math.round(n * factor) / factor
}

export function convertMinutesToHour(m, precision = 2) {
  return precisionRound(m / 60, precision)
}


export function emitEvent(type, detail = {}, elem = document) {
  if (!type) return

  let event = new CustomEvent(type, {
    bubbles: true,
    cancelable: true,
    detail: detail,
  })

  return elem.dispatchEvent(event)
}

export function calculateMinutesBetweenTwoDates(startDate, endDate) {
  const isDateFormat = (d) => typeof d === 'object'
  startDate = isDateFormat(startDate) ? isDateFormat : new Date(startDate)
  endDate = isDateFormat(endDate) ? isDateFormat : new Date(endDate)
  var diff = endDate.getTime() - startDate.getTime()

  // output diff in in minutes
  return Math.floor(diff / 1000 / 60)
}

export function detectBrowser() {
  var N = navigator.appName,
    ua = navigator.userAgent,
    M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*([\d.]+)/i)
  // if (M && (tem = ua.match(/version\/([.\d]+)/i)) != null) M[2] = tem[1]
  M = M ? [M[1]] : [N, navigator.appVersion, '-?']
  return M.join('')
}

export function mapFilter(array, mapCallback, filterCallback) {
  const mappedData = Array.isArray(array) ? [] : {}
  for (const INDEX in array) {
    const singleItem = mapCallback ? mapCallback(array[INDEX]) : array[INDEX]
    const condition = filterCallback ? filterCallback(array[INDEX]) : true
    condition && (Array.isArray(array) ? mappedData.push(singleItem) : (mappedData[INDEX] = array[INDEX]))
  }
  return mappedData
}

export function createOption(input, keys = ['sName', '_id']) {
  return {
    [keys[0]]: input,
    [keys[1]]: input.toLowerCase().replace(/\W/g, ''),
  }
}

export const permissions = [
  'VIEW_DASHBOARD', 'VIEW_CUSTOMERS', 'VIEW_TRAINERS'
]

export const permissionsName = {
  VIEW_DASHBOARD: 'noRole',
  VIEW_CUSTOMERS: 'noRole',
  VIEW_TRAINERS: 'noRole',
  VIEW_SUBSCRIPTION: 'noRole',
  VIEW_TRANSACTIONS: 'noRole',
}

export function isGranted(allowed) {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token') || queryClient.getQueryData('')
  const data = token ? parseJwt(token) : null

  if (data?.aTotalPermissions?.length) {
    if (Array.isArray(allowed)) {
      const granted = !!allowed.filter((per) => data.aTotalPermissions.includes(per) || per === 'noRole').length
      return granted
    } else {
      const granted = data.aTotalPermissions.includes(allowed) || allowed === 'noRole'
      return granted
    }
  } else if (allowed === 'noRole') {
    return true
  } else {
    return false
  }
}

export function parseJwt(token) {
  try {
    return JSON.parse(window.atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}
