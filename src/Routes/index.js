import React, { Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import RoutesDetails from './Routes'
import Loading from 'Components/Loading'
import Toaster from 'Components/Toaster'
import { isGranted } from 'helpers'

function AllRoutes() {
  function allPaths(children, isPrivateRoute) {
    return children?.map(({ path, Component, exact, props, allowed, children: child }, i) =>
      child?.length ? (
        <Route key={i} element={<Component />}>{allPaths(child, isPrivateRoute)}</Route>
      ) : isGranted(allowed) || !isPrivateRoute ? (
        <Route
          key={i}
          path={path}
          element={
            <Suspense fallback={<Loading />}>
              <Component {...props} />
            </Suspense>
          }
          exact={exact}
        />
      ) : null
    )
  }

  return (
    <>
      <Toaster limit={3} />
      <BrowserRouter>
        <Routes>
          {RoutesDetails?.map(({ isPrivateRoute, children, Component }, i) => {
            return (
              <Route key={isPrivateRoute ? 'private' + i : 'public' + i} element={<Component />}>
                {allPaths(children, isPrivateRoute)}
              </Route>
            )
          })}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default AllRoutes
