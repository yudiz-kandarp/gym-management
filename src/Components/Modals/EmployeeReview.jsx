import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form } from 'react-bootstrap'

const EmployeeReview = ({ show, handleClose }) => {
  const { employee, open } = show
  return (
    <Modal show={open} onHide={handleClose} centered className="EmployeeReview common-modal">
      <Modal.Header closeButton>
        <Modal.Title>Employee Review</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-body-head">
          <span>Employee Name</span>
          <p>{employee?.sEmployeeName} </p>
        </div>
        <Form.Group>
          <span>Review</span>
          <p>{employee?.sReview || 'No reviews yet'}</p>
        </Form.Group>
      </Modal.Body>
    </Modal>
  )
}
EmployeeReview.propTypes = {
  show: PropTypes.string,
  handleClose: PropTypes.func,
}
export default EmployeeReview
