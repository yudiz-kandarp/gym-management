import React, { useEffect } from 'react'
import { useMutation } from 'react-query'
import { Col, Offcanvas, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import { addClient } from 'Query/Client/client.mutation'
import Input from 'Components/Input'
import Select from 'Components/Select'
import Button from 'Components/Button'
import { countries, toaster } from 'helpers'

export default function CreateClient({ show, data, handleClose, onSuccess }) {
  const { control, reset, handleSubmit, getValues } = useForm()

  useEffect(() => reset({ clientName: data }), [data])
  const mutation = useMutation(addClient, {
    onSuccess: (data) => {
      handleClose()
      toaster('Client Added Successfully')
      onSuccess({ sName: getValues('clientName'), _id: data.data.data.id })
    },
  })

  const onSubmit = (data) => {
    const clientData = {
      sName: data.clientName,
      sMobNum: data.clientContactNumber,
      sEmail: data.employeeEmailId,
      sCountry: data.country.name,
      sOtherInfo: '',
    }
    mutation.mutate(clientData)
  }

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Add Client</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Row className="mt-3">
          <Col lg={12} md={12}>
            <Controller
              name="clientName"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field, fieldState: { error } }) => (
                <Input {...field} labelText={'Client Name'} placeholder={'Select'} id={'clientName'} errorMessage={error?.message} />
              )}
            />
          </Col>
          <Col lg={12} md={12}>
            <Controller
              name="employeeEmailId"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field, fieldState: { error } }) => (
                <Input {...field} labelText={'Email ID'} placeholder={'Enter Email'} id={'employeeEmailId'} errorMessage={error?.message} />
              )}
            />
          </Col>
          <Col lg={12} md={12}>
            <Controller
              name="clientContactNumber"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  labelText={'Contact Number'}
                  type={'number'}
                  placeholder={'Enter Contact Number'}
                  id={'clientContactNumber'}
                  errorMessage={error?.message}
                />
              )}
            />
          </Col>
          <Col lg={12} md={12} className="mb-3">
            <Controller
              name="country"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field, fieldState: { error } }) => (
                <Select
                  labelText="Country"
                  height={40}
                  id="country"
                  ref={field.ref}
                  value={field?.value}
                  onChange={field.onChange}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.code}
                  errorMessage={error?.message}
                  options={Object.entries(countries).map(([key, value]) => ({ name: key, code: value }))}
                />
              )}
            />
          </Col>
          <div className="d-flex justify-content-end">
            <Button className="mt-3" onClick={handleSubmit(onSubmit)}>
              Create
            </Button>
          </div>
        </Row>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

CreateClient.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  data: PropTypes.any,
}
