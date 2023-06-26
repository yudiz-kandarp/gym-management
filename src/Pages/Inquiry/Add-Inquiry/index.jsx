/* eslint-disable no-unused-vars */
import ActionColumn from 'Components/ActionColumn'
import CalendarInput from 'Components/Calendar-Input'
import DataTable from 'Components/DataTable'
import DescriptionInput from 'Components/DescriptionInput'
import Input from 'Components/Input'
import CustomModal from 'Components/Modal'
import PageTitle from 'Components/Page-Title'
import Wrapper from 'Components/wrapper'
import usePageType from 'Hooks/usePageType'
import { addInquiry, addInquiryFollowUp, addInquiryVisit, deleteInquiry, deleteInquiryFollowUp, deleteInquiryVisit, updateInquiry, updateInquiryFollowUp, updateInquiryVisit } from 'Query/Inquiry/inquiry.mutation'
import { getInquiryFollowUpList, getInquiryVisitList, getSpecificInquiry, getSpecificInquiryFollowUp, getSpecificInquiryVisit } from 'Query/Inquiry/inquiry.query'
import { route } from 'Routes/route'
import { appendParams, cell, formatDate, getSortedColumns, isGranted, parseParams, toaster } from 'helpers'
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import Button from 'Components/Button'
import TablePagination from 'Components/Table-pagination'
import Select from 'Components/Select'
import { getOrganizationList } from 'Query/Organization/organization.query'

