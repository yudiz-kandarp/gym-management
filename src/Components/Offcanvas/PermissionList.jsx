import React, { useEffect, useState } from 'react'
import { Col, Offcanvas, Row, FormCheck } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { Controller, useForm } from 'react-hook-form'
import Select from 'Components/Select'
import Button from 'Components/Button'
import Search from 'Components/Search'
import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'

export default function PermissionList({ show, handleClose, rules, roleData, roleDetail, permissionData, savedPermission }) {
  const { control } = useForm()
  
  const [displayedPermissions, setDisplayedPermissions] = useState([])
  const [checkedPermissions, setCheckedPermissions] = useState([])
  const [roleWiseCheckedPermissions, setRoleWiseCheckedPermissions] = useState([])
  const [selectedRoles, setSelectedRoles] = useState([])
  const [search, setSearch] = useState('')

  const multiCheckedColor = 'darkorange'
  const extraCheckedColor = '#0487ff'

  const reset = () => {
    setCheckedPermissions([])
    setRoleWiseCheckedPermissions([])
    setSelectedRoles([])
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(e.target.value)
    setDisplayedPermissions(permissionData.filter(item => {
      if(item.sName && e.target.value){
        return item.sName.toLowerCase().includes(e.target.value.toLowerCase())
      }
      return true
    }))
  }

  const handleClickPermission = (isChecked, permission) => {
    const tempCheckedPermission = Object.assign([], checkedPermissions)
    const tempRoleWiseCheckedPermissions = Object.assign([], roleWiseCheckedPermissions)
    if (isChecked) {
      if (!tempCheckedPermission.includes(permission)) {
        tempCheckedPermission.push(permission)
        setCheckedPermissions(tempCheckedPermission)
      }
      if (!tempRoleWiseCheckedPermissions.includes(permission)) {
        tempRoleWiseCheckedPermissions.push(permission)
        setRoleWiseCheckedPermissions(tempRoleWiseCheckedPermissions)
      }
    } else {
      if (tempCheckedPermission.includes(permission)) {
        tempCheckedPermission.splice(tempCheckedPermission.indexOf(permission), 1)
        setCheckedPermissions(tempCheckedPermission)
      }
      if (tempRoleWiseCheckedPermissions.includes(permission)) {
        tempRoleWiseCheckedPermissions.splice(tempRoleWiseCheckedPermissions.indexOf(permission), 1)
        setRoleWiseCheckedPermissions(tempRoleWiseCheckedPermissions)
      }
      if (selectedRoles?.length) {
        const filteredSelectedRole = selectedRoles.filter((item) =>
          item.aPermissions.some((i) => roleWiseCheckedPermissions.includes(i) && i !== permission)
        )
        setSelectedRoles(filteredSelectedRole)
      }
    }
  }

  const returnPermission = () => {
    const concatArray = checkedPermissions.concat(roleWiseCheckedPermissions)
    return concatArray.filter((item, index) => concatArray.indexOf(item) === index)
  }

  const getCheckboxCheckedColor = (permissionId) => {
    if(permissionId && selectedRoles?.length) {
      const filterRoles = selectedRoles.filter(i => i?.aPermissions?.includes(permissionId))
      if(filterRoles?.length === 1 && filterRoles[0].sTextColor) {
        return filterRoles[0].sTextColor
      } else if (filterRoles?.length > 1) {
        return multiCheckedColor
      }
    }
    return extraCheckedColor
  }

  useEffect(() => {
    setDisplayedPermissions(permissionData)
  }, [permissionData])

  useEffect(() => {
    if (show) {
      setSelectedRoles(savedPermission?.roles)
      setCheckedPermissions(savedPermission?.checkedPermissions)
      setRoleWiseCheckedPermissions(savedPermission?.roleWiseCheckedPermissions)
    }
  }, [savedPermission, show])

  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = data.sTextColor
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? data.sTextColor
          : isFocused
          ? color.replace(')', ', 0.1)')
          : undefined,
        color: isDisabled
          ? '#ccc'
          : isSelected
          ? color
            ? 'white'
            : 'black'
          : data.sTextColor,
        cursor: isDisabled ? 'not-allowed' : 'default',
  
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled
            ? isSelected
              ? data.sTextColor
              : color.replace(')', ', 0.3)')
            : undefined,
        },
      }
    },
    multiValue: (styles, { data }) => {
      const color = data.sTextColor
      return {
        ...styles,
        backgroundColor: color.replace(')', ', 0.1)'),
      }
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: data.sTextColor,
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: data.sTextColor,
      ':hover': {
        backgroundColor: data.sTextColor,
        color: 'white',
      },
    }),
  }

  return (
    <Offcanvas
      show={show}
      onHide={() =>
        handleClose({
          isSavedData: false,
          roleWiseCheckedPermissions: savedPermission?.roleWiseCheckedPermissions,
          checkedPermissions: savedPermission?.checkedPermissions,
        })
      }
      placement="end"
      className="permission-modal"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Add / Remove Permission</Offcanvas.Title>
        <div>
          <Button className="bg-secondary bg-lighten-xl me-2 text-muted" cancel onClick={reset}>
            Clear
          </Button>
          <Button
            onClick={() =>
              handleClose({
                isSavedData: true,
                roles: selectedRoles,
                permissions: returnPermission(),
                roleWiseCheckedPermissions,
                checkedPermissions,
              })
            }
          >
            Save
          </Button>
        </div>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Row>
          <Col lg={12} md={12}>
            <Controller
              name="aRole"
              control={control}
              rules={rules.global()}
              render={({ field: { ref }, fieldState: { error } }) => {
                return (
                  <Select
                    ref={ref}
                    placeholder="Select Role"
                    id="aRole"
                    value={selectedRoles}
                    onChange={(e) => {
                      setSelectedRoles(e)
                      if (e?.length) {
                        const allPermissions = e.map((item) => item.aPermissions)
                        const allPermissionIds = [].concat.apply([], allPermissions)
                        const uniquePermissionIds = allPermissionIds.filter((item, index) => allPermissionIds.indexOf(item) === index)
                        setRoleWiseCheckedPermissions(uniquePermissionIds)
                      } else {
                        setRoleWiseCheckedPermissions(checkedPermissions)
                      }
                    }}
                    isMulti
                    errorMessage={error?.message}
                    getOptionLabel={(option) => option.sName}
                    getOptionValue={(option) => option._id}
                    options={roleData}
                    isLoading={roleDetail?.isLoading}
                    styles={colourStyles}
                  />
                )
              }}
            />
          </Col>
          <Col lg={12} md={12} className="mt-3">
            <Search startIcon={<SearchIcon className="mb-1" />} placeholder="Search Permission" value={search} onChange={handleSearch} />
          </Col>
        </Row>
        <div style={{ display: 'flex', height: 15, fontSize: 12, marginBottom: 10 }}>
          <div style={{ backgroundColor: multiCheckedColor, width: 15, borderRadius: 3}} />
          <div style={{ margin: '0 5px'}}>Common Permission in Selected Roles</div>
          <div style={{ marginLeft: 10, backgroundColor: extraCheckedColor, width: 15, borderRadius: 3}} />
          <div style={{ margin: '0 5px'}}>Extra Permission</div>
        </div>
        <Row className="mt-3">
          {displayedPermissions?.length ? (
            displayedPermissions.map((item, index) => (
              <Col md={4} sm={6} key={index} className="mb-3">
                <Controller
                  name="permissionName"
                  control={control}
                  render={({ field: { ref } }) => (
                    <FormCheck style={{
                      width: 'auto',
                    }}>
                      <FormCheck.Input id={`${index}permissionName`} type='checkbox'
                      onChange={(e) => handleClickPermission(e.target.checked, item._id)}
                      checked={checkedPermissions.some((i) => i === item._id) || roleWiseCheckedPermissions.some((i) => i === item._id)}
                      value={item._id}
                      ref={ref}
                      style={{
                        accentColor: getCheckboxCheckedColor(item._id)
                      }}
                       />
                      <FormCheck.Label>{item.sName}</FormCheck.Label>
                    </FormCheck>
                  )}
                />
              </Col>
            ))
          ) : (
            <div>{permissionData?.length ? 'You hide all records with search' : 'No Records Found'}</div>
          )}
        </Row>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

PermissionList.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  rules: PropTypes.arrayOf(
    PropTypes.shape({
      [PropTypes.string]: PropTypes.func,
    })
  ),
  roleData: PropTypes.array,
  roleDetail: PropTypes.shape({
    isLoading: PropTypes.bool,
  }),
  permissionData: PropTypes.arrayOf(
    PropTypes.shape({
      sName: PropTypes.string,
    })
  ),
  savedPermission: PropTypes.arrayOf({
    roles: PropTypes.arrayOf({
      _id: PropTypes.string,
    }),
    permissions: PropTypes.arrayOf(PropTypes.string),
    displayedPermissions: PropTypes.arrayOf(PropTypes.string),
    checkedPermissions: PropTypes.arrayOf(PropTypes.string),
  }),
}
