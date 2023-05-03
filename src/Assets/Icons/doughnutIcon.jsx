import React from 'react'
import PropTypes from 'prop-types'

export default function doughnutIcon({ fill }) {
  return (
    <svg
      width="22px"
      height="22px"
      viewBox="0 0 24.00 20.00"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)"
      stroke="#000000"
      strokeWidth="0.768"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.048"></g>
      <g id="SVGRepo_iconCarrier">
        <circle cx="12" cy="12" r="9" stroke={fill}></circle> <circle cx="12" cy="12" r="4" stroke={fill}></circle>
        <path d="M12 3V7.5M18 18L15 15M18 6L15 9M3 12H7.5" stroke={fill} strokeLinecap="round"></path>
      </g>
    </svg>
  )
}

doughnutIcon.propTypes = {
  fill: PropTypes.string,
}
