import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery, useQueryClient } from 'react-query'
import { Toast, ToastContainer } from 'react-bootstrap'
import ToastIcon from 'Assets/Icons/ToastIcon'
import Cancel from 'Assets/Icons/Cancel'

function Toaster({ limit }) {
  const [messages, setMessages] = useState([])
  const queryClient = useQueryClient()

  function handleMultiToast(toast) {
    const newMessages = [...messages]
    toast.timeout = (time = 5000) =>
      setTimeout(() => {
        setMessages((messages) => messages?.filter((message) => message?.id !== toast?.id))
      }, time)

    if (newMessages?.length >= limit) {
      const removedMessage = newMessages.shift()
      clearTimeout(removedMessage.timeout)
    }
    const isExisting = messages?.find(({ message }) => message === toast.message)
    if (isExisting) return
    newMessages.push(toast)
    setMessages(newMessages)
    toast.timeout()
  }

  function handleClose(id) {
    const message = messages?.find((message) => message?.id === id)
    clearTimeout(message.timeout)
    setMessages((message) => message?.filter((message) => message?.id !== id))
  }

  useQuery('toast', () => {}, {
    onSuccess: () => {
      handleMultiToast({
        id: new Date().getTime(),
        message: queryClient.getQueryData('message')?.message,
        type: queryClient.getQueryData('message')?.type,
        isOpen: true,
      })
    },
  })

  function toastStyle(toastType) {
    const types = {
      success: '#27B98D',
      error: '#ff5658',
      warning: '#ffad0d',
    }
    const backgroundColor = {
      success: '#F1FFFB',
      error: '#FFF8F8',
      warning: '#FFF8F8',
    }

    return { color: types[toastType], backgroundColor: backgroundColor[toastType] }
  }
  return (
    <ToastContainer style={{ zIndex: 1400 }} position="top-end" className="p-3 zindex-fixed">
      {messages.map(({ message, id, type, isOpen }, index) => {
        const { backgroundColor, color } = toastStyle(type)
        if(message && isOpen) {
          return (<Toast
          show={isOpen}
          key={index}
          onClose={() => handleClose(id)}
          style={{
            backgroundColor: backgroundColor,
            color: color,
            border: `1px solid ${color}`,
            boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            userSelect: 'none',
          }}
        >
          <Toast.Body className="d-flex justify-content-between align-items-center ">
            <div className="d-flex align-items-center">
              <ToastIcon fill={color} className="me-2" style={{ width: '30px', minWidth: '30px' }} />
              {message}
            </div>
            <div onClick={() => handleClose(id)}>
              <Cancel fill={color} />
            </div>
          </Toast.Body>
        </Toast>)
        } else {
          return <div key={index} />
        }
      })}
    </ToastContainer>
  )
}

export default memo(Toaster)

Toaster.propTypes = {
  limit: PropTypes.number,
}
