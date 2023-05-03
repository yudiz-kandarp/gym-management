import React from 'react'
import PropTypes from 'prop-types'
import './_wrapper.scss'
import { Spinner } from 'react-bootstrap'

export default function Wrapper({ transparent, children, className, isLoading, ...props }) {
  return (
    <section className={`${className ? className : ''} wrapper_section ${transparent ? 'transparent' : ''}`} {...props}>
      {children}
      {isLoading && (
        <div className="wrapper-loader d-flex justify-content-center align-items-center w-100">
          <Spinner as="div" animation="border" variant="dark" />
        </div>
      )}
    </section>
  )
}

Wrapper.propTypes = {
  children: PropTypes.any,
  transparent: PropTypes.bool,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
}
