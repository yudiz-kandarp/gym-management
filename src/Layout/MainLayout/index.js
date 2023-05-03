import React, { lazy, Suspense, useState } from 'react'
import PropTypes from 'prop-types'
import Navigationbar from 'Components/Navbar'
const Sidebar = lazy(() => import('Components/Sidebar'))
const BreadCrumbs = lazy(() => import('Components/Bread-Crumbs'))

import { Loading } from 'Components'

export default function MainLayout({ children }) {
  const [isSidebarWrapped, setIsSidebarWrapped] = useState(false)

  return (
    <div className="main_layout">
      <Navigationbar />
      <div className={`sidebar_container ${isSidebarWrapped ? 'sidebar_container_wrapped' : ''}`}>
        <Suspense fallback={<Loading absolute />}>
          <Sidebar isSidebarWrapped={isSidebarWrapped} setIsSidebarWrapped={setIsSidebarWrapped} />
        </Suspense>
      </div>
      <div className={`herosection_container ${isSidebarWrapped ? 'active' : ''}`}>
        <div className="breadCrumb">
          <BreadCrumbs />
        </div>
        <div className="children">{children}</div>
      </div>
    </div>
  )
}

MainLayout.propTypes = {
  children: PropTypes.node,
}
