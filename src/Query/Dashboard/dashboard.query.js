import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getDashboard() {
  return Axios.get(`/api/dashboard/v1`)
}
export function getFreeResource(query) {
  return Axios.get(`/api/dashboard/employeeWithProjectNotCompletedOrCancelled/v1?${addQueryParams(query)}`)
}
export function getLatestProjects() {
  return Axios.get(`/api/dashboard/latestProjects/v1`)
}
export function getMonthlyProjects(year = new Date().getFullYear()) {
  return Axios.get(`/api/dashboard/monthlyProjects/v1?year=${year}`)
}
export function getProjectDashboard(query) {
  return Axios.get(`/api/indicator/project/v1?${addQueryParams(query)}`)
}

export function getDashboardStatistics() {
  return Axios.get(`/v1/dashboard/statistics`)
}