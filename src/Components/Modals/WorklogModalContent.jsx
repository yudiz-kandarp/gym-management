import React, { memo, useCallback, useEffect, useState } from 'react'
import CalendarInput from 'Components/Calendar-Input'
import Input from 'Components/Input'
import Select from 'Components/Select'
import { Col, Form, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getWorklog, getWorklogCr } from 'Query/Worklog/worklog.query'
import CustomModal from 'Components/Modal'
import Button from 'Components/Button'
import useResourceDetails from 'Hooks/useDetails'
import { calculateMinutesBetweenTwoDates, convertMinutesToTime, onlyInt } from 'helpers'
import { addWorklog } from 'Query/Worklog/worklog.mutation'

function WorklogModalContent({ modal, handleAddModalClose }) {
  const queryClient = useQueryClient()
  const { control, handleSubmit, reset, watch, setValue } = useForm()
  const [crs, setCrs] = useState([])

  const addMutation = useMutation(addWorklog, {
    onSuccess: () => {
      queryClient.invalidateQueries('worklogs')
      queryClient.invalidateQueries('projectDashboard')
      handleAddModalClose()
      reset({
        dTaskStartTime: '',
        dTaskEndTime: '',
        nMinutes: '',
        sTaskDetails: '',
        aTaskTag: [],
        iProjectId: null,
        iCrId: null,
      })
    },
  })

  const handleAddEdit = useCallback(
    (e) => {
      const { iProjectId, iCrId, dTaskStartTime, dTaskEndTime, nMinutes, aTaskTag, sTaskDetails, bIsNonBillable } = e
      const data = {
        nMinutes,
        dTaskStartTime,
        dTaskEndTime,
        aTaskTag: aTaskTag.map((tag) => ({ sName: tag.sName, iTaskTag: tag._id })),
        iProjectId: iProjectId._id,
        iCrId: iCrId?._id || null,
        sTaskDetails: aTaskTag?.find((tag) => tag.sName === 'Others') ? sTaskDetails : '',
        bIsNonBillable: bIsNonBillable || false,
      }
      addMutation.mutate(data)
    },
    [modal]
  )

  const {
    resourceDetail,
    handleScroll,
    handleSearch: handleSearchDetail,
    data: d,
  } = useResourceDetails(['projectOfUserLoggedIn', 'worklogTags'])

  function getDetail(property) {
    return { ...d[property], data: resourceDetail?.[property] }
  }

  useEffect(() => {
    setValue('nMinutes', calculateMinutesBetweenTwoDates(watch('dTaskStartTime'), watch('dTaskEndTime')) || 0)
  }, [watch('dTaskStartTime'), watch('dTaskEndTime')])

  useEffect(() => setValue('iProjectId', modal.defaultProject), [modal.defaultProject])

  const { isLoading } = useQuery(['getCrDetail', watch('iProjectId')?._id], () => getWorklog(modal.id), {
    enabled: !!modal.id && !modal.deleteOpen,
    onSuccess: (data) => {
      const log = data.data.data.worklog
      reset({
        dTaskStartTime: log?.dTaskStartTime.substring(0, 16),
        dTaskEndTime: log?.dTaskEndTime.substring(0, 16),
        nMinutes: log?.nMinutes,
        sTaskDetails: log.sTaskDetails,
        aTaskTag: log?.aTaskTag.map((tag) => ({ _id: tag.iTaskTag, sName: tag.sName })),
        iProjectId: log?.iProjectId ? { _id: log.iProjectId, sName: log.sProjectName } : null,
        iCrId: log?.cr ? { _id: log.cr._id, sName: log.cr.sName } : null,
        bIsNonBillable: log.bIsNonBillable || false,
      })
    },
  })

  const { isLoading: isLoadingCrs } = useQuery(
    ['crsByProject', watch('iProjectId')?._id],
    () => getWorklogCr(watch('iProjectId')?._id, { limit: 50 }),
    {
      enabled: !!watch('iProjectId')?._id && !modal.viewOnly,
      onSuccess: (data) => {
        const { project } = data.data.data
        project.length && setCrs(project)
      },
    }
  )

  return (
    <CustomModal
      isLoading={isLoading}
      open={modal.addOpen}
      handleClose={() => {
        handleAddModalClose()
        reset({
          dTaskStartTime: '',
          dTaskEndTime: '',
          nMinutes: '',
          sTaskDetails: '',
          aTaskTag: [],
          iProjectId: null,
          iCrId: null,
        })
      }}
      size="xl"
      //   handleClose={() => setModal({ addOpen: false, mode: modal.id && !modal.viewOnly ? 'edit' : '' })}
      title={modal.id ? (modal.viewOnly ? 'View work Log' : 'Edit Work Log') : 'Add Work Log'}
    >
      <Row>
        <Col>
          <Row className="mb-3">
            <Col>
              <Controller
                name="iProjectId"
                control={control}
                rules={{ required: 'Project field is required' }}
                render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                  <Select
                    isDisabled={modal.viewOnly}
                    onChange={(e) => {
                      setValue('iCrId', null)
                      onChange(e)
                    }}
                    value={value}
                    ref={ref}
                    labelText="Project"
                    getOptionLabel={(option) => option.sName}
                    getOptionValue={(option) => option._id}
                    errorMessage={error?.message}
                    isLoading={getDetail('projectOfUserLoggedIn')?.isLoading}
                    options={getDetail('projectOfUserLoggedIn')?.data || []}
                    fetchMoreData={() => handleScroll('projectOfUserLoggedIn')}
                    onInputChange={(s) => handleSearchDetail('projectOfUserLoggedIn', s)}
                  />
                )}
              />
            </Col>
            <Col>
              <Controller
                name="iCrId"
                control={control}
                render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                  <Select
                    isDisabled={modal.viewOnly}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    labelText="CR"
                    options={crs}
                    isLoading={isLoadingCrs}
                    getOptionLabel={(option) => option.sName}
                    getOptionValue={(option) => option._id}
                    errorMessage={error?.message}
                  />
                )}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xs={6}>
              <Controller
                name="dTaskStartTime"
                control={control}
                rules={{ required: 'Start Date is required' }}
                render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                  <CalendarInput
                    timeAndDate
                    disabled={modal.viewOnly}
                    onChange={onChange}
                    value={value || (modal.viewOnly && new Date().toISOString().substring(0, 16))}
                    ref={ref}
                    errorMessage={error?.message}
                    title="Start Date"
                  />
                )}
              />
            </Col>
            <Col xs={6}>
              <Controller
                name="dTaskEndTime"
                control={control}
                rules={{ required: 'End Date is required' }}
                render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                  <CalendarInput
                    timeAndDate
                    disabled={modal.viewOnly}
                    onChange={onChange}
                    value={value || (modal.viewOnly && new Date().toISOString().substring(0, 16))}
                    ref={ref}
                    errorMessage={error?.message}
                    title="End Date"
                  />
                )}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xs={6}>
              <Controller
                name="nMinutes"
                control={control}
                rules={{ required: 'Work Time is required', min: { value: 1, message: 'must be greater than 0' } }}
                render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                  <Input
                    labelText="Work time (in minute)"
                    ref={ref}
                    placeholder="Add work time"
                    onChange={(e) => onChange(+e.target.value.replace(onlyInt, ''))}
                    endIcon={<div>{convertMinutesToTime(value)}</div>}
                    value={value}
                    errorMessage={error?.message}
                    disabled
                  />
                )}
              />
            </Col>
            <Col xs={6}>
              <div className="d-flex justify-content-start align-items-center h-100">
                <Controller
                  name="bIsNonBillable"
                  control={control}
                  render={({ field: { onChange, value, ref } }) => (
                    <Form.Check
                      type="checkbox"
                      id="bIsNonBillable"
                      onChange={(e) => onChange(e.target.checked)}
                      checked={value}
                      ref={ref}
                      disabled={modal.viewOnly}
                      label="Exclude From Billing"
                    />
                  )}
                />
              </div>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row className="mb-3">
            <Col xs={12}>
              <Controller
                name="aTaskTag"
                control={control}
                rules={{ required: 'Tags are required' }}
                render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                  <Select
                    isDisabled={modal.viewOnly}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    isMulti
                    labelText="Tags"
                    getOptionLabel={(option) => option.sName}
                    getOptionValue={(option) => option._id}
                    errorMessage={error?.message}
                    options={getDetail('worklogTags')?.data || []}
                    isLoading={getDetail('worklogTags')?.isLoading}
                    fetchMoreData={() => handleScroll('worklogTags')}
                    onInputChange={(s) => handleSearchDetail('worklogTags', s)}
                  />
                )}
              />
            </Col>
          </Row>
          {watch('aTaskTag')?.find((tag) => tag.sName === 'Others') && (
            <Row>
              <Form>
                <Form.Group>
                  <Form.Label className="mb-1">Add Description</Form.Label>
                  <Controller
                    name="sTaskDetails"
                    control={control}
                    render={({ field: { onChange, value, ref } }) => (
                      <Form.Control
                        as="textarea"
                        onChange={onChange}
                        value={value}
                        ref={ref}
                        maxLength={10}
                        placeholder="Enter Description"
                        className="p-2 text-dark"
                        disabled={modal.viewOnly}
                      />
                    )}
                  />
                </Form.Group>
              </Form>
            </Row>
          )}
        </Col>
      </Row>

      {!modal?.viewOnly && (
        <div className="d-flex align-items-center justify-content-between mt-4">
          <div></div>
          <Button onClick={handleSubmit(handleAddEdit)}>Add</Button>
        </div>
      )}
    </CustomModal>
  )
}
WorklogModalContent.propTypes = {
  modal: PropTypes.object,
  handleAddModalClose: PropTypes.func,
}

export default memo(WorklogModalContent)
