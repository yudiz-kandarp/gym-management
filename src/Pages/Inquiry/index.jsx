import PageTitle from 'Components/Page-Title'
import Search from 'Components/Search'
import Wrapper from 'Components/wrapper'
import { debounce } from 'Hooks/debounce'
import { deleteInquiry } from 'Query/Inquiry/inquiry.mutation'
import { getInquiryList } from 'Query/Inquiry/inquiry.query'
import { appendParams, cell, formatDate, getSortedColumns, isGranted, parseParams, toaster } from 'helpers'
import React, { useCallback, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'
import Divider from 'Components/Divider'
import DataTable from 'Components/DataTable'
import ActionColumn from 'Components/ActionColumn'
import TablePagination from 'Components/Table-pagination'
import Button from 'Components/Button'
import CustomModal from 'Components/Modal'
import { route } from 'Routes/route'

function InquiryList () {
  const queryClient = useQueryClient()
  const parsedData = parseParams(location.search)
  const [modal, setModal] = useState({ open: false })

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

  const { isLoading, isFetching, data } = useQuery(['inquiry', requestParams], () => getInquiryList(requestParams), {
    select: (data) => data.data.data,
    staleTime: 240000,
  })

  const mutation = useMutation(deleteInquiry, {
    onSuccess: (res) => {
      queryClient.invalidateQueries('inquiry')
      toaster(res.data.message)
      setModal({ open: false })
    },
  })

  const [columns, setColumns] = useState(
    getSortedColumns(
      [
        { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
        { name: 'Customer Name', connectionName: 'sName', isSorting: false, sort: 0 },
        { name: 'Branch Name', connectionName: 'sBranchName', isSorting: false, sort: 0 },
        { name: 'Purpose', connectionName: 'sPurpose', isSorting: false, sort: 0 },
        { name: 'Inquiry Date', connectionName: 'dInquiryAt', isSorting: false, sort: 0 },
      ],
      parsedData
    )
  )

  const navigate = useNavigate()

  function gotoAdd () {
    navigate(route.inquiryAddViewEdit('add'))
  }

  function gotoEdit (id) {
    navigate(route.inquiryAddViewEdit('edit', id))
  }

  function gotoDetail (id) {
    navigate(route.inquiryAddViewEdit('view', id))
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
      <Wrapper transparent>
        <TablePagination
          currentPage={Number(requestParams?.page)}
          totalCount={data?.count || 0}
          pageSize={requestParams?.limit || 5}
          onPageChange={(page) => changePage(page)}
          onLimitChange={(limit) => changePageSize(limit)}
        />
      </Wrapper>
      
      <Wrapper>
        <PageTitle
          title="Inquiry"
          BtnText={isGranted(permissions.CREATE) ? 'Add Inquiry' : null}
          handleButtonEvent={gotoAdd}
          add
        />
        <div className="w-100 d-flex justify-content-between flex-wrap gap-2 mt-4">
          <div className="d-flex align-items-center gap-2">
            <Search
              startIcon={<SearchIcon className="mb-1" />}
              style={{ width: '250px', height: '40px' }}
              placeholder="Search Inquiry"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <Divider width={'155%'} height="1px" />

        <DataTable
          columns={columns}
          align="left"
          totalData={data?.aInquiryList?.length}
          isLoading={isLoading || mutation.isLoading || isFetching}
          handleSorting={handleSorting}
          disableActions={!isGranted(permissions.ALL)}
        >
          {data?.aInquiryList?.map((item, i) => {
            return (
              <tr key={i}>
                <td>{cell(requestParams.page + (i + 1))}</td>
                <td>{cell(item?.sName)}</td>
                <td>{cell(item?.oBranch?.sName)}</td>
                <td>{cell(item?.sPurpose)}</td>
                <td>{cell(formatDate(item?.dInquiryAt))}</td>
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

      <CustomModal modalBodyClassName="p-0 py-2" open={modal.open} handleClose={() => setModal({ open: false })} title="Are you Sure?">
        <h6>Are you sure you want to delete?</h6>
        <div className="d-flex justify-content-between">
          <div></div>
          <div className="mt-4">
            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModal({ open: false })}>
              Cancel
            </Button>
            <Button onClick={() => mutation.mutate(modal.id)} loading={mutation.isLoading}>
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  )
}

export default InquiryList
