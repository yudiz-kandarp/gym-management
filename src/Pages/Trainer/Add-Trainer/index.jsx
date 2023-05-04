import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Row, Col } from 'react-bootstrap'
import Input from 'Components/Input'
import Wrapper from 'Components/wrapper'
import PageTitle from 'Components/Page-Title'
import Rating from 'Components/Rating'
import { toaster } from 'helpers'
import { route } from 'Routes/route'
import DescriptionInput from 'Components/DescriptionInput'
import Select from 'Components/Select'
import usePageType from 'Hooks/usePageType'
import { getSpecificTrainer } from 'Query/Trainer/trainer.query'
import './_addTrainer.scss'
import { addTrainer, updateTrainer } from 'Query/Trainer/trainer.mutation'

function AddTrainer() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isEdit, isViewOnly, id } = usePageType()
  const Gender = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Other', value: 'O' },
  ]
  const Type = [
    { label: 'Personal', value: 'Personal' },
    { label: 'Public', value: 'Public' },
  ]

  const mutation = useMutation((data) => addTrainer(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('trainer')
      toaster(res.data.message)
      navigate(route.trainers)
    },
  })
  const updateMutation = useMutation((data) => updateTrainer(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('trainer')
      toaster(res.data.message)
      navigate(route.trainers)
    },
  })

  const { control, reset, handleSubmit } = useForm()

  const onSubmit = (data) => {
    data.eGender = data.eGender.value
    data.eType = data.eType.value
    if (isEdit) {
      updateMutation.mutate({ id, data })
    } else {
      mutation.mutate(data)
    }
  }

  const { isLoading } = useQuery(['trainersDetails', id], () => getSpecificTrainer(id), {
    enabled: isEdit || isViewOnly,
    select: (data) => data?.data?.trainer,
    onSuccess: (data) => {
      data.eGender = Gender?.find((g) => g.value === data?.eGender)
      data.eType = Type?.find((g) => g.value === data?.eType)
      reset(data)
    },
  })

  return (
    <Wrapper isLoading={isLoading || mutation.isLoading || updateMutation.isLoading}>
      <PageTitle
        title="Trainer Details"
        cancelText="Cancel"
        BtnText={!isViewOnly ? 'Save' : null}
        handleButtonEvent={handleSubmit(onSubmit)}
        cancelButtonEvent={() => navigate(route.trainers)}
      />
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
            <Col lg={12} md={12} xs={12}>
              <Controller
                name="eType"
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                  <Select
                    labelText="Type"
                    id="eType"
                    placeholder="Select Type"
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    isDisabled={isViewOnly}
                    errorMessage={error?.message}
                    options={Type}
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
      <Row className="mt-xs-3">
        <Col lg={6} md={6} xs={12}>
          <Controller
            name="nExpertLevel"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div className="rating-container">
                <label className="mb-1">Expert Level</label>
                <Rating setFunction={(data) => onChange(data.eScore)} ratingCount={value} />
                {error?.message && <p className="errorMessage my-2">{error?.message}</p>}
              </div>
            )}
          />
        </Col>
        <Col lg={6} md={6} xs={12} className="mt-md-0 mt-3">
          <Controller
            name="sExperince"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                labelText="Experience"
                disabled={isViewOnly}
                placeholder="Enter Experience "
                id="sExperince"
                errorMessage={error?.message}
              />
            )}
          />
        </Col>
      </Row>
    </Wrapper>
  )
}

export default AddTrainer
