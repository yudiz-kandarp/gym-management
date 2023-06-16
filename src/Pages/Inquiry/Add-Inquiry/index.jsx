import CalendarInput from 'Components/Calendar-Input'
import Input from 'Components/Input'
import PageTitle from 'Components/Page-Title'
// import Select from 'Components/Select'
import Wrapper from 'Components/wrapper'
import usePageType from 'Hooks/usePageType'
import { addInquiry, updateInquiry } from 'Query/Inquiry/inquiry.mutation'
import { getSpecificInquiry } from 'Query/Inquiry/inquiry.query'
import { route } from 'Routes/route'
import { toaster } from 'helpers'
import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'

function AddInquiry () {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { control, handleSubmit } = useForm()

  const { isEdit, isViewOnly, id } = usePageType()
  console.log('id :>> ', id)

  const mutation = useMutation((data) => addInquiry(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('inquiry')
      toaster(res.data.message)
      navigate(route.inquiry)
    },
  })
  const updateMutation = useMutation((data) => updateInquiry(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('inquiry')
      toaster(res.data.message)
      navigate(route.transactions)
    },
  })

  const onSubmit = (data) => {
    data.eStatus = data.eStatus.value
    if (isEdit) {
      updateMutation.mutate({ id, data })
    } else {
      mutation.mutate(data)
    }
  }

  const { isLoading } = useQuery(['inquiryDetails', id], () => getSpecificInquiry(id), {
    enabled: isEdit || isViewOnly,
    select: (data) => data.data.inquiry,
    // onSuccess: (data) => {
    //   data.eGender = Gender?.find((g) => g.value === data?.eGender)
    //   reset(data)
    // },
  })

 
  return (
    <>
      <Wrapper isLoading={isLoading || mutation.isLoading || updateMutation.isLoading}>
        <div className="pageTitle-head">
          <PageTitle
            title="Inquiry Details"
            cancelText="Cancel"
            BtnText={!isViewOnly ? 'Save' : null}
            handleButtonEvent={handleSubmit(onSubmit)}
            cancelButtonEvent={() => navigate(route.inquiry)}
          />
        </div>
        <Row className="mt-3">
          <Col lg={6} md={6} xs={12}>
            <Controller
              name="sName"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field, fieldState: { error } }) => (
                <Input {...field} labelText="Customer Name" placeholder="Enter Customer Name" id="sName" disabled={isViewOnly} errorMessage={error?.message} />
              )}
            />
          </Col>
          <Col lg={6} md={6} xs={12}>
            <Controller
              name="sBranchName"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  labelText="Branch Name"
                  placeholder="Enter Branch Name"
                  id="sBranchName"
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
              name="sPurpose"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  labelText="Purpose"
                  placeholder="Enter Purpose"
                  id="sPurpose"
                  disabled={isViewOnly}
                  errorMessage={error?.message}
                />
              )}
            />
          </Col>
          <Col lg={6} md={6} xs={12} className="mt-md-0 mt-3">
            <Controller
              name="dInquiryAt"
              control={control}
              rules={{ required: 'Inquiry Date is required' }}
              render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                <CalendarInput
                  disabled={isViewOnly}
                  onChange={onChange}
                  value={value || (isViewOnly && new Date().toISOString().substring(0, 16))}
                  ref={ref}
                  errorMessage={error?.message}
                  title="Transaction Date"
                />
              )}
            />
          </Col>
        </Row>
        {/* <Row className="mt-2 mt-lg-2 pt-lg-2">
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
        </Row> */}
      </Wrapper>
    </>
  )
}

export default AddInquiry
