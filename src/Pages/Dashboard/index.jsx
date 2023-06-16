import PageTitle from 'Components/Page-Title'
import Wrapper from 'Components/wrapper'
import { getDashboardStatistics } from 'Query/Dashboard/dashboard.query'
// import { parseParams } from 'helpers'
import React, { useState } from 'react'
import { useQuery } from 'react-query'

export default function Dashboard() {
  // const parsedData = parseParams(location.search)
  const [data, setData] = useState([])

//   function getParams() {
//     return {
//       page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
//       limit: Number(parsedData?.limit) || 10,
//       search: parsedData?.search || '',
//       sort: parsedData.sort || '',
//       order: parsedData.order || '',
//     }
//   }
//   const [requestParams, setRequestParams] = useState(getParams())
// console.log('object :>> ', setRequestParams)

  const { isLoading } = useQuery('dashboard', () => getDashboardStatistics, {
    select: (data) => data.then(result => setData(result.data.data)),
    staleTime: 240000,
  })
  console.log('statistics data >> ', data, isLoading)

  return (
    <Wrapper>
      <PageTitle title="Dashboard" />
    </Wrapper>
  )
}
