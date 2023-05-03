import React from 'react'
import PropTypes from 'prop-types'
import './_chip.scss'

export default function Chip({ label, chipImage, onAction }) {
  return (
    <>
      <div className="chip_container">
        {chipImage && <span className="chip_image">{}</span>}
        <span className="chip_label">{label}</span>
        {onAction && (
          <span onClick={onAction} className="chip_close">
            {'x'}
          </span>
        )}
      </div>
    </>
  )
}

Chip.propTypes = {
  label: PropTypes.string,
  chipImage: PropTypes.string,
  onAction: PropTypes.func,
}
