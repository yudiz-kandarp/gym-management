/* eslint-disable no-unused-vars */

import ActionColumn from 'Components/ActionColumn'
import Divider from 'Components/Divider'
import PageTitle from 'Components/Page-Title'
import Search from 'Components/Search'
import TablePagination from 'Components/Table-pagination'
import Wrapper from 'Components/wrapper'
import { debounce } from 'Hooks/debounce'
import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'
import { appendParams, cell, formatDate, getSortedColumns, isGranted, parseParams, toaster } from 'helpers'
import React, { useCallback, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import CustomModal from 'Components/Modal'
import Button from 'Components/Button'
import DataTable from 'Components/DataTable'
import { getQuestionsList, getSpecificQuestion } from 'Query/Questions/questions.query'
import { Col, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import DescriptionInput from 'Components/DescriptionInput'
import Select from 'Components/Select'
import { addQuestion, deleteQuestion, updateQuestion } from 'Query/Questions/questions.mutation'

function QuestionsList () {
  const queryClient = useQueryClient()
  const parsedData = parseParams(location.search)
  const [modal, setModal] = useState({ open: false })
  const [questionModal, setQuestionModal] = useState({ open: false })
  const [action, setAction] = useState('')
  const [questionId, setQuestionId] = useState(null)

  const { control, handleSubmit, reset } = useForm()

  const [search, setSearch] = useState(parsedData?.search)

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

  const enums = [
    { label: 'Medical', value: 'M' },
    { label: 'Diet', value: 'D' }
  ]

  const { data } = useQuery(['questions', requestParams], () => getQuestionsList(requestParams), {
    select: (data) => data.data.data,
    staleTime: 240000,
  })

  const { isLoading, data: specificQuestion } = useQuery(['questionDetail', questionId], () => getSpecificQuestion(questionId), {
    enabled: action === 'edit' || action === 'view',
    select: (data) => data.data.oQuestion,
    onSuccess: (data) => {
      data.eCategory = enums.find(item => item?.value === data.eCategory)
      reset(data)
    },
  })

  const { mutate: addMutation } = useMutation((data) => addQuestion(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries('questions')
      toaster(data.data.message)
      setQuestionModal({ open: false })
    },
  })

  const { mutate: updateMutation } = useMutation((data) => updateQuestion(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('questions')
      toaster(res.data.message)
      setQuestionModal({ open: false })
    },
  })

  const { mutate: deleteMutation } = useMutation(deleteQuestion, {
    onSuccess: (data) => {
      toaster(data.data.message)
      queryClient.invalidateQueries('questions')
      setModal({ open: false })
    },
  })

  const [columns, setColumns] = useState(
    getSortedColumns(
      [
        { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
        { name: 'Questions', connectionName: 'sQuestion', isSorting: true, sort: 0 },
        { name: 'Category', connectionName: 'eCategory', isSorting: false, sort: 0 },
        { name: 'Updated Date', connectionName: 'dUpdatedDate', isSorting: false, sort: 0 },
      ],
      parsedData
    )
  )

  const onSubmit = (onSubmitData) => {
    console.log('onSubmitData: ', onSubmitData)
    
    const addData = {
      eCategory: onSubmitData?.eCategory?.value,
      sQuestion: onSubmitData?.sQuestion
    }

    if (action === 'edit') {
      updateMutation({ questionId, addData })
    } else {
      addMutation(addData)
    }
  }

  function gotoAdd () {
    reset(data)
    setAction('add')
    setQuestionModal({ open: true, })
  }

  function gotoEdit (id) {
    setAction('edit')
    setQuestionId(id)
    setQuestionModal({ open: true, id })
  }

  function gotoDetail (id) {
    setAction('view')
    setQuestionId(id)
    setQuestionModal({ open: true })
  }

  function onDelete (id) {
    setModal({ open: true, id })
  }

  const debouncedSearch = useCallback(
    debounce((trimmed) => {
      setRequestParams({ ...requestParams, page: 0, search: trimmed })
      appendParams({ ...requestParams, page: 0, search: trimmed })
    }),
    []
  )

  function handleSearch (e) {
    e.preventDefault()
    setSearch(e.target.value)
    const trimmed = e.target.value.trim()
    debouncedSearch(trimmed)
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

  function handleSorting (name) {
    let selectedFilter
    const filter = columns.map((data) => {
      if (data.connectionName === name) {
        data.sort = data.sort === 1 ? -1 : data.sort === -1 ? 0 : 1
        selectedFilter = data
      } else {
        data.sort = 0
      }
      return data
    })
    setColumns(filter)
    const params = {
      ...requestParams,
      page: 0,
      sort: selectedFilter.sort !== 0 ? selectedFilter.connectionName : '',
      order: selectedFilter.sort === 1 ? 'asc' : selectedFilter.sort === -1 ? 'desc' : '',
    }
    setRequestParams(params)
    appendParams(params)
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

  return (
    <>
      <Wrapper>
        <PageTitle
          title="Questions"
          BtnText={isGranted(permissions.CREATE) ? 'Add Question' : null}
          handleButtonEvent={gotoAdd}
          add
        />
        <div className="w-100 d-flex justify-content-between flex-wrap gap-2 mt-4">
          <div className="d-flex align-items-center gap-2">
            <Search
              startIcon={<SearchIcon className="mb-1" />}
              style={{ width: '250px', height: '40px' }}
              placeholder="Search Question"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <Divider width={'155%'} height="1px" />

        <DataTable
          columns={columns}
          align="left"
          totalData={data?.aQuestionList?.length}
          isLoading={isLoading}
          handleSorting={handleSorting}
          disableActions={!isGranted(permissions.ALL)}
        >
          {data?.aQuestionList?.map((item, i) => {
            return (
              <tr key={i}>
                <td>{cell(requestParams.page + (i + 1))}</td>
                <td className="d-inline-block text-truncate" style={{maxWidth: 450}}>{cell(item?.sQuestion)}</td>
                <td>{cell(item?.eCategory)}</td>
                <td>{cell(formatDate(item?.dUpdatedDate))}</td>
                <ActionColumn
                  permissions={permissions}
                  handleView={() => gotoDetail(item._id)}
                  handleEdit={() => gotoEdit(item._id)}
                  handleDelete={() => onDelete(item._id)}
                />
              </tr>
            )
          })}
        </DataTable>
      </Wrapper>

      <Wrapper transparent>
        <TablePagination
          currentPage={Number(requestParams?.page)}
          totalCount={data?.count || 0}
          pageSize={requestParams?.limit || 5}
          onPageChange={(page) => changePage(page)}
          onLimitChange={(limit) => changePageSize(limit)}
        />
      </Wrapper>

      {questionModal && (action !== 'delete') &&
        <CustomModal
          modalBodyClassName="p-0 py-2"
          open={questionModal.open}
          handleClose={() => setQuestionModal({ open: false })}
          title={action === 'add' ? 'Add Question' : action === 'edit' ? 'Edit Question' : 'View Questions'}
        >
          <div className="d-flex flex-column">
            <div>
              <Row>
                <Col lg={12} md={12} xs={12}>
                  <Controller
                    name="eCategory"
                    control={control}
                    rules={{ required: 'This field is required' }}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <>
                        <Select
                          labelText="Category"
                          id="eCategory"
                          placeholder="Select Category"
                          onChange={onChange}
                          value={value}
                          getOptionLabel={(option) => option?.label}
                          getOptionValue={(option) => option?.value}
                          ref={ref}
                          isDisabled={action === 'view'}
                          errorMessage={error?.message}
                        options={enums}
                        />
                      </>
                    )}
                  />
                </Col>
              </Row>
              <Row className='mt-2'>
                <Col lg={12} md={12} xs={12} className="mt-md-0 mt-3">
                  <Controller
                    name="sQuestion"
                    control={control}
                    rules={{ required: 'This field is required' }}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <DescriptionInput
                          className="p-2 text-dark"
                          label="Question"
                          errorMessage={error?.message}
                          disabled={action === 'view'}
                          placeholder="Enter Question"
                          {...field}
                        />
                      </>
                    )}
                  />
                </Col>
              </Row>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setQuestionModal({ open: false })}>
                Cancel
              </Button>
              {
                (action === 'add' || action === 'edit') &&
                <Button type='submit' onClick={handleSubmit(onSubmit)}>
                  Save
                </Button>
              }
            </div>
          </div>
        </CustomModal>
      }

      <CustomModal modalBodyClassName="p-0 py-2" open={modal.open} handleClose={() => setModal({ open: false })} title="Are you Sure?">
        <h6>Are you sure you want to delete?</h6>
        <div className="d-flex justify-content-between">
          <div></div>
          <div className="mt-4">
            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModal({ open: false })}>
              Cancel
            </Button>
            <Button onClick={() => deleteMutation(modal.id)} loading={deleteMutation.isLoading}>
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  )
}

export default QuestionsList 
