
import { route } from 'Routes/route'
import Dashboard from 'Assets/Icons/Dashboard'
import EmployeeManagement from 'Assets/Icons/EmployeeManagement'
import Transactions from 'Assets/Icons/Transactions'
import Trainers from 'Assets/Icons/Trainers'
import Subscriptions from 'Assets/Icons/Subscription'

export const sidebarConfig = [
  { Component: Dashboard, title: 'Dashboard', link: route.dashboard, color: '#884B9D', allowed: 'noRole' },
  { Component: EmployeeManagement, title: 'Customers', link: route.customers, color: '#0B1C3C', allowed: 'noRole' },
  { Component: Trainers, title: 'Trainers', link: route.trainers, color: '#0EA085', allowed: 'noRole' },
  { Component: Subscriptions, title: 'Subscriptions', link: route.subscriptions, color: '#F29B20', allowed: 'noRole' },
  { Component: Transactions, title: 'Transactions', link: route.transactions, color: '#2780BA', allowed: 'noRole' },
]

