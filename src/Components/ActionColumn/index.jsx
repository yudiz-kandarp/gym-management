import React from 'react'
import PropTypes from 'prop-types'
import CustomToolTip from 'Components/TooltipInfo'
import Eye from 'Assets/Icons/Eye'
import Edit from 'Assets/Icons/Edit'
import Delete from 'Assets/Icons/Delete'
import { isGranted } from 'helpers'
import './_actionColumn.scss'

export default function ActionColumn({ handleView, handleEdit, handleDelete, className, permissions, disabled }) {
  const ViewStyle = !isGranted(permissions?.READ) ? 'hide' : ''
  const EditStyle = !isGranted(permissions?.UPDATE) ? 'hide' : ''
  const DeleteStyle = !isGranted(permissions?.DELETE) ? 'hide' : ''
  return (
    <td
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'end',
        textAlign: 'right',
        opacity: disabled ? 0.4 : 1,
      }}
      className={className}
    >
      {handleView && (
        <CustomToolTip tooltipContent="View" position="top">
          {({ target }) => (
            <span ref={target} className={`1mx-1 cursor-pointer box-highlight table-view ${ViewStyle}`} onClick={!disabled && handleView}>
              <Eye fill="#716cff" />
            </span>
          )}
        </CustomToolTip>
      )}
      {handleEdit && (
        <CustomToolTip tooltipContent="Edit" position="top">
          {({ target }) => (
            <span ref={target} className={`mx-1 cursor-pointer box-highlight table-edit ${EditStyle}`} onClick={!disabled && handleEdit}>
              <Edit fill="#ffb700" />
            </span>
          )}
        </CustomToolTip>
      )}
      {handleDelete && (
        <CustomToolTip tooltipContent="Delete" position="top">
          {({ target }) => (
            <span
              ref={target}
              className={`mx-1 cursor-pointer box-highlight table-delete ${DeleteStyle}`}
              onClick={!disabled && handleDelete}
            >
              <Delete fill="#ff2e69" />
            </span>
          )}
        </CustomToolTip>
      )}
    </td>
  )
}

ActionColumn.propTypes = {
  view: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  handleView: PropTypes.func,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  permissions: PropTypes.object,
}
