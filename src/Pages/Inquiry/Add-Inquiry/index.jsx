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
import { addInquiry, addInquiryVisit, deleteInquiryVisit, updateInquiry, updateInquiryVisit } from 'Query/Inquiry/inquiry.mutation'
import { getInquiryFollowUpList, getInquiryVisitList, getSpecificInquiry, getSpecificInquiryVisit } from 'Query/Inquiry/inquiry.query'
import { route } from 'Routes/route'
import { appendParams, cell, formatDate, getSortedColumns, isGranted, parseParams, toaster } from 'helpers'
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import Button from 'Components/Button'
import TablePagination from 'Components/Table-pagination'

function AddInquiry () {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { control, handleSubmit, reset } = useForm()
  const { control: visitControl, handleSubmit: handleVisitSubmit, reset: resetVisit } = useForm()
  const { control: followUpControl, reset: resetFollowUp } = useForm()
  console.log('visitControl :>> ', visitControl)

  const [followupData, setFollowupData] = useState([])
  const [visitData, setVisitData] = useState([])
  const [action, setAction] = useState('')

  const [inquiryVisitId, setInquiryVisitId] = useState(null)

  const [modal, setModal] = useState({ open: false })
  const [isVisit, setIsVisit] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [inquiryId, setInquiryId] = useState('')

  const parsedData = parseParams(location.search)
  function getParams () {
    return {
      page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
      limit: Number(parsedData?.limit) || 10,
      search: parsedData?.search || '',
      sort: parsedData.sort || '',
      order: parsedData.order || '',
    }
  }
  const [requestParams, setRequestParams] = useState(getParams())

  const { isEdit, isViewOnly, id } = usePageType()
  { console.log(id, 'id 54') }
  useEffect(() => {
    setInquiryId(id)
  }, [id])
  // console.log('inquiryId :>> ', inquiryId)

  const { mutate: mutateAddInquiry, isLoading: isAddingInquiry } = useMutation((data) => addInquiry(data), {
    onSuccess: (res) => {
      console.log('res >> ', res)
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
    console.log('object :>> ', data)
    if (isEdit) {
      updateMutation.mutate({ id, data })
    } else {
      mutateAddInquiry(data)
    }
  }

  const { isLoading } = useQuery(['inquiryDetails', id], () => getSpecificInquiry(id), {
    enabled: isEdit || isViewOnly,
    select: (data) => data.data.inquiry,
    onSuccess: (data) => {
      data.dInquiryAt = formatDate(data.dInquiryAt, '-', true)
      data.dFollowupDate = formatDate(data.dFollowupDate, '-', true)
      reset(data)
    },
  })

  // inquiry Visit
  const { data: visit } = useQuery(['inquiryVisit', id], () => getInquiryVisitList(id), {
    enabled: isEdit || isViewOnly || isVisit,
    select: (data) => data.data.data.aInquiryVisitList,
    staleTime: 240000,
    onSuccess: (data) => {
      // console.log('data >> ', data.map(item => item.dVisitedAt))
      const oVisit = data.find(item => item.dVisitedAt)
        console.log('visit data >> ', data)
      setVisitData(data)
    },
  })

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

  const { mutate: mutateAddInquiryVisit } = useMutation((data) => addInquiryVisit(data), {
    onSuccess: (res) => {
      console.log('res >> ', res)
      queryClient.invalidateQueries('inquiryVisit')
      toaster(res.data.message)
      navigate(route.inquiry)
    },
  })

  const { mutate: mutateUpdateVisit } = useMutation((id, data) => updateInquiryVisit(id, data), {
    onSuccess: (res) => {
      console.log('res >> ', res)
      queryClient.invalidateQueries('inquiryVisit')
      toaster(res.data.message)
      navigate(route.inquiry)
    },
  })

  const onVisitSubmit = (onSubmitData) => {
    const data = {
      ...onSubmitData,
      iInquiryID: id
    }
    if (action === 'edit') {
      mutateUpdateVisit({ id, data })
      console.log('id >> ', id, data)
    } else {
      mutateAddInquiryVisit({
        ...onSubmitData,
        iInquiryID: id
      })
    }
    console.log('onSubmit data >> ', data)
    // setIsVisit(true)

    setModal({ open: true, isVisit })
  }

  function gotoAdd (data) {
    setAction('add')
    onVisitSubmit(data)
    console.log('data >> ', data.target.innerText)
    resetVisit()
    // setIsVisit(true)
    // } else {
    //   resetFollowUp()
    //   setIsVisit(false)
    // }

    setModal({ open: true, })
  }

  function gotoEdit (id, data) {
    setAction('edit')
    setIsVisit(true)
    console.log('id >> ', id, data)
    onVisitSubmit(id)
    setModal({id})

    setModal({ open: true, isVisit })

    const filteredData = visitData?.find(item => item._id === id)
    console.log('object :>> ', visitData)
    resetVisit({
      sPurpose: filteredData?.sPurpose,
      dVisitedAt: cell(formatDate(filteredData?.dVisitedAt)),
      sDescription: filteredData?.sDescription,
    })
  }

  function gotoDetail (id) {
    console.log('id visit :>> ', id)
    setAction('view')
    setInquiryVisitId(id)
    setIsVisit(true, id)
    // getSpecificInquiryVisit(id)
    // const filteredData = visitData?.find(item => item._id === id)
    // console.log('filteredData :>> ', filteredData)
    setModal({ open: true, isVisit })

    // resetVisit({
    //   sPurpose: specificVisit?.sPurpose,
    //   dVisitedAt: cell(formatDate(specificVisit?.dVisitedAt)),
    //   sDescription: specificVisit?.sDescription,
    // })
  }

  const { data: specificVisit } = useQuery(['visitListDetail'], () => getSpecificInquiryVisit(inquiryVisitId), {
    enabled: !!inquiryVisitId,
    // select: (data) => data.data.data,

    onSuccess: (data) => {
      console.log('data >> ', data)

      resetVisit(data)
    },
  })

  console.log('specificVisit :>> ', specificVisit)

  const oldData = queryClient.getQueryData(['visitListDetail'])
  console.log('oldData >> ', oldData)

  // inquiry followUp
  const { data: followUp } = useQuery(['inquiryFollowup', id], () => getInquiryFollowUpList(id), {
    enabled: isEdit || isViewOnly || !isVisit,
    select: (data) => data.data.data,
    staleTime: 240000,
    onSuccess: (data) => {
      // data.dVistedAt = formatDate(data.dVistedAt, '-', true)
      // resetFollowUp(data)
      setFollowupData(data.aInquiryFollowupList)
      console.log('data :>> ', data)
    },
  })

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

  console.log('action >> ', action)

  function gotoFollowUpAdd (data) {
    resetFollowUp()
    setAction('add')

    console.log('data >> ', data.target.innerText)
    setIsVisit(false)
    // } else {
    //   resetFollowUp()
    //   setIsVisit(false)
    // }

    setModal({ open: true, isVisit })
  }

  function gotoFollowUpEdit (id, data) {
    setAction('edit')
    console.log('id >> ', id, data)
    // onVisitSubmit()
    setIsVisit(false)

    setModal({ open: true, isVisit })

    const filteredData = followupData?.find(item => item._id === id)
    resetFollowUp({
      sResponse: filteredData?.sResponse,
      dFollowupAt: formatDate(filteredData?.dFollowupAt),
      iFollowupBy: filteredData?.oFollowupBy?.sName,
    })
  }

  function gotoFollowUpDetail (id) {
    setAction('view')
    const filteredData = followupData?.find(item => item._id === id)

    setIsVisit(false)
    setModal({ open: true, isVisit })
    resetFollowUp({
      sResponse: filteredData?.sResponse,
      dFollowupAt: formatDate(filteredData?.dFollowupAt),
      iFollowupBy: filteredData?.oFollowupBy?.sName,
    })
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

  function onDelete (id, inquiryId) {
    console.log('id >> ', id)
    setAction('delete')
    setDeleteId(id)
    console.log({ id, inquiryId })
    deleteMutation({ deletedId: id, inquiryId: inquiryId })
    setModal({ open: true, isVisit, id, inquiryId })
  }
  // console.log('deleteId :>> ', deleteId, ', inquiryId :>> ', inquiryId)

  function changePage (page) {
    setRequestParams({ ...requestParams, page, limit: requestParams?.limit || 10 })
    appendParams({ ...requestParams, page: page / requestParams?.limit, limit: requestParams?.limit || 10 })
  }

  function changePageSize (pageSize) {
    setRequestParams({ ...requestParams, page: 0, limit: pageSize })
    appendParams({ ...requestParams, page: 0, limit: pageSize })
    // setSelectedRows([{ changingPage: true }])
  }

  // delete mutation
  const { mutate: deleteMutation } = useMutation((deleteId, inquiryId) => deleteInquiryVisit(deleteId, inquiryId), {
    onSuccess: (data) => {
      toaster(data.data.message)
      queryClient.invalidateQueries('inquiryVisit')
      setModal({ open: false })
    },
  })

  return (
    <>
      <Wrapper isLoading={isAddingInquiry || mutateAddInquiry.isAddingInquiry || updateMutation.isLoading}>
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
                  name="sPreferedLocation"
                  control={control}
                  rules={{ required: 'This field is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      {...field}
                      labelText="Preffered Location"
                      placeholder="Enter Location"
                      id="sPreferedLocation"
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

        {!isViewOnly ?
          <Row>
            <Col lg={12} md={12} xs={12}>
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
          </Row> : ''
        }

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
                  name="sPreferedLocation"
                  control={control}
                  rules={{ required: 'This field is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      {...field}
                      labelText="Preffered Location"
                      placeholder="Enter Location"
                      id="sPreferedLocation"
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

      <Wrapper transparent>
        <TablePagination
          currentPage={Number(requestParams?.page)}
          totalCount={followUp?.length || 0}
          pageSize={requestParams?.limit || 5}
          onPageChange={(page) => changePage(page)}
          onLimitChange={(limit) => changePageSize(limit)}
        />
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
          totalData={followUp?.aInquiryFollowupList?.length}
          isLoading={isLoading || mutateAddInquiry.isLoading}
        >
          {visitData?.map((item, i) => {
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
                  handleDelete={() => setModal({})}
                />
              </tr>
            )
            // }
          })}
        </DataTable>
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
        {/* {console.log('followupData >> ', followupData)} */}
        <DataTable
          columns={followUpColumns}
          align="left"
          totalData={followUp?.aInquiryFollowupList?.length}
          isLoading={isLoading || mutateAddInquiry.isLoading}
        >
          {followupData?.map((item, i) => {
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
                    handleDelete={() => onDelete(item._id)}
                  />
                </tr>
              )
            }
          })}
        </DataTable>
      </Wrapper>
      {console.log('isVisit >> ', isVisit)}
      {isViewOnly && (action === 'add' || action === 'view' || action === 'edit') ?
        <>
          <CustomModal
            modalBodyClassName="p-0 py-2"
            open={modal.open}
            handleClose={() => setModal({ open: false })}
            title={action === 'add' ? 'Add Inquiry Visit' : action === 'edit' ? 'Edit Inquiry Visit' : 'View Inquiry Visit'}
          // cancelText="Cancel"
          // BtnText={!isViewOnly ? 'Save' : null}
          // handleButtonEvent={handleSubmit(onVisitSubmit)}
          // cancelButtonEvent={() => setModal({ open: false })}
          >
            {/* <h6>Are you sure you want to Add new Inquiry?</h6> */}
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
                <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModal({ open: false })}>
                  Cancel
                </Button>
                {
                  (action === 'add' || action === 'edit') &&
                  <Button type='submit' onClick={handleVisitSubmit(action === 'add' ? gotoAdd : gotoEdit)}>
                    Save
                  </Button>
                }
              </div>
            </div>
          </CustomModal>
        </> :
        <>
          {
            (action === 'add' || action === 'view' || action === 'edit') &&
            <CustomModal
              modalBodyClassName="p-0 py-2"
              open={modal.open}
              handleClose={() => setModal({ open: false })}
              title={action === 'add' ? 'Add Inquiry FollowUp' : action === 'edit' ? 'Edit Inquiry FollowUp' : 'View Inquiry FollowUp'}
            // cancelText="Cancel"
            // BtnText={!isViewOnly ? 'Save' : null}
            // handleButtonEvent={handleSubmit(onVisitSubmit)}
            // cancelButtonEvent={() => setModal({ open: false })}
            >
              {/* <h6>Are you sure you want to Add new Inquiry?</h6> */}
              <div className="d-flex flex-column">
                <div>

                  <Row>
                    <Col lg={12} md={12} xs={12}>
                      <Controller
                        name={`sResponse`}
                        control={followUpControl}
                        rules={{ required: 'This field is required' }}
                        render={({ field, fieldState: { error } }) => (
                          <>
                            {console.log('field >> ', field)}
                            <Input
                              {...field}
                              labelText="Response"
                              placeholder="Enter Response"
                              id="sResponse"
                              errorMessage={error?.message}
                              disabled={action === 'view'}
                              type='text'
                            />
                          </>
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
                  <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModal({ open: false })}>
                    Cancel
                  </Button>
                  {
                    (action === 'add' || action === 'edit') &&
                    <Button type='submit' onClick={gotoFollowUpEdit}>
                      Save
                    </Button>
                  }
                </div>
              </div>
            </CustomModal>
          }
        </>
      }
      {
        action === 'delete' &&
        <CustomModal modalBodyClassName="p-0 py-2" open={modal.open} handleClose={() => setModal({ open: false })} title="Are you Sure?">
          <h6>Are you sure you want to delete?</h6>
          <div className="d-flex justify-content-between">
            <div></div>
            <div className="mt-4">
              <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModal({ open: false })}>
                Cancel
              </Button>
              <Button>
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
