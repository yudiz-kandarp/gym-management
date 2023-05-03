import { lazy } from 'react'
import { route } from './route'

const PublicRoute = lazy(() => import('./PublicRoute'))
const PrivateRoute = lazy(() => import('./PrivateRoute'))

// public Routes Files
const Login = lazy(() => import('Pages/Auth/Login'))

// Private Routes Files
const Dashboard = lazy(() => import('Pages/Dashboard'))
const CustomersList = lazy(() => import('Pages/Customer'))
const AddCustomer = lazy(() => import('Pages/Customer/Add-Customer'))
const TrainersList = lazy(() => import('Pages/Trainer'))
const SubscriptionList = lazy(() => import('Pages/Subscription'))
const AddTrainer = lazy(() => import('Pages/Trainer/Add-Trainer'))
const AddSubscription = lazy(() => import('Pages/Subscription/Add-Subscription'))

const RoutesDetails = [
  {
    defaultRoute: '',
    Component: PublicRoute,
    props: {},
    isPrivateRoute: false,
    children: [{ path: '/login', Component: Login, exact: true }],
  },
  {
    defaultRoute: '',
    Component: PrivateRoute,
    props: {},
    isPrivateRoute: true,
    children: [
      { path: route.dashboard, Component: Dashboard, allowed: 'noRole', exact: true },
      { path: route.customers, Component: CustomersList, allowed: 'noRole', exact: true },
      { path: route.customersAddViewEdit(':type'), Component: AddCustomer, allowed: 'noRole', exact: true },
      { path: route.customersAddViewEdit(':type', ':id'), Component: AddCustomer, allowed: 'noRole', exact: true },
      { path: route.trainers, Component: TrainersList, allowed: 'noRole', exact: true },
      { path: route.trainersAddViewEdit(':type'), Component: AddTrainer, allowed: 'noRole', exact: true },
      { path: route.trainersAddViewEdit(':type', ':id'), Component: AddTrainer, allowed: 'noRole', exact: true },
      { path: route.subscriptions, Component: SubscriptionList, allowed: 'noRole', exact: true },
      { path: route.subscriptionsAddViewEdit(':type'), Component: AddSubscription, allowed: 'noRole', exact: true },
      { path: route.subscriptionsAddViewEdit(':type', ':id'), Component: AddSubscription, allowed: 'noRole', exact: true },
      { path: route.transactions, Component: Dashboard, allowed: 'noRole', exact: true },
      { path: route.transactionsAddViewEdit(':type', ':id'), Component: Dashboard, allowed: 'noRole', exact: true },
    ],
  },
]

export default RoutesDetails