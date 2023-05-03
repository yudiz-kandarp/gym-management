import React from 'react'
import PropTypes from 'prop-types'
import { Spinner } from 'react-bootstrap'

const Button = ({ fullWidth, loading, children, className, startIcon, cancel, ...props }) => {
  return (
    <>
      <button
        className={`btn bg-primary bg-blue-100 text-white btn-border main-btn active-btn py-2 ${className} ${fullWidth && 'w-100'}`}
        disabled={loading}
        {...props}
      >
        {loading ? (
          <div className="d-flex align-items-center justify-content-center h-100">
            <Spinner className="m-1 " animation="border" variant="light" size="sm" />
          </div>
        ) : (
          <div className="d-flex align-items-center justify-content-center main-btn">
            {startIcon && <span className="pb-1 mx-1">{startIcon}</span>}
            <div className={'mx-1 fontWeight'} style={{ color: cancel ? '#b2bfd2' : '', fontSize: '15px' }}>
              {children}
            </div>
          </div>
        )}
      </button>
    </>
  )
}

Button.propTypes = {
  children: PropTypes.string || PropTypes.element,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  loading: PropTypes.bool,
  buttonIcon: PropTypes.bool,
  startIcon: PropTypes.element,
  cancel: PropTypes.bool,
}

export default Button
