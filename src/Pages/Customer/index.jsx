import React, { useCallback, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { deleteCustomer } from 'Query/Customer/customer.mutation'
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
import { appendParams, cell, getSortedColumns, isGranted, parseParams, toaster } from 'helpers'
import { route } from 'Routes/route'
import { getCustomerList } from 'Query/Customer/customer.query'

const CustomersList = () => {
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

  const { isLoading, isFetching, data } = useQuery(['customers', requestParams], () => getCustomerList(requestParams), {
    select: (data) => data.data.data,
    staleTime: 240000,
    // onSuccess: (data) => {
    //   setSelectedRows(data?.customers)
    // },
    // refetchInterval: (data) => {
    //   !selectedRows?.length ? setSelectedRows(data?.customers.map((d) => ({ ...d, isSelected: false }))) : null
    //   selectedRows?.[0]?.changingPage ? setSelectedRows(data?.customers.map((d) => ({ ...d, isSelected: false }))) : null
    // },
  })

  const mutation = useMutation(deleteCustomer, {
    onSuccess: (data) => {
      toaster(data.data.message)
      queryClient.invalidateQueries('customers')
      setModal({ open: false })
    },
  })

  const [columns, setColumns] = useState(
    getSortedColumns(
      [
        { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
        { name: 'Name', connectionName: 'sName', isSorting: true, sort: 0 },
        { name: 'Contact Number', connectionName: 'sMobile', isSorting: false, sort: 0 },
        { name: 'Email', connectionName: 'sEmail', isSorting: true, sort: 0 },
      ],
      parsedData
    )
  )

  const navigate = useNavigate()

  function gotoAddCustomer() {
    navigate(route.customersAddViewEdit('add'))
  }

  function gotoEdit(id) {
    navigate(route.customersAddViewEdit('edit', id))
  }

  function gotoDetail(id) {
    navigate(route.customersAddViewEdit('view', id))
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

  // function handleFilter(e, fName, opt) {
  //   if (opt.action === 'clear') {
  //     setFilters((f) => ({ ...f, [fName]: null }))
  //     setRequestParams({ ...requestParams, page: 0, [fName]: null, [fName + 'Label']: '' })
  //     appendParams({ ...requestParams, page: 0, [fName]: null, [fName + 'Label']: '' })
  //   } else {
  //     setFilters((f) => ({ ...f, [fName]: e }))
  //     setRequestParams({ ...requestParams, page: 0, [fName]: e._id, [fName + 'Label']: e.sName })
  //     appendParams({ ...requestParams, page: 0, [fName]: e._id, [fName + 'Label']: e.sName })
  //   }
  // }

  function changePage(page) {
    setRequestParams({ ...requestParams, page, limit: requestParams?.limit || 10 })
    appendParams({ ...requestParams, page: page / requestParams?.limit, limit: requestParams?.limit || 10 })
    // setSelectedRows([{ changingPage: true }])
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

  // function handleDownloadExcel() {
  //   ExcelMutation.mutate({
  //     module: 'Employee',
  //     requiredFields: mapFilter(
  //       ExcelFields,
  //       (f) => f.value,
  //       (f) => f.isSelected
  //     ),
  //     query: mapFilter(requestParams, null, (data) => data !== ''),
  //   })
  // }

  // function handleDownloadExcelOpen() {
  //   setModal({ Excel: true })
  //   setExcelFields(ExcelModules.Employee)
  // }
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
          title="Customers"
          BtnText={isGranted(permissions.CREATE) ? 'Add Customer' : null}
          handleButtonEvent={gotoAddCustomer}
          add
        />
        <div className="w-100 d-flex justify-content-between flex-wrap gap-2 mt-4">
          <div className="d-flex align-items-center">
            <Search
              startIcon={<SearchIcon className="mb-1" />}
              style={{ width: '250px', height: '40px' }}
              placeholder="Search Customers"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <Divider width={'155%'} height="1px" />

        <DataTable
          columns={columns}
          align="left"
          totalData={data?.aCustomerList?.length}
          isLoading={isLoading || mutation.isLoading || isFetching}
          handleSorting={handleSorting}
          disableActions={!isGranted(permissions.ALL)}
        >
          {data?.aCustomerList?.map((item, i) => {
            return (
              <tr key={i}>
                <td>{cell(requestParams.page + (i + 1))}</td>
                <td>{cell(item.sName)}</td>
                <td>{cell(item.sMobile)}</td>
                <td>{cell(item.sEmail)}</td>
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

export default CustomersList
