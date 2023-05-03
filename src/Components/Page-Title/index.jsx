import React from 'react'
import PropTypes from 'prop-types'
import Button from '../Button'
import { ReactComponent as Add } from 'Assets/Icons/add.svg'
import './_pageTitle.scss'
import { DownloadIcon } from 'Assets/Icons/DownloadIcon'

export default function PageTitle({
  title,
  BtnText,
  handleButtonEvent,
  cancelText,
  extraComponent,
  cancelButtonEvent,
  className,
  loading,
  add,
  handleExcelEvent,
  ...props
}) {
  return (
    <div className={'d-flex align-items-center justify-content-between ' + (className ? className : '')} {...props}>
      <div className=" d-flex align-items-center">
        <h6 className="page-title ms-2">{title}</h6>
      </div>
      <div className="d-flex">
        {extraComponent}
        {cancelText && (
          <Button className="bg-secondary bg-lighten-xl me-2 text-muted" cancel onClick={cancelButtonEvent}>
            {cancelText}
          </Button>
        )}
        {handleExcelEvent && (
          <Button
            className="me-2"
            loading={loading}
            onClick={handleExcelEvent}
            startIcon={handleExcelEvent && <DownloadIcon className="mt-1" />}
          >
            Excel
          </Button>
        )}
        {BtnText && (
          <Button loading={loading} onClick={handleButtonEvent} startIcon={add && <Add />}>
            {BtnText}
          </Button>
        )}
      </div>
    </div>
  )
}

PageTitle.propTypes = {
  title: PropTypes.string,
  BtnText: PropTypes.string,
  handleButtonEvent: PropTypes.func,
  cancelButtonEvent: PropTypes.func,
  handleExcelEvent: PropTypes.func,
  cancelText: PropTypes.string,
  className: PropTypes.string,
  add: PropTypes.bool,
  loading: PropTypes.bool,
  extraComponent: PropTypes.node,
}
