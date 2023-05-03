/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Popover, Overlay } from 'react-bootstrap'

export default function CustomToolTip({ children, tooltipContent, position = 'top' }) {
  const [show, setShow] = useState(false)
  const target = useRef({ onmouseover: () => null, onmouseout: () => null })
  function toggle(value) {
    setShow((s) => value || !s)
  }

  useEffect(() => {
    target.current.onmouseover = () => setShow(true)
    target.current.onmouseout = () => setShow(false)
  }, [target.current])
  return (
    <>
      <React.Fragment ref={typeof children !== 'function' ? target : null}>
        {typeof children !== 'function' ? children : children({ toggle, target })}
      </React.Fragment>
      {tooltipContent ? (
        <Overlay target={target.current} show={show} placement={position}>
          {({ arrowProps, show, popper, placement, hasDoneInitialMeasure, ...props }) => (
            <Popover>
              <Popover.Body
                {...props}
                style={{
                  position: 'absolute',
                  backgroundColor: 'rgba(255, 100, 100, 0.85)',
                  color: '#fff',
                  borderRadius: 8,
                  margin: position === 'top' || position === 'bottom' ? '6px 0' : '0 10px',
                  fontSize: '12px',
                  background: '#000',
                  maxWidth: '200px',
                  width: 'max-content',
                  ...props.style,
                }}
                className="p-2 position-absolute"
              >
                {tooltipContent || ''}
              </Popover.Body>
            </Popover>
          )}
        </Overlay>
      ) : null}
    </>
  )
}

CustomToolTip.propTypes = {
  children: PropTypes.any,
  tooltipContent: PropTypes.any,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
}
