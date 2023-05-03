import React from 'react'
import PropTypes from 'prop-types'
import { Form, Spinner } from 'react-bootstrap'
import { ReactComponent as Up } from 'Assets/Icons/upArrow.svg'
import { ReactComponent as Down } from 'Assets/Icons/downArrow.svg'
import './_datatable.scss'
import CustomToolTip from 'Components/TooltipInfo'
import Delete from 'Assets/Icons/Delete'
// import Divider from 'Components/Divider'

export default function DataTable({
  columns,
  align,
  children,
  disableActions,
  totalData,
  isLoading,
  handleSorting,
  actionPadding,
  actionAlign,
  footer,
  handleBulkActions,
  onMultiSelect,
  selectedValues,
}) {
  return (
    <div className={'datatable_container' + (isLoading ? ' hide-table-scroll' : '')}>
      <div className="my-2">
        {selectedValues?.some((d) => d.isSelected) ? (
          <>
            <CustomToolTip tooltipContent="Delete Selected" position="top">
              {({ target }) => (
                <span
                  ref={target}
                  className="mx-1 cursor-pointer box-highlight table-delete"
                  onClick={() => handleBulkActions({ type: 'multi-delete' })}
                >
                  <Delete fill="#ff2e69" />
                </span>
              )}
            </CustomToolTip>
            {/* <Divider className="m-0 p-0" width={'100%'} height="1px" /> */}
          </>
        ) : null}
      </div>

      <table className="datatable">
        <thead>
          <tr>
            {onMultiSelect ? (
              <td align={align || 'left'} key="multi-select" style={{ textAlign: align || 'left' }}>
                <Form.Check
                  type="checkbox"
                  id="select-all-value"
                  name="select-all-value"
                  className="form-check my-1 pt-1"
                  onChange={onMultiSelect}
                  checked={selectedValues?.length ? selectedValues?.every((item) => item.isSelected) : false}
                  label="&nbsp;"
                />
              </td>
            ) : null}
            {columns?.map((column, i) =>
              column.hide ? null : (
                <td align={align || 'left'} key={column.connectionName + i} style={{ textAlign: align || 'left' }}>
                  <div
                    onClick={() => {
                      column.isSorting && handleSorting(column.connectionName)
                    }}
                    className={`d-flex align-items-center ${column.isSorting ? 'column-head' : ''}`}
                    style={{ width: 'fit-content' }}
                  >
                    {column.name}
                    {column.sort === 0 && column.isSorting && (
                      <div className="ms-2 d-flex flex-column">
                        <Up />
                        <Down style={{ marginTop: '2px' }} />
                      </div>
                    )}
                    <div className="ms-2 d-flex flex-column">
                      <Up style={{ opacity: column.sort === 1 ? 1 : 0 }} />
                      <Down style={{ marginTop: '2px', opacity: column.sort === -1 ? 1 : 0 }} />
                    </div>
                  </div>
                </td>
              )
            )}
            {!disableActions && (
              <td align={actionAlign || 'right'} style={{ paddingRight: actionPadding || '45px' }}>
                Actions
              </td>
            )}
          </tr>
        </thead>
        <tbody style={{ textAlign: align || 'left' }}>
          {children}
          {(totalData === 0 || !totalData) && (
            <tr className="w-100">
              <td colSpan={columns.length + (disableActions ? 0 : 1)}>
                <h3 className="mt-2 w-100 fs-6 d-flex justify-content-center">No Records Found</h3>
              </td>
            </tr>
          )}
        </tbody>
        {footer && <tfoot>{footer}</tfoot>}
      </table>
      {isLoading && (
        <div className="table-loader d-flex justify-content-center align-items-center w-100">
          <Spinner as="div" animation="border" variant="dark" />
        </div>
      )}
    </div>
  )
}

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  children: PropTypes.node,
  footer: PropTypes.node,
  align: PropTypes.string,
  actionAlign: PropTypes.string,
  disableActions: PropTypes.bool,
  isLoading: PropTypes.bool,
  totalData: PropTypes.number,
  actionPadding: PropTypes.string,
  handleSorting: PropTypes.func,
  onMultiSelect: PropTypes.func,
  handleBulkActions: PropTypes.func,
  selectedValues: PropTypes.array,
}
