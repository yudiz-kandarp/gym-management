import React, { memo, useEffect, useMemo, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { monthsForChart } from 'helpers'
import PropTypes from 'prop-types'

function LineChart({ chartData }) {
  const chartRef = useRef()
  let options = useMemo(
    () => ({
      responsive: true,
      aspectRatio: 0 / 1,
      plugins: {
        legend: {
          display: false,
        },
      },
      animations: {
        tension: {
          duration: 1000,
          easing: 'easeInOutCubic',
          from: 0.8,
          to: 0.4,
          loop: false,
        },
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
      tooltipFillColor: 'rgba(0,0,0,0.8)',
      tooltipFontStyle: 'bold',
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          grid: {
            display: false,
          },
          beginAtZero: true,
        },
      },
    }),
    []
  )

  useEffect(() => {
    if (chartRef.current) {
      let ctx = chartRef?.current?.getContext('2d')
      let gradient = ctx?.createLinearGradient(0, 0, 0, 400)
      gradient.addColorStop(0, '#0487FF09')
      gradient.addColorStop(0.8, '#ffffff49')
      gradient.addColorStop(1, '#ffffff60')

      let data = {
        labels: Object.values(monthsForChart),
        datasets: [
          {
            borderColor: '#0487FF',
            backgroundColor: gradient,
            fill: true,
            data: Object.keys(monthsForChart)?.map((month) => {
              return chartData?.find((m) => +m.month === +month)?.count || 0
            }),

            tension: 0.5,
          },
        ],
      }

      Chart.register(...registerables)
      new Chart(ctx, { type: 'line', data, options })
    }
  }, [chartData])

  return <canvas ref={chartRef} style={{ height: '100%', width: '100%' }}></canvas>
}

export default memo(LineChart)

LineChart.propTypes = {
  chartData: PropTypes.array,
}
