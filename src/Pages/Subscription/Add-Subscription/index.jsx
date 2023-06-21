import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Row, Col } from 'react-bootstrap'
import Wrapper from 'Components/wrapper'
import PageTitle from 'Components/Page-Title'
import { formatDate, toaster } from 'helpers'
import { route } from 'Routes/route'
import Select from 'Components/Select'
import usePageType from 'Hooks/usePageType'
import { getSpecificSubscription } from 'Query/Subscription/subscription.query'
import './_addSubscription.scss'
import CalendarInput from 'Components/Calendar-Input'
import { addSubscription } from 'Query/Subscription/subscription.mutation'
import { updateSubscription } from 'Query/Subscription/subscription.mutation'
import useInfiniteScroll from 'Hooks/useInfiniteScroll'
import { getCustomerList } from 'Query/Customer/customer.query'
import { getTrainerList } from 'Query/Trainer/trainer.query'

function AddSubscription() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [customerParams, setCustomerParams] = useState({
    limit: 15,
    page: 0,
    next: false,
  })
  const [trainerParams, setTrainerParams] = useState({
    limit: 15,
    page: 0,
    next: false,
  })
  const { isEdit, isViewOnly, id } = usePageType()

  // const ePaymentTag = [
  //   { label: 'Partially', value: 'Partially' },
  //   { label: 'Full', value: 'Full' },
  //   { label: 'Pending', value: 'Pending' },
  // ]
  const ePaymentTag = [
    { label: 'Partially', value: 'P' },
    { label: 'Full', value: 'F' },
    { label: 'Pending', value: 'P' },
  ]

  const mutation = useMutation((data) => addSubscription(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('subscription')
      toaster(res.data.message)
      navigate(route.subscriptions)
    },
  })
  const updateMutation = useMutation((data) => updateSubscription(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('subscription')
      toaster(res.data.message)
      navigate(route.subscriptions)
    },
  })

  const { control, reset, handleSubmit } = useForm()

  const onSubmit = (data) => {
    data.iCustomerId = data.iCustomerId?._id
    data.iTrainerId = data.iTrainerId?._id
    data.ePaymentTag = data.ePaymentTag.value
    if (isEdit) {
      updateMutation.mutate({ id, data })
    } else {
      mutation.mutate(data)
    }
  }

  const { isLoading } = useQuery(['subscriptionDetailss', id], () => getSpecificSubscription(id), {
    enabled: isEdit || isViewOnly,
    select: (data) => data?.data?.subscription,
    onSuccess: (data) => {
      data.dStartDate = formatDate(data.dStartDate, '-', true)
      data.dEndDate = formatDate(data.dEndDate, '-', true)
      data.ePaymentTag = ePaymentTag?.find((g) => g.value === data?.ePaymentTag)
      reset(data)
    },
  })

  const {
    data: customerList = [],
    handleScroll: handleScroll,
    handleSearch: handleSearch,
  } = useInfiniteScroll(['customers', isViewOnly], () => getCustomerList(customerParams), {
    enabled: !isViewOnly,
    select: (data) => data.data.data.customers,
    requestParams: customerParams,
    updater: setCustomerParams,
  })
  const {
    data: TrainerList = [],
    handleScroll: handleScrollTrainer,
    handleSearch: handleSearchTrainer,
  } = useInfiniteScroll(['trainers', isViewOnly], () => getTrainerList(trainerParams), {
    enabled: !isViewOnly,
    select: (data) => data.data.data.trainers,
    requestParams: trainerParams,
    updater: setTrainerParams,
  })

  return (
    <Wrapper isLoading={isLoading || mutation.isLoading || updateMutation.isLoading}>
      <PageTitle
        title="Subscription Details"
        cancelText="Cancel"
        BtnText={!isViewOnly ? 'Save' : null}
        handleButtonEvent={handleSubmit(onSubmit)}
        cancelButtonEvent={() => navigate(route.subscriptions)}
      />
      <Row className="mt-3">
        <Col lg={6} md={6} xs={12}>
          <Controller
            name="iCustomerId"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <Select
                labelText="Customer"
                id="iCustomerId"
                placeholder="Select Customer"
                onChange={onChange}
                getOptionLabel={(option) => option.sName}
                getOptionValue={(option) => option._id}
                value={value}
                ref={ref}
                onInputChange={handleSearch}
                fetchMoreData={handleScroll}
                isDisabled={isViewOnly}
                errorMessage={error?.message}
                options={customerList}
              />
            )}
          />
        </Col>
        <Col lg={6} md={6} xs={12} className="mt-3 mt-md-0">
          <Controller
            name="iTrainerId"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <Select
                labelText="Trainer"
                id="iTrainerId"
                placeholder="Select Trainer"
                onChange={onChange}
                getOptionLabel={(option) => option.sName}
                getOptionValue={(option) => option._id}
                value={value}
                ref={ref}
                onInputChange={handleSearchTrainer}
                fetchMoreData={handleScrollTrainer}
                isDisabled={isViewOnly}
                errorMessage={error?.message}
                options={TrainerList}
              />
            )}
          />
        </Col>
      </Row>

      <Row className="mt-3">
        <Col lg={6} md={6} xs={12}>
          <Controller
            name="dStartDate"
            control={control}
            rules={{ required: 'Start Date is required' }}
            render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
              <CalendarInput
                disabled={isViewOnly}
                onChange={onChange}
                value={value || (isViewOnly && new Date().toISOString().substring(0, 16))}
                ref={ref}
                errorMessage={error?.message}
                title="Start Date"
              />
            )}
          />
        </Col>
        <Col lg={6} md={6} xs={12}>
          <Controller
            name="dEndDate"
            control={control}
            rules={{ required: 'End Date is required' }}
            render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
              <CalendarInput
                disabled={isViewOnly}
                onChange={onChange}
                value={value || (isViewOnly && new Date().toISOString().substring(0, 16))}
                ref={ref}
                errorMessage={error?.message}
                title="End Date"
              />
            )}
          />
        </Col>
      </Row>
      <Row className="mt-1">
        <Col lg={6} md={6} xs={12}>
          <Controller
            name="ePaymentTag"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <Select
                labelText="Payment Tag"
                id="ePaymentTag"
                placeholder="Select Payment Tag"
                onChange={onChange}
                value={value}
                ref={ref}
                isDisabled={isViewOnly}
                errorMessage={error?.message}
                options={ePaymentTag}
              />
            )}
          />
        </Col>
        <Col lg={6} md={6} xs={12} className="mt-3 mt-md-0"></Col>
      </Row>

      <Row className="mt-2 mt-lg-2 pt-lg-2">
        <Col lg={6} md={6} xs={12}></Col>
        <Col lg={6} md={6} xs={12}></Col>
      </Row>
    </Wrapper>
  )
}

export default AddSubscription
