import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'
import './_calendar-input.scss'
import { detectBrowser } from 'helpers'
import Cancel from 'Assets/Icons/Cancel'

// eslint-disable-next-line no-unused-vars
function CalendarInput({ value, onChange, timeAndDate, defaultValue, disabled, ...props }, ref) {
  return (
    <Form.Group className="input">
      {props.title && <Form.Label className='m-0'>{props.title}</Form.Label>}
      <div
        className={`calendar-input ${value ? '' : detectBrowser() === 'Safari' ? 'showPlaceholder' : ''} ${
          props.errorMessage ? 'errorInput' : ''
        }`}
      >
        <input
          disabled={disabled}
          defaultValue={defaultValue || ''}
          ref={(r) => (ref = r)}
          value={value}
          onChange={onChange}
          {...props}
          type={timeAndDate ? 'datetime-local' : 'date'}
        />
        {value && !disabled ? (
          <div
            className="date-cancel-btn"
            onClick={() => {
              ref.value = ''
              ref.defaultValue = ''
              onChange({
                target: {
                  value: '',
                  defaultValue: '',
                },
              })
            }}
          >
            <Cancel fill="gray" />
          </div>
        ) : null}
      </div>
      {props.errorMessage && <p className="errorMessage">{props.errorMessage}</p>}
    </Form.Group>
  )
}
CalendarInput.propTypes = {
  title: PropTypes.string,
  defaultValue: PropTypes.string,
  disableError: PropTypes.bool,
  timeAndDate: PropTypes.bool,
  errorMessage: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
}
export default forwardRef(CalendarInput)
