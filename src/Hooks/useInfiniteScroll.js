import { useState } from 'react'
import { useQuery } from 'react-query'

export default function useInfiniteScroll(deps, queryFn, { onReset, requestParams, updater = () => {}, ...options }) {
  const [resourceDetail, setResourceDetail] = useState([])
  const [timeoutHandle, setTimeoutHandle] = useState()

  function settingScrollState(length) {
    if (length >= 15) {
      startScroll()
    } else {
      stopScroll()
    }
  }

  const data = useQuery(deps, queryFn, {
    ...options,
    select: (data) => (options.select ? options.select(data) : data),
    onSuccess: function (data) {
      const length = data.length
      settingScrollState(length)
      if (requestParams.page > 0) {
        setResourceDetail((p) => [...(p?.length ? p : []), ...(length ? data : [])])
      } else {
        setResourceDetail(data)
        onReset ? onReset(data) : null
      }
    },
  })

  function handleScroll() {
    if (requestParams.next) {
      updater((p) => ({ ...p, page: p?.page + requestParams.limit }))
    }
  }

  function handleSearch(search) {
    if (search) {
      clearTimeout(timeoutHandle)
      const timeout = setTimeout(() => updater((p) => ({ ...p, page: 0, search, isSearching: true })), 1500)
      setTimeoutHandle(timeout)
    } else {
      updater((p) => ({ ...p, page: 0, search, isSearching: true }))
    }
  }

  function stopScroll() {
    updater((p) => ({ ...p, next: false }))
  }

  function startScroll() {
    updater((p) => ({ ...p, next: true }))
  }

  function reset() {
    setResourceDetail([])
    updater({ page: 0, limit: 15 })
  }

  return { ...data, data: resourceDetail, handleScroll, handleSearch, reset }
}
