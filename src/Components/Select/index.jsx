import React, { forwardRef, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import ReactSelect, { components } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import './_select.scss'
import CustomToolTip from 'Components/TooltipInfo'
// import { createOption } from 'helpers'

function Select(
  {
    labelText,
    options,
    className,
    height,
    width,
    errorMessage,
    fetchMoreData,
    css,
    // limit = 1,
    onCreateOption,
    CreateOptionLabel,
    CreateOptionValue,
    isClearable = false,
    isMulti,
    isColored,
    tooltip,
    ...props
  },
  ref = useRef()
) {
  const customStyles = {
    control: (base) => ({
      ...base,
      background: '#fff',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: errorMessage ? 'red' : '#dfe4ec',
      width: width || base.width,
      height: height || base.height,
      minHeight: 40,
      ':hover': {
        cursor: 'pointer',
        borderWidth: 1,
        border: '1px solid #818384',
        // borderColor: errorMessage ? 'red' : '#dfe4ec',
        outline: '0px !important',
      },
    }),
    option: (base, opt) => ({
      ...base,
      cursor: 'pointer',
      margin: '5px 0px',
      width: '100%',
      borderRadius: '8px',
      ...(isColored
        ? {
            color: opt.isSelected ? '#fff' : opt.data.sTextColor,
            backgroundColor: opt.isSelected ? '#2684ff' : opt.data.sBackGroundColor,
            fontWeight: '600',
            boxShadow: `inset 0 0 0 1px 30px ${opt.data.sTextColor}`,
          }
        : {}),
    }),
    menu: (base) => {
      return {
        ...base,
        zIndex: 999999,
        '*': {
          zIndex: 999999,
          scrollBehavior: 'smooth',
        },
        borderRadius: '12px',
        padding: '0 8px',
      }
    },
    placeholder: (base) => ({
      ...base,
      color: '#b2bfd2',
    }),
    singleValue: (base) => ({
      ...base,
      color: '#020202',
      ':hover': {
        cursor: 'pointer',
      },
    }),
    dropdownIndicator: (base) => ({
      ...base,
    }),
    indicatorSeparator: (base) => ({
      ...base,
      opacity: 0,
    }),
    clearIndicator: (base) => ({
      ...base,
    }),
    container: (base) => ({
      ...base,
      ...css,
    }),
    valueContainer: (base) => {
      const padding = isMulti ? '2px 5px' : base.padding
      return { ...base, padding }
    },
    multiValue: (styles, a) => {
      // if (a.index >= limit) {
      //   return { display: 'none' }
      // }
      const colored = isColored
        ? {
            color: a.data?.sTextColor,
            fontWeight: 500,
            '*': { borderRadius: '6px', color: a.data?.sTextColor, backgroundColor: a.data?.sBackGroundColor, fontWeight: 500 },
            backgroundColor: a.data?.sBackGroundColor,
          }
        : {
            color: '#445774',
            border: '2px solid transparent',
            backgroundColor: '#F2F4F7',
            ':hover': {
              border: '2px solid #12121240',
              color: '#445774',
            },
          }

      return {
        ...styles,
        margin: '4px 4px',
        borderRadius: '6px',
        transition: '0.2s all ease-out',
        ...colored,
      }
    },
    multiValueRemove: (styles, { data }) => {
      const colored = isColored
        ? {
            color: data.sTextColor,
            backgroundColor: data.sBackGroundColor,
            ':hover': {
              '*': {
                color: data.sBackGroundColor,
                backgroundColor: data.sTextColor,
              },
              backgroundColor: data.sTextColor,
            },
          }
        : {
            color: '#B2BFD2',
            border: '2px solid transparent',
            ':hover': {
              backgroundColor: '#dc3545cc',
              border: '2px solid #ff0000',
              color: '#f2f2f2',
              borderRadius: '4px',
            },
          }
      return {
        ...styles,
        marginLeft: '5px',
        borderRadius: '4px',
        ...colored,
      }
    },
  }

  const Component = useMemo(() => (onCreateOption ? CreatableSelect : ReactSelect), [])

  return (
    <>
      <div className={'select-container ' + (className || '')} style={{ width: width || 'unset' }}>
        {labelText && <label htmlFor={labelText}>{labelText}</label>}
        <Component
          ref={ref}
          tooltip={!isMulti ? tooltip?.(props.value) : null}
          id={labelText}
          styles={customStyles}
          isClearable={isClearable}
          components={{ ValueContainer }}
          options={options}
          onCreateOption={onCreateOption}
          isMulti={isMulti}
          menuPlacement="auto"
          onMenuScrollToBottom={fetchMoreData}
          allowCreateWhileLoading
          getNewOptionData={(value, label) => ({
            [CreateOptionLabel]: label,
            [CreateOptionValue]: value,
            __isNew__: true,
          })}
          {...props}
        />
        {/* {onCreateOption ? (
          <CreatableSelect
            ref={ref}
            tooltip={tooltip?.(props.value)}
            id={labelText}
            styles={customStyles}
            isClearable={isClearable}
            components={{ ValueContainer }}
            options={options}
            onCreateOption={onCreateOption}
            isMulti={isMulti}
            menuPlacement="auto"
            onMenuScrollToBottom={fetchMoreData}
            allowCreateWhileLoading
            getNewOptionData={(value, label) => ({
              [CreateOptionLabel]: label,
              [CreateOptionValue]: value,
              __isNew__: true,
            })}
            {...props}
          />
        ) : (
          <ReactSelect
            ref={ref}
            id={labelText}
            styles={customStyles}
            isClearable={isClearable}
            options={options}
            tooltip={tooltip?.(props.value)}
            components={{ ValueContainer }}
            isMulti={isMulti}
            menuPlacement="auto"
            onMenuScrollToBottom={fetchMoreData}
            {...props}
          />
        )} */}
        {errorMessage && <p className="errorMessage">{errorMessage}</p>}
      </div>
    </>
  )
}

Select.propTypes = {
  id: PropTypes.string,
  labelText: PropTypes.string,
  options: PropTypes.array,
  fetchMoreData: PropTypes.func,
  errorMessage: PropTypes.string,
  errorDisable: PropTypes.bool,
  isClearable: PropTypes.bool,
  className: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  css: PropTypes.object,
  isMulti: PropTypes.bool,
  isColored: PropTypes.bool,
  limit: PropTypes.number,
  onCreateOption: PropTypes.func,
  CreateOptionLabel: PropTypes.string,
  CreateOptionValue: PropTypes.string,
  value: PropTypes.any,
  tooltip: PropTypes.string,
}

function ValueContainer({ children, ...props }) {
  // const style = {
  //   cursor: 'pointer',
  //   padding: '5px',
  //   fontSize: '13px',
  //   color: '#333333',
  //   background: '#F2F4F7',
  //   borderRadius: '6px',
  //   whiteSpace: 'nowrap',
  // }

  // const ArrayLength = React.Children.count(children) - 1

  return (
    <components.ValueContainer {...props}>
      {props.selectProps.tooltip ? (
        <CustomToolTip tooltipContent={props.selectProps.tooltip} position="bottom">
          {({ target }) => (
            <div className="d-flex align-items-center text-truncate" ref={target}>
              {children}
            </div>
          )}
        </CustomToolTip>
      ) : (
        children
      )}
    </components.ValueContainer>
  )
}
ValueContainer.propTypes = {
  children: PropTypes.node,
  selectProps: PropTypes.any,
  limit: PropTypes.number,
  tooltip: PropTypes.string,
}

export default forwardRef(Select)
