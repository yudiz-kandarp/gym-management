import PropTypes from 'prop-types'
import { parseJwt } from 'helpers'

function PermissionProvider({ allowed, children }) {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  const data = token ? parseJwt(token) : null

  if(data?.aTotalPermissions?.length) {
    if (Array.isArray(allowed)) {
      const granted = !!allowed.filter((per) => data.aTotalPermissions.includes(per) || per === 'noRole').length
      return granted ? children : null
    } else {
      const granted = data.aTotalPermissions.includes(allowed) || allowed === 'noRole'
      return granted ? children : null
    }
  } else if(allowed === 'noRole') {
    return children
  } else {
    return null
  }
}

PermissionProvider.propTypes = {
  allowed: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.any,
}
export default PermissionProvider
