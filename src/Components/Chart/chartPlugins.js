export const ButtonCoordinates = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
}

export function DoughnutChartPlugin({ projectData, crData, chartData, isAddWorklogsPermission = false }) {
  const plugin = {
    id: 'innerText',
    beforeDraw(chart) {
      const {
        ctx,
        chartArea: { height, width },
      } = chart
      const { outerRadius, innerRadius } = chart?.getDatasetMeta(0)?.controller || { outerRadius: 0, innerRadius: 0 }
      ctx.save()
      const yCenter = height / 2
      const xCenter = width / 2
      const angle = Math.PI / 180
      const formatter = Intl?.NumberFormat('en', { notation: 'compact' })

      ctx.beginPath()
      ctx.fillStyle = '#fff'
      ctx.shadowBlur = 40
      ctx.shadowColor = 'rgba(0,0,0,0.15)'
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 5
      ctx.arc(xCenter, yCenter, outerRadius - (outerRadius - innerRadius) + 5, 0, angle * 360, false)
      ctx.fill()
      ctx.fillStyle = '#000'
      // const responsive = window.matchMedia('(max-width: 1165px)')?.matches && window.matchMedia('(min-width: 992px)')?.matches
      // ctx.font = String(projectData?.pUsedCost).length
      //   ? `800 ${(responsive ? 18 : 20) - String(projectData?.pUsedCost).length + 'px'} inter`
      //   : '800 14px inter'
      //   ctx.font = '700 16px inter'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowColor = 'rgba(0,0,0,0)'
      ctx.strokeWidth = 0
      ctx.strokeStyle = 'rgba(0,0,0,0)'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0

      if(isAddWorklogsPermission) {
      ctx.beginPath()
      ctx.fillStyle = '#fff'
      ctx.shadowBlur = 0
      ctx.shadowColor = 'rgba(0,0,0,0.15)'
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      ctx.arc(xCenter, yCenter + 45, 15, 0, angle * 360, false)
      ctx.lineWidth = 3
      ctx.strokeStyle = '#003300'
      ctx.stroke()
      ctx.fill()
      ctx.fillStyle = '#000'
      }

      ctx.font = '700 16px inter'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowColor = 'rgba(0,0,0,0)'
      ctx.strokeWidth = 0
      ctx.strokeStyle = 'rgba(0,0,0,0)'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      //

      ctx.letterSpacing = '2px'

      ctx.fillText(
        `${
          formatter?.format(projectData?.pTotalCost + crData?.cTotalCost || 0) === '0'
            ? '∞'
            : formatter?.format(projectData?.pTotalCost + crData?.cTotalCost || 0)
        }/${formatter?.format(projectData?.pUsedCost + crData?.cUsedCost || 0) || 0} ${chartData?.sSymbol || '$'}`,
        width / 2,
        yCenter - 25
      )
      ctx.fillText(
        `${
          formatter?.format(projectData?.pTotalHours + crData?.cTotalHours || 0) === '0'
            ? '∞'
            : formatter?.format(projectData?.pTotalHours + crData?.cTotalHours || 0)
        }/${formatter?.format(projectData?.pUsedHours + crData?.cUsedHours || 0) || 0} Hrs`,
        width / 2,
        yCenter + 5
      )
      ctx.letterSpacing = '0px'

      let text = '+'
      ctx.font = '500 22px inter'
      ctx.fillStyle = '#000'
      ctx.textAlign = 'center'
      isAddWorklogsPermission && ctx.fillText(text, width / 2, yCenter + 45)

      ButtonCoordinates.top = yCenter + 30
      ButtonCoordinates.bottom = yCenter + 60
      ButtonCoordinates.left = width / 2 - 15
      ButtonCoordinates.right = width / 2 + 15

      ctx.closePath()
    },
  }
  return plugin
}
