import React from 'react'
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import AllRoutes from './Routes'
import { queryClient } from './queryClient'
import './Assets/Style/style.scss'
import { userContext } from './context/user'
import userReducer from './store/reducers/userReducers'
// import './firebase-messaging'

// eslint-disable-next-line no-undef
console.log(process.env.NODE_ENV)

function App() {
  const [state, dispatch] = React.useReducer(userReducer)

  return (
    <QueryClientProvider contextSharing={true} client={queryClient}>
      <userContext.Provider value={{ state, dispatch }}>
      <AllRoutes />
      {queryClient?.devtools ? <ReactQueryDevtools initialIsOpen={false} /> : null}
      </userContext.Provider>
    </QueryClientProvider>
  )
}

export { queryClient }

export default App
