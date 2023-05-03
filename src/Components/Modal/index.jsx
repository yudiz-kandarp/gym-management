import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-bootstrap/Modal'
import Wrapper from 'Components/wrapper'

export default function CustomModal({
  open,
  handleClose,
  title,
  children,
  isLoading,
  disableHeader,
  className,
  modalBodyClassName,
  fullscreen = false,
  size = 'md',
  ...props
}) {
  return (
    <Modal
      show={open}
      onHide={handleClose}
      size={size || ''}
      centered
      animation
      dialogClassName={className || 'modal-100w'}
      fullscreen={fullscreen}
      className={`common-modal`}
      {...props}
    >
      {!disableHeader && (
        <Modal.Header closeButton>
          <span className="modal-title" style={{ fontWeight: 'bold' }}>
            {title}
          </span>
        </Modal.Header>
      )}
      <Modal.Body className={modalBodyClassName || ''} style={{ maxWidth: '100%' }}>
        <Wrapper transparent isLoading={isLoading}>
          {children}
        </Wrapper>
      </Modal.Body>
    </Modal>
  )
}

CustomModal.propTypes = {
  open: PropTypes.bool,
  isLoading: PropTypes.bool,
  fullscreen: PropTypes.bool,
  disableHeader: PropTypes.bool,
  handleClose: PropTypes.func,
  children: PropTypes.node,
  title: PropTypes.node,
  size: PropTypes.string,
  className: PropTypes.string,
  modalBodyClassName: PropTypes.string,
}
