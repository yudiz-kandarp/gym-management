import React, { useId } from 'react'
import PropTypes from 'prop-types'
import './_description.scss'

export default function DescriptionInput({ label, className, errorMessage, ...props }) {
  const id = useId()
  return (
    <div className="textarea-container">
      {label ? <label htmlFor={id}>{label}</label> : false}
      <textarea id={id} {...props} className={`${className} ${errorMessage ? 'errorInput' : ''} description`} />
      {errorMessage && <p className="errorMessage">{errorMessage}</p>}
    </div>
  )
}
DescriptionInput.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.string,
  errorMessage: PropTypes.object,
}
