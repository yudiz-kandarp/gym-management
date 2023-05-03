import React from 'react'
import PropTypes from 'prop-types'
import './_descriptionBox.scss'

const DescriptionBox = ({ title }) => {
  return <div className="description-box" dangerouslySetInnerHTML={{ __html: title }}></div>
}

DescriptionBox.propTypes = {
  title: PropTypes.string,
}
export default DescriptionBox