function AddInquiry () {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { control, handleSubmit, reset } = useForm()
  const { control: visitControl, handleSubmit: handleVisitSubmit, reset: resetVisit } = useForm()
  const { control: followUpControl, handleSubmit: handleFollowUpSubmit, reset: resetFollowUp } = useForm()

  const [action, setAction] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [inquiryId, setInquiryId] = useState('')
  const [organization, setOrganization] = useState([])

  const [inquiryVisitId, setInquiryVisitId] = useState(null)
  const [followUpId, setFollowUpId] = useState(null)

  const [modalVisit, setModalVisit] = useState({ open: false })
  const [modalFollowUp, setModalFollowUp] = useState({ open: false })
  const [modalDeleteVisit, setModalDeleteVisit] = useState({ open: false })
  const [modalDeleteFollowUp, setModalDeleteFollowUp] = useState({ open: false })

  const parsedData = parseParams(location.search)
  function getParams () {
    return {
      page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
      limit: Number(parsedData?.limit) || 10,
      search: parsedData?.search || '',
      sort: parsedData.sort || '',
      order: parsedData.order || '',
      isBranch: parsedData.isBranch || true
    }
  }
  const [requestParams, setRequestParams] = useState(getParams())

  const { isAdd, isEdit, isViewOnly, id } = usePageType()

  useEffect(() => {
    setInquiryId(id)
  }, [id])

  const { mutate: mutateAddInquiry, isLoading: isAddingInquiry } = useMutation((data) => addInquiry(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('inquiry')
      toaster(res.data.message)
      navigate(route.inquiry)

      reset({
        sPurpose: res?.data?.sPurpose,
        sDescription: res?.data?.sDescription,
        sPreferredLocation: res?.data?.sPreferredLocation,
        sName: res?.data?.sName,
        sEmail: res?.data?.sEmail,
        sPhone: res?.data?.sPhone,
        sSecondaryPhone: res?.data?.sSecondaryPhone,
        dFollowupDate: formatDate(res?.data.dFollowupDate, '-', true),
        dInquiryAt: formatDate(res?.data.dInquiryAt, '-', true),
        iBranchId: res?.data?.iBranchId?._id,
      })
    },
  })

  const updateMutation = useMutation((data) => updateInquiry(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('inquiry')
      toaster(res.data.message)
      navigate(route.inquiry)
    },
  })

  const { isLoading, data: specificInquiry } = useQuery(['inquiryDetails', id], () => getSpecificInquiry(id), {
    enabled: isEdit || isViewOnly,
    select: (data) => data.data.inquiry,
    onSuccess: (data) => {
      console.log('data >> ', data)
      // data.dInquiryAt = formatDate(data.dInquiryAt, '-', true)
      // data.dFollowupDate = formatDate(data.dFollowupDate, '-', true)
      reset({
        sPurpose: data?.sPurpose,
        sDescription: data?.sDescription,
        sPreferredLocation: data?.sPreferredLocation,
        sName: data?.sName,
        sEmail: data?.sEmail,
        sPhone: data?.sPhone,
        sSecondaryPhone: data?.sSecondaryPhone,
        dFollowupDate: formatDate(data.dFollowupDate, '-', true),
        dInquiryAt: formatDate(data.dInquiryAt, '-', true),
        iBranchId: data?.iBranchId,
      })
    },
  })
  console.log({ specificInquiry, control })

  const { data: organizationList } = useQuery(['organizationList', id], () => getOrganizationList(requestParams), {
    enabled: isAdd || isEdit || isViewOnly,
    select: (data) => data.data.data.aOrganizationList,
    staleTime: 240000,
    onSuccess: (data) => {
      // const oVisit = data.find(item => item.dVisitedAt)
      // setVisitData(data)
      setOrganization(data.map(({ _id, sName }) => ({ _id, sName })))
      
    },
  })
  console.log('organinzation data >> ', organization)

  const onSubmit = (data) => {
    console.log({ id, data })

    if (isEdit) {
      updateMutation.mutate({ id, data })
    } else {
      mutateAddInquiry(...data,)
    }
  }

  // inquiry Visit
  const [visitColumns] = useState(
    getSortedColumns(
      [
        { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
        { name: 'Created By', connectionName: 'sUserName', isSorting: false, sort: 0 },
        { name: 'Purpose', connectionName: 'sPurpose', isSorting: false, sort: 0 },
        { name: 'Description', connectionName: 'sDescription', isSorting: false, sort: 0 },
        { name: 'Visited At', connectionName: 'dVistedAt', isSorting: false, sort: 0 },
      ],
      parsedData
    )
  )

  const { data: visit } = useQuery(['inquiryVisit', id], () => getInquiryVisitList(id), {
    enabled: isEdit || isViewOnly,
    select: (data) => data.data.data.aInquiryVisitList,
    staleTime: 240000,
    onSuccess: (data) => {
      // const oVisit = data.find(item => item.dVisitedAt)
      // setVisitData(data)
    },
  })

  const { data: specificVisit } = useQuery(['visitListDetail'], () => getSpecificInquiryVisit(inquiryVisitId), {
    enabled: !!inquiryVisitId,
    select: (data) => data.data.inquiryVisit,
    onSuccess: (data) => {
      data.dVisitedAt = formatDate(data.dVisitedAt, '-', true)
      resetVisit(data)
    },
  })

  const { mutate: mutateAddVisit } = useMutation((data) => addInquiryVisit(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('inquiryVisit')
      toaster(res.data.message)
      setModalVisit({ open: false })
      navigate(route.inquiryAddViewEdit('view', id))
    },
  })

  const { mutate: mutateUpdateVisit } = useMutation((inquiryVisitId, onSubmitData) => updateInquiryVisit(inquiryVisitId, onSubmitData), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('inquiryVisit')
      toaster(res.data.message)
      setModalVisit({ open: false })
      navigate(route.inquiryAddViewEdit('view', id))
    },
  })

  // delete mutation
  const { mutate: deleteVisitMutation } = useMutation(() => deleteInquiryVisit(deleteId, inquiryId), {
    onSuccess: (data) => {
      toaster(data.data.message)
      queryClient.invalidateQueries('inquiryVisit')
      setModalDeleteVisit({ open: false })
    },
  })

  const onVisitSubmit = (onSubmitData) => {
    const addData = {
      sPurpose: onSubmitData.sPurpose,
      sDescription: onSubmitData.sDescription,
      dVisitedAt: onSubmitData.dVisitedAt,
      iInquiryID: inquiryId
    }
    if (action === 'edit') {
      mutateUpdateVisit({ inquiryVisitId, onSubmitData })
    } else {
      mutateAddVisit({
        addData
      })
    }
    setModalVisit({ open: true })
  }

  function gotoAdd (data) {
    resetVisit(data)
    setAction('add')
    setModalVisit({ open: true, })
  }

  function gotoEdit (id) {
    setAction('edit')
    setInquiryVisitId(id)
    setModalVisit({ open: true, id })

    resetVisit({
      sPurpose: specificVisit?.sPurpose,
      dVisitedAt: formatDate(specificVisit?.dVisitedAt),
      sDescription: specificVisit?.sDescription,
    })
  }

  function gotoDetail (id) {
    setAction('view')
    setInquiryVisitId(id)
    setModalVisit({ open: true, inquiryVisitId })
  }

  function onDelete (id) {
    setAction('delete')
    setDeleteId(id)
    setModalDeleteVisit({ open: true, id, inquiryId })
  }

  function onVisitCancel () {
    setModalVisit({ open: false })
    setInquiryVisitId(null)
  }

  // inquiry followUp
  const [followUpColumns] = useState(
    getSortedColumns(
      [
        { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
        { name: 'FollowedUp By', connectionName: 'sFollowedUpBy', isSorting: false, sort: 0 },
        { name: 'Response', connectionName: 'sResponse', isSorting: false, sort: 0 },
        { name: 'FollowedUp At', connectionName: 'dFollowupAt', isSorting: false, sort: 0 },
      ],
      parsedData
    )
  )

  const { data: followUp } = useQuery(['inquiryFollowup', id], () => getInquiryFollowUpList(id), {
    enabled: isEdit || isViewOnly,
    select: (data) => data.data.data.aInquiryFollowupList,
    staleTime: 240000,
    onSuccess: (data) => {
      console.log('data >> ', data)
      // data.dVistedAt = formatDate(data.dVistedAt, '-', true)
      // resetFollowUp(data)
      // setFollowupData(data.aInquiryFollowupList)
    },
  })

  const { data: specificFollowUp } = useQuery(['followUpListDetail'], () => getSpecificInquiryFollowUp(followUpId), {
    enabled: !!followUpId,
    select: (data) => data.data.inquiry,
    onSuccess: (data) => {
      console.log('data >> ', data)
      data.dFollowupAt = formatDate(data.dFollowupAt, '-', true)

      const filteredData = followUp?.find(item => item._id === id)
      data.iFollowupBy = filteredData?.oFollowupBy?.sName,
        resetFollowUp(data)
    },
  })

  const { mutate: mutateAddFollowUp } = useMutation((data) => addInquiryFollowUp(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('inquiryFollowup')
      toaster(res.data.message)
      navigate(route.inquiryAddViewEdit('view', id))
    },
  })

  const { mutate: mutateUpdateFollowUp } = useMutation((followUpId, onSubmitData) => updateInquiryFollowUp(followUpId, onSubmitData), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('inquiryFollowup')
      toaster(res.data.message)
      setModalFollowUp({ open: false })
      navigate(route.inquiryAddViewEdit('view', id))
    },
  })

  // delete mutation
  const { mutate: deleteFollowUpMutation } = useMutation((deleteId) => deleteInquiryFollowUp(deleteId), {
    onSuccess: (data) => {
      toaster(data.data.message)
      setModalDeleteFollowUp({ open: false })
      queryClient.invalidateQueries('inquiryFollowup')
    },
  })

  const onFollowUpSubmit = (onSubmitData) => {
    const addData = {
      sResponse: onSubmitData.sResponse,
      dFollowupAt: onSubmitData.dFollowupAt,
      iFollowupBy: onSubmitData.iFollowupBy,
      iInquiryID: inquiryId
    }

    if (action === 'edit') {
      mutateUpdateFollowUp({ followUpId, onSubmitData })
    } else {
      mutateAddFollowUp({
        addData
      })
    }
    setModalFollowUp({ open: true })
  }

  function gotoFollowUpAdd (data) {
    resetFollowUp(data)
    setAction('add')
    setModalFollowUp({ open: true })
  }

  function gotoFollowUpEdit (id) {
    setAction('edit')
    setFollowUpId(id)
    setModalFollowUp({ open: true, id })

    const filteredData = followUp?.find(item => item._id === id)
    resetFollowUp({
      sResponse: specificFollowUp?.sResponse,
      dFollowupAt: formatDate(specificFollowUp?.dFollowupAt),
      iFollowupBy: filteredData?.oFollowupBy?.sName,
    })
  }

  function gotoFollowUpDetail (id) {
    setAction('view')
    setFollowUpId(id)
    setModalFollowUp({ open: true, followUpId })
  }

  function onDeleteFollowUp (id) {
    setAction('delete')
    setModalDeleteFollowUp({ open: true, id })
  }

  function onFollowUpCancel () {
    setModalFollowUp({ open: false })
    setFollowUpId(null)
  }

  const permissions = {
    CREATE: 'noRole',
    READ: 'noRole',
    UPDATE: 'noRole',
    DELETE: 'noRole',
    EXCEL: 'noRole',
    get ALL () {
      return [this.READ, this.UPDATE, this.DELETE]
    },
  }

  function changePage (page) {
    setRequestParams({ ...requestParams, page, limit: requestParams?.limit || 10 })
    appendParams({ ...requestParams, page: page / requestParams?.limit, limit: requestParams?.limit || 10 })
  }

  function changePageSize (pageSize) {
    setRequestParams({ ...requestParams, page: 0, limit: pageSize })
    appendParams({ ...requestParams, page: 0, limit: pageSize })
    // setSelectedRows([{ changingPage: true }])
  }

  return (
    <>
      <Wrapper isLoading={mutateAddInquiry.isAddingInquiry || updateMutation.isLoading}>
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
          {isViewOnly ?
            <>
              <Col lg={6} md={6} xs={12}>
                <Controller
                  name="sName"
                  control={control}
                  rules={{ required: 'This field is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      {...field}
                      labelText="Customer Name"
                      placeholder="Enter Customer Name"
                      id="sName"
                      disabled={isViewOnly}
                      errorMessage={error?.message}
                      type="text"
                    />
                  )}
                />
              </Col>
              <Col lg={6} md={6} xs={12}>
                <Controller
                  name="iBranchId.sName"
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
            </>
            : <>
              <Col lg={6} md={6} xs={12}>
                <Controller
                  name="sName"
                  control={control}
                  rules={{ required: 'This field is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      {...field}
                      labelText="Customer Name"
                      placeholder="Enter Customer Name"
                      id="sName"
                      disabled={isViewOnly}
                      errorMessage={error?.message}
                      type="text"
                    />
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
            </>
          }
        </Row>

        <Row>
          {isViewOnly ?
            <>
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
              <Col lg={6} md={6} xs={12} className="mt-md-0 mt-3">
                <Controller
                  name="sPreferredLocation"
                  control={control}
                  rules={{ required: 'This field is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      {...field}
                      labelText="Preferred Location"
                      placeholder="Enter Location"
                      id="sPreferredLocation"
                      disabled={isViewOnly}
                      errorMessage={error?.message}
                    />
                  )}
                />
              </Col>
            </>
            : ''}
        </Row>

        <Row>
          <Col lg={6} md={6} xs={12}>
            <Controller
              name="sPhone"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  labelText="Contact Number"
                  type="number"
                  placeholder="Enter Contact Number"
                  id="sPhone"
                  disabled={isViewOnly}
                  errorMessage={error?.message}
                />
              )}
            />
          </Col>
          <Col lg={6} md={6} xs={12}>
            <Controller
              name="sSecondaryPhone"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  labelText="Secondary Contact Number"
                  type="number"
                  placeholder="Enter Secondary Contact Number"
                  id="sSecondaryPhone"
                  disabled={isViewOnly}
                  errorMessage={error?.message}
                />
              )}
            />
          </Col>
        </Row>

        <Row className="mt-xs-3">
          {!isViewOnly ?
            <>
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
                  name="sPreferredLocation"
                  control={control}
                  rules={{ required: 'This field is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      {...field}
                      labelText="Preferred Location"
                      placeholder="Enter Location"
                      id="sPreferredLocation"
                      disabled={isViewOnly}
                      errorMessage={error?.message}
                    />
                  )}
                />
              </Col>
            </>
            : ''
          }

        </Row>

        <Row>
          <Col lg={6} md={6} xs={12} className="mt-md-0 mt-3">
            <Controller
              name="dInquiryAt"
              control={control}
              rules={{ required: 'Inquiry Date is required' }}
              render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                <CalendarInput
                  id="dInquiryAt"
                  disabled={isViewOnly}
                  onChange={onChange}
                  value={value || (isViewOnly && new Date().toISOString().substring(0, 16))}
                  ref={ref}
                  errorMessage={error?.message}
                  title="Inquiry Date"
                />
              )}
            />
          </Col>
          <Col lg={6} md={6} xs={12} className="mt-md-0 mt-3">
            <Controller
              name="dFollowupDate"
              control={control}
              rules={{ required: 'Inquiry Date is required' }}
              render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                <CalendarInput
                  id="dFollowupDate"
                  disabled={isViewOnly}
                  onChange={onChange}
                  value={value || (isViewOnly && new Date().toISOString().substring(0, 16))}
                  ref={ref}
                  errorMessage={error?.message}
                  title="FollowUp Date"
                />
              )}
            />
          </Col>

        </Row>
        {!isViewOnly ?
          <>
            <Row>
              <Col lg={12} md={12} xs={12} className="mt-md-0 mt-3">
                <Controller
                  name="iBranchId"
                  control={control}
                  rules={{ required: 'This field is required' }}
                  render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                    <Select
                      labelText="Branch"
                      id="iBranchId"
                      placeholder="Select Branch"
                      onChange={onChange}
                      value={value}
                      ref={ref}
                      isDisabled={isViewOnly}
                      errorMessage={error?.message}
                      options={organization?.map(item => item?.sName)}
                    />
                  )}
                />
              </Col>
            </Row>

            <Row>
              <Col lg={12} md={12} xs={12} className="mt-md-0 mt-3">
                <Controller
                  name="sDescription"
                  control={control}
                  rules={{ required: 'This field is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <DescriptionInput
                        className="p-2 text-dark"
                        label="Description"
                        errorMessage={error?.message}
                        disabled={isViewOnly}
                        placeholder="Enter Description"
                        {...field}
                      />
                    </>
                  )}
                />
              </Col>
            </Row>
          </>
          :
          <Row>
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
                name="sDescription"
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <DescriptionInput
                      className="p-2 text-dark"
                      label="Description"
                      errorMessage={error?.message}
                      disabled={isViewOnly}
                      placeholder="Enter Description"
                      {...field}
                    />
                  </>
                )}
              />
            </Col>
          </Row>
        }

      </Wrapper>

      <Wrapper>
        <div className="pageTitle-head">
          <PageTitle
            title="Inquiry Visit"
            BtnText={isGranted(permissions.CREATE) ? 'Add Visit' : null}
            handleButtonEvent={gotoAdd}
            add
          />
        </div>
        <DataTable
          columns={visitColumns}
          align="left"
          totalData={visit?.length}
          isLoading={isLoading || mutateAddVisit.isLoading}
        >
          {visit?.map((item, i) => {
            // if (id === item?.iInquiryID) {
            return (
              <tr key={i}>
                <td>{cell(requestParams.page + (i + 1))}</td>
                <td>{cell(item?.oCreator.sUserName)}</td>
                <td>{cell(item?.sPurpose)}</td>
                <td>{cell(item?.sDescription)}</td>
                <td>{cell(formatDate(item?.dVisitedAt))}</td>
                <ActionColumn
                  permissions={permissions}
                  handleView={() => gotoDetail(item._id)}
                  handleEdit={() => gotoEdit(item._id)}
                  handleDelete={() => onDelete(item._id)}
                />
              </tr>
            )
            // }
          })}
        </DataTable>
      </Wrapper>

      <Wrapper transparent>
        <TablePagination
          currentPage={Number(requestParams?.page)}
          totalCount={visit?.length || 0}
          pageSize={requestParams?.limit || 5}
          onPageChange={(page) => changePage(page)}
          onLimitChange={(limit) => changePageSize(limit)}
        />
      </Wrapper>

      <Wrapper>
        <div className="pageTitle-head">
          <PageTitle
            title="Inquiry FollowUp"
            BtnText={isGranted(permissions.CREATE) ? 'Add FollowUp' : null}
            handleButtonEvent={gotoFollowUpAdd}
            add
          />
        </div>
        <DataTable
          columns={followUpColumns}
          align="left"
          totalData={followUp?.length}
          isLoading={isLoading || mutateAddFollowUp.isLoading}
        >
          {followUp?.map((item, i) => {
            if (id === item?.iInquiryID) {
              return (
                <tr key={i}>
                  <td>{cell(requestParams.page + (i + 1))}</td>
                  <td>{cell(item?.oFollowupBy.sName)}</td>
                  <td>{cell(item?.sResponse)}</td>
                  <td>{cell(formatDate(item?.dFollowupAt))}</td>
                  <ActionColumn
                    permissions={permissions}
                    handleView={() => gotoFollowUpDetail(item._id)}
                    handleEdit={() => gotoFollowUpEdit(item._id)}
                    handleDelete={() => onDeleteFollowUp(item._id)}
                  />
                </tr>
              )
            }
          })}
        </DataTable>
      </Wrapper>

      <Wrapper transparent>
        <TablePagination
          currentPage={Number(requestParams?.page)}
          totalCount={followUp?.length || 0}
          pageSize={requestParams?.limit || 5}
          onPageChange={(page) => changePage(page)}
          onLimitChange={(limit) => changePageSize(limit)}
        />
      </Wrapper>

      {isViewOnly && modalVisit && (action !== 'delete') &&
        <CustomModal
          modalBodyClassName="p-0 py-2"
          open={modalVisit.open}
          handleClose={() => setModalVisit({ open: false })}
          title={action === 'add' ? 'Add Inquiry Visit' : action === 'edit' ? 'Edit Inquiry Visit' : 'View Inquiry Visit'}
        >
          <div className="d-flex flex-column">
            <div>
              <Row>
                <Col lg={6} md={6} xs={12}>
                  <Controller
                    name='sPurpose'
                    control={visitControl}
                    rules={{ required: 'This field is required' }}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Input
                          {...field}
                          labelText="Purpose"
                          placeholder="Enter Purpose"
                          id="sPurpose"
                          errorMessage={error?.message}
                          disabled={action === 'view'}
                          type='text'
                        />
                      </>
                    )}
                  />
                </Col>
                <Col lg={6} md={6} xs={12} className="mt-md-0 mt-3">
                  <Controller
                    name="dVisitedAt"
                    control={visitControl}
                    rules={{ required: 'Visit Date is required' }}
                    render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                      <CalendarInput
                        id="dVisitedAt"
                        onChange={onChange}
                        value={value || (isViewOnly && new Date().toISOString().substring(0, 16))}
                        ref={ref}
                        errorMessage={error?.message}
                        disabled={action === 'view'}
                        title="Visited Date"
                      />
                    )}
                  />
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} xs={12} className="mt-md-0 mt-3">
                  <Controller
                    name="sDescription"
                    control={visitControl}
                    rules={{ required: 'This field is required' }}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <DescriptionInput
                          className="p-2 text-dark"
                          label="Description"
                          errorMessage={error?.message}
                          disabled={action === 'view'}
                          placeholder="Enter Description"
                          {...field}
                        />
                      </>
                    )}
                  />
                </Col>
              </Row>
            </div>
            <div className="d-flex justify-content-end mt-4">
              <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={onVisitCancel}>
                Cancel
              </Button>
              {
                (action === 'add' || action === 'edit') &&
                <Button type='submit' onClick={handleVisitSubmit(onVisitSubmit)}>
                  Save
                </Button>
              }
            </div>
          </div>
        </CustomModal>
      }

      {action === 'delete' &&
        <CustomModal modalBodyClassName="p-0 py-2" open={modalDeleteVisit.open} handleClose={() => setModalDeleteVisit({ open: false })} title="Are you Sure?">
          <h6>Are you sure you want to delete Inquiry Visit?</h6>
          <div className="d-flex justify-content-between">
            <div></div>
            <div className="mt-4">
              <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModalDeleteVisit({ open: false })}>
                Cancel
              </Button>
              <Button onClick={() => deleteVisitMutation(modalDeleteVisit.id, modalDeleteVisit.inquiryId)} loading={deleteVisitMutation.isLoading}>
                Delete
              </Button>
            </div>
          </div>
        </CustomModal>
      }

      {isViewOnly && modalFollowUp && (action !== 'delete') &&
        <CustomModal
          modalBodyClassName="p-0 py-2"
          open={modalFollowUp.open}
          handleClose={() => setModalFollowUp({ open: false })}
          title={action === 'add' ? 'Add Inquiry FollowUp' : action === 'edit' ? 'Edit Inquiry FollowUp' : 'View Inquiry FollowUp'}
        >
          <div className="d-flex flex-column">
            <div>

              <Row>
                <Col lg={12} md={12} xs={12}>
                  <Controller
                    name={`sResponse`}
                    control={followUpControl}
                    rules={{ required: 'This field is required' }}
                    render={({ field, fieldState: { error } }) => (
                      <Input
                        {...field}
                        labelText="Response"
                        placeholder="Enter Response"
                        id="sResponse"
                        errorMessage={error?.message}
                        disabled={action === 'view'}
                        type='text'
                      />
                    )}
                  />
                </Col>
              </Row>
              <Row>
                <Col lg={6} md={6} xs={12} className="mt-md-0 mt-3">
                  <Controller
                    name="iFollowupBy"
                    control={followUpControl}
                    rules={{ required: 'This field is required' }}
                    render={({ field, fieldState: { error } }) => (
                      <Input
                        {...field}
                        labelText="FollowUp By"
                        placeholder="Enter FollowUp By"
                        id="iFollowupBy"
                        errorMessage={error?.message}
                        disabled={action === 'view'}
                        type='text'
                      />
                    )}
                  />
                </Col>
                <Col lg={6} md={6} xs={12} className="mt-md-0 mt-3">
                  <Controller
                    name="dFollowupAt"
                    control={followUpControl}
                    rules={{ required: 'FolowUp At Date is required' }}
                    render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                      <CalendarInput
                        id="dFollowupAt"
                        onChange={onChange}
                        value={value || (isViewOnly && new Date().toISOString().substring(0, 16))}
                        ref={ref}
                        errorMessage={error?.message}
                        disabled={action === 'view'}
                        title="FollowUp At"
                      />
                    )}
                  />
                </Col>
              </Row>

            </div>
            <div className="d-flex justify-content-end mt-4">
              <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={onFollowUpCancel}>
                Cancel
              </Button>
              {
                (action === 'add' || action === 'edit') &&
                <Button type='submit' onClick={handleFollowUpSubmit(onFollowUpSubmit)}>
                  Save
                </Button>
              }
            </div>
          </div>
        </CustomModal>
      }

      {action === 'delete' &&
        <CustomModal modalBodyClassName="p-0 py-2" open={modalDeleteFollowUp.open} handleClose={() => setModalDeleteFollowUp({ open: false })} title="Are you Sure?">
          <h6>Are you sure you want to delete FollowUp Inquiry?</h6>
          <div className="d-flex justify-content-between">
            <div></div>
            <div className="mt-4">
              <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModalDeleteFollowUp({ open: false })}>
                Cancel
              </Button>
              <Button onClick={() => deleteFollowUpMutation(modalDeleteFollowUp.id)} loading={deleteFollowUpMutation.isLoading}>
                Delete
              </Button>
            </div>
          </div>
        </CustomModal>
      }

    </>
  )
}

export default AddInquiry
