import React from 'react'
import PropTypes from 'prop-types'
import { ListGroup } from 'react-bootstrap'
import './_table-popup.scss'

const TablePopup = ({ EmployeeView, EmployeeEdit, EmployeeDelete, position }) => {
  return (
    <div className="tablePopup" style={{ top: position + '%' }}>
      <ListGroup>
        <ListGroup.Item onClick={EmployeeView}>View</ListGroup.Item>
        {EmployeeEdit && <ListGroup.Item onClick={EmployeeEdit}>Edit</ListGroup.Item>}
        {EmployeeDelete && <ListGroup.Item onClick={EmployeeDelete}>Delete</ListGroup.Item>}
      </ListGroup>
    </div>
  )
}

TablePopup.propTypes = {
  EmployeeView: PropTypes.func,
  EmployeeEdit: PropTypes.func,
  EmployeeDelete: PropTypes.func,
  position: PropTypes.string || PropTypes.number,
}
export default TablePopup
