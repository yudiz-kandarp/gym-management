export const route = {
  login: '/login',
  dashboard: '/dashboard',
  customers: '/customers',
  lifeCycleHistory: dynamicRoutes('customers'),
  customersAddViewEdit: dynamicRoutes('customers'),
  trainers: '/trainers',
  trainersAddViewEdit: dynamicRoutes('trainers'),
  subscriptions: '/subscriptions',
  subscriptionsAddViewEdit: dynamicRoutes('subscriptions'),
  transactions: '/transactions',
  transactionsAddViewEdit: dynamicRoutes('transactions'),
  inquiry: '/inquiry',
  inquiryAddViewEdit: dynamicRoutes('inquiry'),
  questions: '/questions',
}
function dynamicRoutes(module = '' ) {
  function commonRoutes({ id, type, postfixurl = '' }) {
    let isValidType = ['add', 'edit', 'view', ':type'].includes(type)
    if (!isValidType) throw new Error('Invalid type')
    return `${route?.[module] || module}/${type}${id ? `/${id}` : ''}${postfixurl? `/${postfixurl}` : ''}`
  }
  return (type, id, postfixurl) => commonRoutes({ id, type, module, postfixurl })
}
