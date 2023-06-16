export const route = {
  login: '/login',
  dashboard: '/dashboard',
  customers: '/customers',
  customersAddViewEdit: dynamicRoutes('customers'),
  trainers: '/trainers',
  trainersAddViewEdit: dynamicRoutes('trainers'),
  subscriptions: '/subscriptions',
  subscriptionsAddViewEdit: dynamicRoutes('subscriptions'),
  transactions: '/transactions',
  transactionsAddViewEdit: dynamicRoutes('transactions'),
  inquiry: '/inquiry',
  inquiryAddViewEdit: dynamicRoutes('inquiry'),
}
function dynamicRoutes(module = '') {
  function commonRoutes({ id, type }) {
    let isValidType = ['add', 'edit', 'view', ':type'].includes(type)
    if (!isValidType) throw new Error('Invalid type')
    return `${route?.[module] || module}/${type}${id ? `/${id}` : ''}`
  }
  return (type, id) => commonRoutes({ id, type, module })
}
