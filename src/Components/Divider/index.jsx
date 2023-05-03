import React from 'react'
import PropTypes from 'prop-types'
import './_divider.scss'

export default function Divider({ width, height, className, backgroundColor, ...props }) {
  return (
    <div className={`divider_container ${className}`} {...props}>
      <div className="custom_divider" style={{ width, height, backgroundColor: backgroundColor || '#f2f4f7' }} />
    </div>
  )
}
Divider.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
  className: PropTypes.string,
  backgroundColor: PropTypes.string,
}
