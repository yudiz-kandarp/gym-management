import React from 'react'
import PropTypes from 'prop-types'
import './_actionButton.scss'

export default function ActionButton({ actionButtonText, className, setIcon, ...props }) {
  return (
    <div className={`actionButton ${className}`} {...props}>
      <div className="px-1 pb-1 me-1">{setIcon}</div>
      <span className="pe-1">{actionButtonText}</span>
    </div>
  )
}
ActionButton.propTypes = {
  actionButtonText: PropTypes.string,
  className: PropTypes.string,
  setIcon: PropTypes.any,
}
