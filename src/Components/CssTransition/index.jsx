import React, { useEffect, useState } from 'react'

const defaultProps = {
  visible: false,
  enterTime: 60,
  leaveTime: 60,
  clearTime: 60,
  className: '',
  name: 'transition',
}

const CssTransition = ({ children, className, visible, enterTime, leaveTime, clearTime, name, ...props }) => {
  const [classes, setClasses] = useState('')
  const [renderable, setRenderable] = useState(visible)

  useEffect(() => {
    const statusClassName = visible ? 'enter' : 'leave'
    const time = visible ? enterTime : leaveTime
    if (visible && !renderable) {
      setRenderable(true)
    }

    setClasses(`${name}-${statusClassName}`)

    const timer = setTimeout(() => {
      setClasses(`${name}-${statusClassName} ${name}-${statusClassName}-active`)
      clearTimeout(timer)
    }, time)

    const clearClassesTimer = setTimeout(() => {
      if (!visible) {
        setClasses('')
        setRenderable(false)
      }
      clearTimeout(clearClassesTimer)
    }, time + clearTime)

    return () => {
      clearTimeout(timer)
      clearTimeout(clearClassesTimer)
    }
  }, [visible, renderable])
  if (!React.isValidElement(children) || !renderable) return null

  return React.cloneElement(children, {
    ...props,
    className: `${children.props.className} ${className} ${classes}`,
  })
}

CssTransition.defaultProps = defaultProps
CssTransition.displayName = 'CssTransition'
export default CssTransition
