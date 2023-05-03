import React, { useId } from 'react'
import PropTypes from 'prop-types'
import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  {
    type = 'text',
    labelText,
    onChange,
    errorMessage,
    inputContainerClass,
    inputContainerStyle,
    value,
    id,
    disableError,
    className,
    startIcon,
    endIcon,
    ...props
  },
  ref
) {
  const RandomId = useId()

  return (
    <>
      {!disableError ? (
        <>
          <div className={`d-flex input ${inputContainerClass || ''}`} style={inputContainerStyle}>
            {labelText && <label htmlFor={id || RandomId}>{labelText}</label>}
            <div className="input-field">
              {startIcon && (
                <div>
                  <label htmlFor={id || RandomId} className="set_input_icon">
                    {startIcon}
                  </label>
                </div>
              )}
              <input
                ref={ref}
                onChange={onChange}
                value={value}
                id={id || RandomId}
                className={`${className || ''} ${errorMessage ? 'errorInput' : ''} ${startIcon ? 'ps-5' : ''} `}
                {...props}
                type={type}
              />
              {endIcon && (
                <div>
                  <label htmlFor={id || RandomId} className="set_end_input_icon">
                    {endIcon}
                  </label>
                </div>
              )}
            </div>
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
          </div>
        </>
      ) : (
        <>
          <div className={`d-flex input ${inputContainerClass || ''}`} style={inputContainerStyle}>
            {labelText && <label htmlFor={id || RandomId}>{labelText}</label>}
            <div className="input-field">
              {startIcon && (
                <div>
                  <label htmlFor={id || RandomId} className="set_input_icon">
                    {startIcon}
                  </label>
                </div>
              )}
              <input
                ref={ref}
                onChange={onChange}
                value={value}
                id={id || RandomId}
                className={`${className || ''} ${errorMessage ? 'errorInput' : ''} ${startIcon ? 'ps-5' : ''} `}
                {...props}
                type={type}
              />
            </div>
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
          </div>
        </>
      )}
    </>
  )
})

Input.propTypes = {
  id: PropTypes.string,
  labelText: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  errorMessage: PropTypes.string,
  value: PropTypes.any,
  inputContainerClass: PropTypes.string,
  inputContainerStyle: PropTypes.object,
  onChange: PropTypes.func,
  disableError: PropTypes.bool,
  startIcon: PropTypes.any,
  endIcon: PropTypes.any,
}

export default Input
