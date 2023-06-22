import ActionColumn from 'Components/ActionColumn'
import CalendarInput from 'Components/Calendar-Input'
import DataTable from 'Components/DataTable'
import DescriptionInput from 'Components/DescriptionInput'
import Input from 'Components/Input'
import CustomModal from 'Components/Modal'
import PageTitle from 'Components/Page-Title'
import Wrapper from 'Components/wrapper'
import usePageType from 'Hooks/usePageType'
import { addInquiry, addInquiryVisit, updateInquiry, updateInquiryVisit } from 'Query/Inquiry/inquiry.mutation'
import { getInquiryFollowUpList, getInquiryVisitList, getSpecificInquiry } from 'Query/Inquiry/inquiry.query'
import { route } from 'Routes/route'
import { cell, formatDate, getSortedColumns, isGranted, parseParams, toaster } from 'helpers'
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import Button from 'Components/Button'

function AddInquiry () {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { control, handleSubmit, reset } = useForm()
  const { control: visitControl, reset: resetVisit } = useForm()
  const { control: followUpControl, reset: resetFollowUp } = useForm()
  
  // console.log('control >> ', control)
  console.log('visitControl >> ', visitControl)
  console.log('followUpControl >> ', followUpControl)
  const [modal, setModal] = useState({ open: false })
  const [isVisit, setIsVisit] = useState(false)
  const [followUpId, setFollowUpId] = useState('')

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
  const [requestParams] = useState(getParams())

  const { isEdit, isViewOnly, id } = usePageType()
  console.log('isEdit :>> ', isEdit, ', isViewOnly :>> ', isViewOnly)

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
    // data.eStatus = data.eStatus.value
    if (isEdit) {
      updateMutation.mutate({ id, data })
    } else {
      mutateAddInquiry.mutate(data)
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
    select: (data) => data.data.data,
    staleTime: 240000,
    onSuccess: (data) => {
      data.dVistedAt = formatDate(data.dVistedAt, '-', true)
      resetVisit(data)
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

  const { mutate: mutateUpdateVisit } = useMutation((data) => updateInquiryVisit(data), {
    onSuccess: (res) => {
      console.log('res >> ', res)
      queryClient.invalidateQueries('inquiryVisit')
      toaster(res.data.message)
      navigate(route.inquiry)
    },
  })

  const onVisitSubmit = (data) => {
    if (isEdit) {
      mutateUpdateVisit({ id, data })
    } else {
      mutateAddInquiryVisit(data)
    }
    console.log('onSubmit data >> ', data)
    setIsVisit(true)

    setModal({ open: true, isVisit })
  }

  function gotoAdd (e) {
    // visitReset()
    console.log('id >> ', e.target.innerText)
    if (e.target.innerText === 'Add Visit') {
      setIsVisit(true)
    } else {
      setIsVisit(false)
    }

    setModal({ open: true, isVisit })
  }

  function gotoEdit (id, data) {
    console.log('id >> ', id, data)
    onVisitSubmit()
    setIsVisit(true)

    setModal({ open: true, isVisit })
  }

  function gotoDetail (id) {
    console.log('id :>> ', id)
    setIsVisit(true)
    setModal({ open: true, isVisit })
  }

  // inquiry followUp
  const { data: followUp } = useQuery(['inquiryFollowup', id], () => getInquiryFollowUpList(id), {
    enabled: isEdit || isViewOnly || !isVisit,
    select: (data) => data.data.data,
    staleTime: 240000,
    onSuccess: (data) => {
      // data.dVistedAt = formatDate(data.dVistedAt, '-', true)
      resetFollowUp(data)
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

  function gotoFollowUpEdit (id, data) {
    console.log('id >> ', id, data)
    // onVisitSubmit()
    setIsVisit(false)

    setModal({ open: true, isVisit })
    // navigate(route.inquiryAddViewEdit('edit', id))
  }

  function gotoFollowUpDetail (id) {
    setFollowUpId(id)
    console.log('id folowp :>> ', id )
    setIsVisit(false)
    setModal({ open: true, isVisit })
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

  function onDelete (id) {
    console.log('id >> ', id)
    setModal({ open: true, id })
  }

  const followpdata = followUpControl?._formValues?.aInquiryFollowupList

  useEffect(() => {
    const filter = followpdata?.map((item, i) => {
      if (item._id === followUpId) {
        return (
        <React.Fragment key={i}>
          {console.log(item?.sResponse)}
        </React.Fragment>
        )
      }
    })
    console.log('filter >> ', filter)
  }, [])

  console.log('id >> ', followUpId)
  console.log('data', followpdata?.map((item) => item._id === followUpId))

  console.log('aIn  ', followUpControl?._formValues?.aInquiryFollowupList)

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
            <Col lg={12} md={6} xs={12}>
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
            <Col lg={12} md={6} xs={12} className="mt-md-0 mt-3">
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
          {visit?.aInquiryVisitList?.map((item, i) => {
            // if (id === item?.iInquiryID) {
              return (
                <tr key={i}>
                  <td>{cell(requestParams.page + (i + 1))}</td>
                  <td>{cell(item?.oCreator.sUserName)}</td>
                  <td>{cell(item?.sPurpose)}</td>
                  <td>{cell(item?.sDescription)}</td>
                  <td>{cell(formatDate(item?.dVistedAt))}</td>
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

      <Wrapper>
        <div className="pageTitle-head">
          <PageTitle
            title="Inquiry FollowUp"
            BtnText={isGranted(permissions.CREATE) ? 'Add FollowUp' : null}
            handleButtonEvent={gotoAdd}
            add
          />
        </div>
        <DataTable
          columns={followUpColumns}
          align="left"
          totalData={followUp?.aInquiryFollowupList?.length}
          isLoading={isLoading || mutateAddInquiry.isLoading}
        >
          {/* {console.log('filter :>> ', followUp?.aInquiryFollowupList?.filter((item => id === item?.iInquiryID)))} */}
          {followUp?.aInquiryFollowupList?.map((item, i) => {
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
      {isVisit ?
        <>
          <CustomModal
            modalBodyClassName="p-0 py-2"
            open={modal.open}
            handleClose={() => setModal({ open: false })}
            title={`Inquiry Visit Add`}
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
                      name="aInquiryVisitList[0].sPurpose"
                      control={visitControl}
                      rules={{ required: 'This field is required' }}
                      render={({ field, fieldState: { error } }) => (
                        <Input
                          {...field}
                          labelText="Purpose"
                          placeholder="Enter Purpose"
                          id="sPurpose"
                          errorMessage={error?.message}
                          disabled={isViewOnly}
                          type='text'
                        />
                      )}
                    />
                  </Col>
                  <Col lg={6} md={6} xs={12} className="mt-md-0 mt-3">
                    <Controller
                      name="aInquiryVisitList[0].dVistedAt"
                      control={visitControl}
                      rules={{ required: 'Visit Date is required' }}
                      render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                        <CalendarInput
                          id="dVistedAt"
                          onChange={onChange}
                          value={value || (isViewOnly && new Date().toISOString().substring(0, 16))}
                          ref={ref}
                          errorMessage={error?.message}
                          disabled={isViewOnly}
                          title="Visited Date"
                        />
                      )}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={6} xs={12} className="mt-md-0 mt-3">
                    <Controller
                      name="aInquiryVisitList[0].sDescription"
                      control={visitControl}
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
              </div>
              <div className="d-flex justify-content-end mt-4">
                <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModal({ open: false })}>
                  Cancel
                </Button>
                <Button type='submit' onClick={gotoEdit}>
                  Save
                </Button>
              </div>
            </div>
          </CustomModal>
        </> :
        <>
          <CustomModal
            modalBodyClassName="p-0 py-2"
            open={modal.open}
            handleClose={() => setModal({ open: false })}
            title={`Inquiry FollowUp Add`}
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
                      name={`aInquiryFollowupList.map(item => if(item?._id === id) {
                        item?.sResponse
                      })`}
                      control={visitControl}
                      rules={{ required: 'This field is required' }}
                      render={({ field, fieldState: { error } }) => (
                        <Input
                          {...field}
                          labelText="Response"
                          placeholder="Enter Response"
                          id="sResponse"
                          errorMessage={error?.message}
                          disabled={isViewOnly}
                          type='text'
                        />
                      )}
                    />
                  </Col>
                  <Col lg={6} md={6} xs={12} className="mt-md-0 mt-3">
                    <Controller
                      name="dFollowupAt"
                      control={visitControl}
                      rules={{ required: 'FolowUp At Date is required' }}
                      render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                        <CalendarInput
                          id="dFollowupAt"
                          onChange={onChange}
                          value={value || (isViewOnly && new Date().toISOString().substring(0, 16))}
                          ref={ref}
                          errorMessage={error?.message}
                          disabled={isViewOnly}
                          title="FollowUp At"
                        />
                      )}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={6} xs={12} className="mt-md-0 mt-3">
                    <Controller
                      name="iFollowupBy"
                      control={visitControl}
                      rules={{ required: 'This field is required' }}
                      render={({ field, fieldState: { error } }) => (
                        <Input
                          {...field}
                          labelText="FollowUp By"
                          placeholder="Enter FollowUp By"
                          id="iFollowupBy"
                          errorMessage={error?.message}
                          disabled={isViewOnly}
                          type='text'
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
                <Button type='submit' onClick={gotoFollowUpEdit}>
                  Save
                </Button>
              </div>
            </div>
          </CustomModal>
        </>
      }

    </>
  )
}

export default AddInquiry
