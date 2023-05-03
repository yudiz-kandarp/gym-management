import React from 'react'
import PropTypes from 'prop-types'
import { useLocation, useNavigate } from 'react-router-dom'

import { sidebarConfig } from './sidebarConfig'
import { isGranted } from 'helpers'
import iconSidebarLeft from '../../Assets/Icons/sidebar-left.png'
import iconSidebarRight from '../../Assets/Icons/sidebar-right.png'
import CustomToolTip from 'Components/TooltipInfo'

export function Sidebar({ onClose = () => {}, isSidebarWrapped = true, setIsSidebarWrapped = () => {} }) {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()

  function matchRoute(route) {
    return (pathname + search).startsWith(route) && pathname === route
  }
  function handleNavigate(link) {
    !matchRoute(link) && navigate(link)
  }
  return (
    <>
      <div className="sidebar">
        {sidebarConfig.map(({ link, Component, title, color, disabled, allowed }, index) =>
          !disabled && isGranted(allowed) ? (
            <CustomToolTip key={index} tooltipContent={isSidebarWrapped ? title : ''} position="right">
              {({ target }) => (
                <div
                  ref={target}
                  onClick={() => {
                    onClose()
                    handleNavigate(link)
                  }}
                  className={'nav_items ' + (pathname.startsWith(link) ? 'active' : '') + (isSidebarWrapped ? ' nav_items_center' : '')}
                >
                  <div className="w-5 mb-1">
                    <Component fill={pathname.startsWith(link) ? 'white' : color} />
                  </div>
                  {!isSidebarWrapped && <span className="ms-2">{title}</span>}
                </div>
              )}
            </CustomToolTip>
          ) : null
        )}
        <button onClick={() => setIsSidebarWrapped(!isSidebarWrapped)} className="sidebar-icon">
          <img src={isSidebarWrapped ? iconSidebarRight : iconSidebarLeft} alt="" />
        </button>
      </div>
    </>
  )
}

Sidebar.propTypes = {
  onClose: PropTypes.func,
  isSidebarWrapped: PropTypes.bool,
  setIsSidebarWrapped: PropTypes.func,
}

export default Sidebar
