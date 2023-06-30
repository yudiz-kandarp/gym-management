import { lazy } from 'react'
import { route } from './route'

const PublicRoute = lazy(() => import('./PublicRoute'))
const PrivateRoute = lazy(() => import('./PrivateRoute'))

// public Routes Files
const Login = lazy(() => import('Pages/Auth/Login'))

// Private Routes Files
const Dashboard = lazy(() => import('Pages/Dashboard'))
const CustomersList = lazy(() => import('Pages/Customer'))
const LifeCycleHistory = lazy(() => import('Pages/Customer/Add-Customer/LifeCycleHistory'))
const AddCustomer = lazy(() => import('Pages/Customer/Add-Customer'))
const TrainersList = lazy(() => import('Pages/Trainer'))
const SubscriptionList = lazy(() => import('Pages/Subscription'))
const AddTrainer = lazy(() => import('Pages/Trainer/Add-Trainer'))
const AddSubscription = lazy(() => import('Pages/Subscription/Add-Subscription'))
const AddTransaction = lazy(() => import('Pages/Transaction/Add-Transaction'))
const TransactionsList = lazy(() => import('Pages/Transaction'))
const InquiryList = lazy(() => import('Pages/Inquiry'))
const AddInquiry = lazy(() => import('Pages/Inquiry/Add-Inquiry'))
const QuestionsList = lazy(() => import('Pages/Questions'))

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
      { path: route.lifeCycleHistory(':type', ':id' , ':postfixurl'), Component: LifeCycleHistory, allowed: 'noRole', exact: true },

      { path: route.trainers, Component: TrainersList, allowed: 'noRole', exact: true },
      { path: route.trainersAddViewEdit(':type'), Component: AddTrainer, allowed: 'noRole', exact: true },
      { path: route.trainersAddViewEdit(':type', ':id'), Component: AddTrainer, allowed: 'noRole', exact: true },
      { path: route.subscriptions, Component: SubscriptionList, allowed: 'noRole', exact: true },
      { path: route.subscriptionsAddViewEdit(':type'), Component: AddSubscription, allowed: 'noRole', exact: true },
      { path: route.subscriptionsAddViewEdit(':type', ':id'), Component: AddSubscription, allowed: 'noRole', exact: true },
      { path: route.transactions, Component: TransactionsList, allowed: 'noRole', exact: true },
      { path: route.transactionsAddViewEdit(':type'), Component: AddTransaction, allowed: 'noRole', exact: true },
      { path: route.transactionsAddViewEdit(':type', ':id'), Component: AddTransaction, allowed: 'noRole', exact: true },

      { path: route.inquiry, Component: InquiryList, allowed: 'noRole', exact: true },
      { path: route.inquiryAddViewEdit(':type'), Component: AddInquiry, allowed: 'noRole', exact: true },
      { path: route.inquiryAddViewEdit(':type', ':id'), Component: AddInquiry, allowed: 'noRole', exact: true },

      { path: route.questions, Component: QuestionsList, allowed: 'noRole', exact: true },
    ],
  },
]

export default RoutesDetails
