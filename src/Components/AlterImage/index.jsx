import React from 'react'
import PropTypes from 'prop-types'
import './_alternative.scss'

function AlterImage({ text = '' }) {
  const [first, second, third] = text?.split(' ', 3) || ['', '', '']
  return (
    <div className="alternative-image-container">
      <div className="alternative-image"></div>
      <div className="alter-text">
        {first?.[0] || ''}
        {second?.[0] || ''}
        {third?.[0] || ''}
      </div>
    </div>
  )
}
AlterImage.propTypes = {
  text: PropTypes.string,
}

export default AlterImage
