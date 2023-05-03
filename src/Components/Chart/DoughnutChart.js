import React, { useEffect, useMemo, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import PropTypes from 'prop-types'
import { convertMinutesToHour } from 'helpers'
import { useNavigate } from 'react-router-dom'
import { ButtonCoordinates, DoughnutChartPlugin } from './chartPlugins'

function DoughnutChart({ chartData, addWorkLogModalOpen, isAddWorklogsPermission = false }) {
  const chartRef = useRef()
  let doughnut
  const navigate = useNavigate()

  let options = useMemo(
    () => ({
      responsive: true,
      aspectRatio: 0,
      plugins: {
        tooltip: {
          borderWidth: 2,
          borderColor: '#f2f2f2',
          backgroundColor: (d) => (d?.tooltip?.dataPoints?.[0]?.raw.limitExceeded > 0 ? '#ff2d2d' : '#0487ff'),
          padding: 10,
          bodyFont: { size: 12, weight: 700, family: 'inter' },
          displayColors: false,
          callbacks: {
            label: (ct) => {
              if (ct?.raw?.isDepartment) {
                // if (ct?.raw?.limitExceeded) {
                //   return `${ct?.raw?.sName}${ct?.raw?.isUnfilled ? ' (remaining)' : ''}${
                //     ct?.raw?.limitExceeded ? `(extra ${ct?.raw?.limitExceeded}) hrs used` : ''
                //   } : ${ct?.raw?.dUsedHours + 'hrs'}`
                // }
                return `${ct?.raw?.sName}${ct?.raw?.isUnfilled ? ' (remaining)' : ''}${
                  ct?.raw?.limitExceeded > 0 ? ` (extra ${ct?.raw?.limitExceeded} hrs used)` : ''
                } : ${ct?.raw?.dUsedHours + 'hrs'}`
              }
              if (ct?.raw?.isProjectHours) {
                return `${ct?.raw?.value} hrs utilized`
              }
              return ct.parsed
            },
          },
        },
        legend: {
          display: false,
        },
      },
      elements: { arc: { borderWidth: 0 } },
    }),
    [chartData, chartRef]
  )

  function calculateDepartmentHours(data) {
    let departments = []
    let backgroundColor = []
    let borderColor = []
    let DepartmentUsedHours = 0
    let DepartmentTotal = 0
    
    data?.projectDepartment?.forEach((d) => {
      departments.push(
        {
          _id: d._id,
          sName: d.sName,
          dTotalHours: convertMinutesToHour(+d.nMinutes),
          dUsedHours: convertMinutesToHour(+d.nRemainingMinute),
          dRemainingHours:
            convertMinutesToHour(+d.nMinutes) - convertMinutesToHour(+d.nRemainingMinute) > 0
              ? convertMinutesToHour(+d.nMinutes) - convertMinutesToHour(+d.nRemainingMinute)
              : 0,
          dTotalCost: +d.nCost,
          dUsedCost: +d.nRemainingCost,
          color: d?.sTextColor,
          isDepartment: true,
          limitExceeded:
            data.eProjectType !== 'Dedicated' ? convertMinutesToHour(+d.nRemainingMinute) - convertMinutesToHour(+d.nMinutes) : 0,
        },
        {
          color: d?.sBackGroundColor,
          _id: d._id,
          sName: d.sName,
          dTotalHours: convertMinutesToHour(+d.nMinutes),
          dUsedHours:
            convertMinutesToHour(+d.nMinutes) - convertMinutesToHour(+d.nRemainingMinute) > 0
              ? convertMinutesToHour(+d.nMinutes) - convertMinutesToHour(+d.nRemainingMinute)
              : 0,
          dTotalCost: +d.nCost,
          dUsedCost: +d.nRemainingCost,
          isUnfilled: true,
          isDepartment: true,
        }
      )

      backgroundColor.push(
        convertMinutesToHour(+d.nRemainingMinute) <= convertMinutesToHour(+d.nMinutes)
          ? d?.sTextColor
          : data.eProjectType === 'Dedicated'
          ? d?.sTextColor
          : '#ff2d2d',
        d?.sBackGroundColor
      )
      // borderColor.push(
      //   convertMinutesToHour(+d.nRemainingMinute) <= convertMinutesToHour(+d.nMinutes) ? d?.sTextColor : '#ff2a2a',
      //   d?.sTextColor
      // )
      borderColor.push('#fff', '#fff')

      DepartmentUsedHours += convertMinutesToHour(+d.nRemainingMinute)
      DepartmentTotal += convertMinutesToHour(+d.nCost)
    })
    return { departments, DepartmentUsedHours, backgroundColor, DepartmentTotal, borderColor }
  }
  function calculateProjectHours(data) {
    let pTotalCost = Number(data?.projectIndicator?.sCost) || 0
    let pUsedCost = Number(data?.projectIndicator?.nRemainingCost) || 0
    let pTotalHours = convertMinutesToHour(+data?.projectIndicator?.nMinutes || 0)
    let pUsedHours = convertMinutesToHour(+data?.projectIndicator?.nRemainingMinute || 0)
    return { pTotalCost, pUsedCost, pTotalHours, pUsedHours }
  }
  function calculateCrHours(data) {
    const totalData = data?.crIndicators?.reduce(
      (a, c) => {
        a.cTotalCost += c?.nCost || 0
        a.cUsedCost += c?.nRemainingCost || 0
        a.cTotalHours += convertMinutesToHour(c?.nMinutes || 0)
        a.cUsedHours += convertMinutesToHour(c?.nRemainingMinute || 0)
        return a
      },
      { cTotalCost: 0, cUsedCost: 0, cTotalHours: 0, cUsedHours: 0 }
    )

    return totalData
  }

  function onChartClick(clickEvent) {
    if(!isAddWorklogsPermission) {
      return
    }
    const x = clickEvent.offsetX
    const y = clickEvent.offsetY
    const top = ButtonCoordinates.top
    const bottom = ButtonCoordinates.bottom
    const left = ButtonCoordinates.left
    const right = ButtonCoordinates.right

    if (x > left && x < right && y > top && y < bottom) {
      addWorkLogModalOpen({ sName: chartData.sName, _id: chartData._id })
      return
    }

    if (doughnut) {
      const points = doughnut.getElementsAtEventForMode(clickEvent, 'nearest', { intersect: true }, true)?.[0]
      const data = doughnut?.data?.datasets?.[points?.datasetIndex]?.data?.[points?.index]
      if (points?.datasetIndex === 1 && points?.index === 0 && data._id) {
        navigate(`/${data.label}/detail/${data._id}`)
        return
      }
    }
  }

  useEffect(() => {
    if (chartRef?.current && chartData) {
      let ctx = chartRef?.current?.getContext('2d')
      const projectData = calculateProjectHours(chartData)
      const crData = calculateCrHours(chartData)
      const { departments, backgroundColor, borderColor } = calculateDepartmentHours(chartData)
      let data = {
        datasets: [
          {
            cutout: '10%',
            circumference: () => {},
          },
          {
            label: 'total hours',
            data: [
              { value: projectData?.pUsedHours || 0, _id: chartData?._id, label: 'projects', isProjectHours: true },
              { value: crData?.cUsedHours || 0, label: 'change-request', isProjectHours: true },
            ],
            backgroundColor: ['#0487ff', 'violet'],
            borderColor: ['#fff', 'lightgreen'],
            borderRadius: 10,
            cutout: '60%',
            circumference: () => {
              return (
                360 *
                (projectData?.pUsedHours + crData?.cUsedHours < projectData?.pTotalHours + crData?.cTotalHours
                  ? (projectData?.pUsedHours + crData?.cUsedHours) / (projectData?.pTotalHours + crData?.cTotalHours)
                  : 1)
              )
            },
          },
          {
            data: [0],
            borderWidth: 0,
            circumference: () => {},
          },
          {
            cutout: '60%',
            label: 'department wise cost',
            data: departments?.length ? departments : [],
            backgroundColor: backgroundColor?.length ? backgroundColor : [],
            borderColor: borderColor,
            borderWidth: 0.8,
            borderRadius: chartData.eProjectType === 'Dedicated' ? 10 : 0,
            parsing: { key: 'dUsedHours' },
          },
        ],
      }
      Chart.register(...registerables)
      doughnut = new Chart(ctx, { type: 'doughnut', data, options, plugins: [DoughnutChartPlugin({ chartData, crData, projectData, isAddWorklogsPermission })] })
    }

    return () => {
      doughnut.destroy()
    }
  }, [chartData])

  useEffect(() => {
    if (chartRef?.current) {
      chartRef?.current?.addEventListener('click', (e) => {
        onChartClick(e, chartRef.current)
      })
      chartRef?.current?.addEventListener('mousemove', (e) => {
        const x = e.offsetX
        const y = e.offsetY
        const top = ButtonCoordinates.top
        const bottom = ButtonCoordinates.bottom
        const left = ButtonCoordinates.left
        const right = ButtonCoordinates.right
        if (x > left && x < right && y > top && y < bottom && isAddWorklogsPermission) {
          e.target.style.cursor = 'pointer'
        } else {
          e.target.style.cursor = 'default'
        }
      })
    }
    return () => {
      chartRef?.current?.addEventListener('click', (e) => {
        onChartClick(e, chartRef.current)
      })
      chartRef?.current?.addEventListener('mousemove', (e) => {
        const x = e.offsetX
        const y = e.offsetY
        const top = ButtonCoordinates.top
        const bottom = ButtonCoordinates.bottom
        const left = ButtonCoordinates.left
        const right = ButtonCoordinates.right
        if (x > left && x < right && y > top && y < bottom && isAddWorklogsPermission) {
          e.target.style.cursor = 'pointer'
        } else {
          e.target.style.cursor = 'default'
        }
      })
    }
  }, [chartRef?.current])

  return (
    <canvas
      ref={chartRef}
      id={chartData._id}
      // onClick={(e) => onChartClick(e, chartRef.current)}
      // onClick={() => navigate(`/projects/detail/${chartData._id}`)}
      style={{ height: '100%', width: '100%', margin: '40px 0' }}
    ></canvas>
  )
}

export default DoughnutChart

DoughnutChart.propTypes = {
  chartData: PropTypes.object,
  addWorkLogModalOpen: PropTypes.func,
  isAddWorklogsPermission: PropTypes.bool
}
