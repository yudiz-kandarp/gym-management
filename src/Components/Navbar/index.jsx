import React, { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { Dropdown, Offcanvas } from 'react-bootstrap'
import { logoutApi } from 'Query/Auth/auth.query'
// import { getMyProfile } from 'Query/My-Profile/myprofile.query'
import Sidebar from 'Components/Sidebar'
import { ReactComponent as Logout } from 'Assets/Icons/Logout.svg'
import { ReactComponent as Hamburger } from 'Assets/Icons/Hamburger.svg'
import { ReactComponent as Down } from 'Assets/Icons/Down.svg'
import Logo from 'Assets/Images/RAW-logo.png'
// import { ReactComponent as NotificationLogo } from 'Assets/Icons/Notification.svg'
import { handleAlterImage, removeToken } from 'helpers'
import { getProfile } from 'Query/Profile/profile.query'

export default function Navigationbar() {
  const navigate = useNavigate()
  const { mutate } = useMutation('logout', () => logoutApi(), { retry: false })

  function handleLogout() {
    mutate()
    const isLocalStorage = !!localStorage.getItem('token')
    removeToken(isLocalStorage)
    navigate('/login')
  }

  const [sidebarview, setSidebarView] = useState(false)
  // eslint-disable-next-line react/prop-types
  const CustomToggle = React.forwardRef(function toggle({ children, onClick }, ref) {
    return (
      <div
        className="cursor-pointer"
        ref={ref}
        onClick={(e) => {
          e.preventDefault()
          onClick(e)
        }}
      >
        {children}
      </div>
    )
  })

  const { data, isLoading } = useQuery('myProfile', getProfile, { select: (data) => data?.data.data })

  return (
    <>
      <section className="d-flex justify-content-center align-items-center sticky-top navbar_section">
        <div className="d-flex justify-content-between align-items-center w-100 mx-3">
          <div className="d-flex align-items-center">
            <div className="hamburger" onClick={() => setSidebarView(true)}>
              <Hamburger />
            </div>

            <Offcanvas style={{ width: '350px' }} show={sidebarview} onHide={() => setSidebarView((p) => !p)}>
              <div className="offcanvas-header"></div>
              <div className="offcanvas-body p-0">
                <Sidebar onClose={() => setSidebarView(false)} />
              </div>
            </Offcanvas>

            <div className="logo">
              <img src={Logo} alt="Raw" />
            </div>
          </div>
          {!isLoading ? (
            <div className="user_actions">
              <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                  <div className="d-flex align-items-center">
                    <div className="profile_picture">
                      <img onError={handleAlterImage} src={data?.sLogo} />
                    </div>
                    <div className="user-name ">{data?.sUserName}</div>
                    <div className="down-arrow">
                      <Down className="mx-3" />
                    </div>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as="button" onClick={handleLogout}>
                    <div className="px-1">
                      <Logout className="me-2 mb-1" /> Logout
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
