import React, { useCallback, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { deleteSubscription } from 'Query/Subscription/subscription.mutation'
import { getSubscriptionList } from 'Query/Subscription/subscription.query'
import Wrapper from 'Components/wrapper'
import PageTitle from 'Components/Page-Title'
import TablePagination from 'Components/Table-pagination'
import CustomModal from 'Components/Modal'
// import Select from 'Components/Select'
import Divider from 'Components/Divider'
import Button from 'Components/Button'
import DataTable from 'Components/DataTable'
import Search from 'Components/Search'
import ActionColumn from 'Components/ActionColumn'
// import useResourceDetails from 'Hooks/useResourceDetails'
import { debounce } from 'Hooks/debounce'
import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'
import { appendParams, cell, formatDate, getSortedColumns, isGranted, parseParams, toaster } from 'helpers'
import { route } from 'Routes/route'

function SubscriptionList() {
  const queryClient = useQueryClient()
  const parsedData = parseParams(location.search)
  const [modal, setModal] = useState({ open: false })

  const [search, setSearch] = useState(parsedData?.search)

  function getParams() {
    return {
      page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
      limit: Number(parsedData?.limit) || 10,
      search: parsedData?.search || '',
      sort: parsedData.sort || '',
      order: parsedData.order || '',
    }
  }
  const [requestParams, setRequestParams] = useState(getParams())

  const { isLoading, isFetching, data } = useQuery(['subscription', requestParams], () => getSubscriptionList(requestParams), {
    select: (data) => data.data.data,
    staleTime: 240000,
  })

  const mutation = useMutation(deleteSubscription, {
    onSuccess: (res) => {
      queryClient.invalidateQueries('subscription')
      toaster(res.data.message)
      setModal({ open: false })
    },
  })

  const [columns, setColumns] = useState(
    getSortedColumns(
      [
        { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
        { name: 'Customer Name', connectionName: 'sCustomerName', isSorting: false, sort: 0 },
        { name: 'Payment Tag', connectionName: 'ePaymentTag', isSorting: false, sort: 0 },
        { name: 'Start Date', connectionName: 'dStartDate', isSorting: false, sort: 0 },
        { name: 'End Date', connectionName: 'dEndDate', isSorting: false, sort: 0 },
      ],
      parsedData
    )
  )

  const navigate = useNavigate()

  function gotoAdd() {
    navigate(route.subscriptionsAddViewEdit('add'))
  }

  function gotoEdit(id) {
    navigate(route.subscriptionsAddViewEdit('edit', id))
  }

  function gotoDetail(id) {
    navigate(route.subscriptionsAddViewEdit('view', id))
  }

  function onDelete(id) {
    setModal({ open: true, id })
  }

  const debouncedSearch = useCallback(
    debounce((trimmed) => {
      setRequestParams({ ...requestParams, page: 0, search: trimmed })
      appendParams({ ...requestParams, page: 0, search: trimmed })
    }),
    []
  )

  function handleSearch(e) {
    e.preventDefault()
    setSearch(e.target.value)
    const trimmed = e.target.value.trim()
    debouncedSearch(trimmed)
  }

  function changePage(page) {
    setRequestParams({ ...requestParams, page, limit: requestParams?.limit || 10 })
    appendParams({ ...requestParams, page: page / requestParams?.limit, limit: requestParams?.limit || 10 })
  }

  function changePageSize(pageSize) {
    setRequestParams({ ...requestParams, page: 0, limit: pageSize })
    appendParams({ ...requestParams, page: 0, limit: pageSize })
    // setSelectedRows([{ changingPage: true }])
  }

  function handleSorting(name) {
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
    get ALL() {
      return [this.READ, this.UPDATE, this.DELETE]
    },
  }

  return (
    <>
      <Wrapper>
        <PageTitle
          title="Subscriptions"
          BtnText={isGranted(permissions.CREATE) ? 'Add Subscription' : null}
          handleButtonEvent={gotoAdd}
          add
        />
        <div className="w-100 d-flex justify-content-between flex-wrap gap-2 mt-4">
          <div className="d-flex align-items-center">
            <Search
              startIcon={<SearchIcon className="mb-1" />}
              style={{ width: '250px', height: '40px' }}
              placeholder="Search Subscriptions"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <Divider width={'155%'} height="1px" />

        <DataTable
          columns={columns}
          align="left"
          totalData={data?.aSubscriptionList?.length}
          isLoading={isLoading || mutation.isLoading || isFetching}
          handleSorting={handleSorting}
          disableActions={!isGranted(permissions.ALL)}
        >
          {data?.aSubscriptionList?.map((item, i) => {
            return (
              <tr key={i}>
                <td>{cell(requestParams.page + (i + 1))}</td>
                <td>{cell(item?.oCustomer?.sName)}</td>
                <td>{cell(item?.ePaymentTag)}</td>
                <td>{cell(formatDate(item?.dStartDate))}</td>
                <td>{cell(formatDate(item?.dEndDate))}</td>
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

export default SubscriptionList
