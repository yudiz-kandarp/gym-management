import { MutationCache, QueryCache, QueryClient } from 'react-query'

export const queryClient = new QueryClient({
  logger: {
    log: (...args) => {
      // Log debugging information
      console.log(...args)
    },
    warn: (...args) => {
      // Log warning
      console.warn(...args)
    },
    error: (...args) => {
      // Log error
      console.error(...args)
    },
  },
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      disableToast: false,
      // onSettled: (_d, e) = > {
      //   const { url, method } = e.config
      //   if (isNotificationSkippable(url, method)) return
      //   if (e?.message === 'Network Error') {
      //     queryClient.defaultOptions.message({ message: e?.message, type: 'error' })
      //   } else if (e?.response?.status > 300) {
      //     queryClient.defaultOptions.message({ message: e?.response?.data.message || e?.message, type: 'error' })
      //   }
      // },
    },
    // mutations: {
    //   onSettled: (_d, e) => {
    //     const { url, method } = e.config
    //     if (isNotificationSkippable(url, method)) return
    //     if (e?.message === 'Network Error') {
    //       queryClient.defaultOptions.message({ message: e?.message, type: 'error' })
    //     } else if (e?.response?.status === 500) {
    //       queryClient.defaultOptions.message({ message: e?.message, type: 'warning' })
    //     } else if (e?.response?.status > 300 && e?.response?.status < 500) {
    //       queryClient.defaultOptions.message({ message: e?.response?.data.message || e?.message, type: 'error' })
    //     } else if (e?.response?.status <= 500) {
    //       queryClient.defaultOptions.message({ message: e?.response?.data.message || e?.message, type: 'warning' })
    //     }
    //   },
    // },
    message: ({ message, type }) => {
      queryClient.invalidateQueries('toast')
      queryClient.setQueryData('message', () => ({ message, type }))
    },
  },
  queryCache: new QueryCache({
    onError: (e, query) => {
      if (!query?.options?.disableToast)
        if (e?.message === 'Network Error') {
          queryClient.defaultOptions.message({ message: e?.message, type: 'error' })
        } else if (e?.response?.status === 500) {
          queryClient.defaultOptions.message({ message: e?.message, type: 'warning' })
        } else if (e?.response?.status > 300 && e?.response?.status < 500) {
          queryClient.defaultOptions.message({ message: e?.response?.data.message || e?.message, type: 'error' })
        } else if (e?.response?.status <= 500) {
          queryClient.defaultOptions.message({ message: e?.response?.data.message || e?.message, type: 'warning' })
        }
    },
  }),
  mutationCache: new MutationCache({
    onError: (e, query) => {
      console.log({ query })
      if (!query?.options?.disableToast)
        if (e?.message === 'Network Error') {
          queryClient.defaultOptions.message({ message: e?.message, type: 'error' })
        } else if (e?.response?.status === 500) {
          queryClient.defaultOptions.message({ message: e?.message, type: 'warning' })
        } else if (e?.response?.status > 300 && e?.response?.status < 500) {
          queryClient.defaultOptions.message({ message: e?.response?.data.message || e?.message, type: 'error' })
        } else if (e?.response?.status <= 500) {
          queryClient.defaultOptions.message({ message: e?.response?.data.message || e?.message, type: 'warning' })
        }
    },
  }),
})

queryClient.devtools = false

// const skipNotifications = [{ url: '/api/c/v1', method: 'get', exact: false }]

// // this function is specific for Axios
// export function isNotificationSkippable(url, method) {
//   // eslint-disable-next-line no-undef
//   const isDev = process.env.NODE_ENV === 'development'
//   if (isDev) console.log('toast is disabled from isNotificationSkippable function')
//   return skipNotifications.find((notify) => {
//     return notify.exact ? url === notify.url && method === notify.method : url.includes(notify.url) && method === notify.method
//   })
// }
