import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Row, Col } from 'react-bootstrap'
import Input from 'Components/Input'
import Wrapper from 'Components/wrapper'
import PageTitle from 'Components/Page-Title'
// import Select from 'Components/Select'
import { Loading } from 'Components'
import { toaster } from 'helpers'
import './_addCustomer.scss'
import { route } from 'Routes/route'
import DescriptionInput from 'Components/DescriptionInput'
import Select from 'Components/Select'
import usePageType from 'Hooks/usePageType'
import { addCustomer, updateCustomer } from 'Query/Customer/customer.mutation'
import { getSpecificCustomer } from 'Query/Customer/customer.query'

function AddCustomer() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isEdit, isViewOnly, id } = usePageType()
  const Gender = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Other', value: 'O' },
  ]

  const mutation = useMutation((data) => addCustomer(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('customers')
      toaster(res.data.message)
      navigate(route.customers)
    },
  })
  const updateMutation = useMutation((data) => updateCustomer(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('customers')
      toaster(res.data.message)
      navigate(route.customers)
    },
  })

  const { control, reset, handleSubmit } = useForm()

  const onSubmit = (data) => {
    data.eGender = data.eGender.value
    if (isEdit) {
      updateMutation.mutate({ id, data })
    } else {
      mutation.mutate(data)
    }
  }

  useQuery(['customersDetails', id], () => getSpecificCustomer(id), {
    enabled: isEdit || isViewOnly,
    select: (data) => data?.data?.customer,
    onSuccess: (data) => {
      data.eGender = Gender?.find((g) => g.value === data?.eGender)
      reset(data)
    },
  })

  if (mutation.isLoading || updateMutation.isLoading) {
    return <Loading />
  }
  return (
    <Wrapper>
      <div className="pageTitle-head">
        <PageTitle
          title="Customer Details"
          cancelText="Cancel"
          BtnText={!isViewOnly ? 'Save' : null}
          handleButtonEvent={handleSubmit(onSubmit)}
          cancelButtonEvent={() => navigate(route.customers)}
        />
      </div>
      <Row className="mt-3">
        <Col lg={6} md={6} xs={12}>
          <Controller
            name="sName"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field, fieldState: { error } }) => (
              <Input {...field} labelText="Name" placeholder="Enter Name" id="sName" disabled={isViewOnly} errorMessage={error?.message} />
            )}
          />
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Controller
            name="sEmail"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                labelText="Email ID"
                placeholder="Enter Email"
                id="sEmail"
                disabled={isViewOnly}
                errorMessage={error?.message}
              />
            )}
          />
        </Col>
      </Row>
      <Row className="mt-xs-3">
        <Col lg={6} md={6} xs={12}>
          <Controller
            name="eGender"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <Select
                labelText="Gender"
                id="eGender"
                placeholder="Select Gender"
                onChange={onChange}
                value={value}
                ref={ref}
                isDisabled={isViewOnly}
                errorMessage={error?.message}
                options={Gender}
              />
            )}
          />
        </Col>
        <Col lg={6} md={6} xs={12} className="mt-md-0 mt-3">
          <Controller
            name="nAge"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                labelText="Age"
                type="number"
                disabled={isViewOnly}
                placeholder="Enter Contact Number"
                id="nAge"
                errorMessage={error?.message}
              />
            )}
          />
        </Col>
      </Row>
      <Row className="mt-2 mt-lg-2 pt-lg-2">
        <Col lg={6} md={6} xs={12}>
          <Row>
            <Col lg={12} md={12} xs={12}>
              <Controller
                name="sMobile"
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    labelText="Contact Number"
                    type="number"
                    placeholder="Enter Contact Number"
                    id="sMobile"
                    disabled={isViewOnly}
                    errorMessage={error?.message}
                  />
                )}
              />
            </Col>
          </Row>
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Controller
            name="sAddress"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field, fieldState: { error } }) => (
              <>
                <DescriptionInput
                  className="p-2 text-dark"
                  label="Address"
                  errorMessage={error?.message}
                  disabled={isViewOnly}
                  placeholder="Enter Address"
                  {...field}
                />
              </>
            )}
          />
        </Col>
      </Row>
    </Wrapper>
  )
}

export default AddCustomer
