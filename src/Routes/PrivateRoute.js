import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import MainLayout from 'Layout/MainLayout'

function PrivateRoute() {
  const navigate = useNavigate()
  // function unauthorized(e) {
  //   if (e.oldValue !== e.newValue && e.key === 'token') {
  //     removeToken()
  //     navigate('/login')
  //     console.warn('Your token has been changed thats why you are redirected to login page.... XD')
  //   }
  // }
  function newNavigate(event) {
    navigate(event.detail)
  }
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  useEffect(() => {
    // window.addEventListener('storage', unauthorized)
    window.addEventListener('navigateTo', newNavigate, false)
    return () => window.removeEventListener('navigateTo', newNavigate, false)
  }, [])

  if (!token) return <Navigate to="/login" replace />
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}
PrivateRoute.propTypes = {
  element: PropTypes.element,
}

export default PrivateRoute
