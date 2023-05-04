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
import { getSpecificTransaction } from 'Query/Transaction/transaction.query'
import './_addTransaction.scss'
import CalendarInput from 'Components/Calendar-Input'
import { addTransaction } from 'Query/Transaction/transaction.mutation'
import { updateTransaction } from 'Query/Transaction/transaction.mutation'
import useInfiniteScroll from 'Hooks/useInfiniteScroll'
import { getSubscriptionList } from 'Query/Subscription/subscription.query'
import Input from 'Components/Input'

function AddTransaction() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [subscriptionParams, setSubscriptionParams] = useState({
    limit: 15,
    page: 0,
    next: false,
  })
  const { isEdit, isViewOnly, id } = usePageType()

  const ePaymentTag = [
    { label: 'Partially', value: 'Partially' },
    { label: 'Full', value: 'Full' },
    { label: 'Pending', value: 'Pending' },
  ]

  const mutation = useMutation((data) => addTransaction(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('transaction')
      toaster(res.data.message)
      navigate(route.transactions)
    },
  })
  const updateMutation = useMutation((data) => updateTransaction(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('transaction')
      toaster(res.data.message)
      navigate(route.transactions)
    },
  })

  const { control, reset, handleSubmit } = useForm()

  const onSubmit = (data) => {
    data.iSubscriptionId = data.iSubscriptionId?._id
    data.iTrainerId = data.iTrainerId?._id
    data.ePaymentTag = data.ePaymentTag.value
    delete data.iCustomerId
    if (isEdit) {
      updateMutation.mutate({ id, data })
    } else {
      mutation.mutate(data)
    }
  }

  const { isLoading } = useQuery(['transactionDetails', id], () => getSpecificTransaction(id), {
    enabled: isEdit || isViewOnly,
    select: (data) => data?.data?.transaction,
    onSuccess: (data) => {
      data.iSubscriptionId.oCustomer = data.iSubscriptionId.iCustomerId
      data.dTransactionDate = formatDate(data.dTransactionDate, '-', true)
      data.ePaymentTag = ePaymentTag?.find((g) => g.value === data?.ePaymentTag)
      reset(data)
    },
  })

  const {
    data: subscriptionList = [],
    handleScroll: handleScroll,
    handleSearch: handleSearch,
  } = useInfiniteScroll(['customers', isViewOnly], () => getSubscriptionList(subscriptionParams), {
    enabled: !isViewOnly,
    select: (data) => data.data.data.subscribedUsers,
    requestParams: subscriptionParams,
    updater: setSubscriptionParams,
  })

  return (
    <Wrapper isLoading={isLoading || mutation.isLoading || updateMutation.isLoading}>
      <PageTitle
        title="Transaction Details"
        cancelText="Cancel"
        BtnText={!isViewOnly ? 'Save' : null}
        handleButtonEvent={handleSubmit(onSubmit)}
        cancelButtonEvent={() => navigate(route.transactions)}
      />
      <Row className="mt-3">
        <Col lg={12} md={12} xs={12}>
          <Controller
            name="iSubscriptionId"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <Select
                labelText="Subscription"
                id="iSubscriptionId"
                placeholder="Select Subscription"
                onChange={onChange}
                getOptionLabel={(option) => (
                  <>
                    {option?.oCustomer?.sName} <span className="ms-4 text-success">{formatDate(option?.dStartDate)}</span> to{' '}
                    <span className="text-danger"> {formatDate(option?.dEndDate)}</span>
                  </>
                )}
                getOptionValue={(option) => option._id}
                value={value}
                ref={ref}
                onInputChange={handleSearch}
                fetchMoreData={handleScroll}
                isDisabled={isViewOnly}
                errorMessage={error?.message}
                options={subscriptionList}
              />
            )}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col lg={6} md={6} xs={12}>
          <Controller
            name="dTransactionDate"
            control={control}
            rules={{ required: 'Start Date is required' }}
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
        <Col lg={6} md={6} xs={12}>
          <Controller
            name="nPrice"
            control={control}
            rules={{ required: 'This field is required', validate: (value) => value > 0 || 'Invalid Value' }}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <Input
                labelText="Transaction Amount"
                id="nPrice"
                placeholder="Add Price"
                type="number"
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
    </Wrapper>
  )
}

export default AddTransaction
