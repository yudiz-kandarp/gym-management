export function calculateDepartmentHours(data) {
  let departments = []
  let backgroundColor = []
  let DepartmentUsedHours = 0
  data.projectDepartment.forEach((d) => {
    departments.push(
      {
        _id: d._id,
        sName: d.sName,
        dTotalHours: convertMinutesToHour(+d.nMinutes),
        dUsedHours: convertMinutesToHour(+d.nRemainingMinute),
        dRemainingHours: convertMinutesToHour(+d.nMinutes) - convertMinutesToHour(+d.nRemainingMinute),
        dTotalCost: +d.nCost,
        dUsedCost: +d.nRemainingCost,
      },
      {
        _id: d._id,
        sName: d.sName,
        dTotalHours: convertMinutesToHour(+d.nMinutes),
        dUsedHours: convertMinutesToHour(+d.nMinutes) - convertMinutesToHour(+d.nRemainingMinute),
        dTotalCost: +d.nCost,
        dUsedCost: +d.nRemainingCost,
        isUnfilled: true,
      }
    )
    backgroundColor.push('#2780BA', '#a2a2a2')
    DepartmentUsedHours += convertMinutesToHour(+d.nRemainingMinute)
  })
  return { departments, DepartmentUsedHours }
}

export function calculateProjectHours(data) {
  let { sCost: pTotalCost, nRemainingCost: pUsedCost } = data.projectIndicator
  pTotalCost = +pTotalCost
  pUsedCost = +pUsedCost
  let pTotalHours = convertMinutesToHour(+data.projectIndicator.nMinutes)
  let pUsedHours = convertMinutesToHour(+data.projectIndicator.nRemainingMinute)

  return { pTotalCost, pUsedCost, pTotalHours, pUsedHours }
}

function convertMinutesToHour(m, precision = 2) {
  function precisionRound(number, precision) {
    var factor = Math.pow(10, precision)
    var n = precision < 0 ? number : 0.01 / factor + number
    return Math.round(n * factor) / factor
  }
  return precisionRound(m / 60, precision)
}

let res = {
  _id: '63c4ee5413edef88d9a51165',
  sName: 'game DevTool',
  eProjectType: 'Fixed',
  eProjectStatus: 'On Hold',
  sCost: '10500',
  nTimeLineDays: 29,
  projectIndicator: {
    _id: '63c4f43913edef88d9a511ca',
    iProjectId: '63c4ee5413edef88d9a51165',
    eStatus: 'Y',
    sCost: '10500',
    nTimeLineDays: 29,
    nMinutes: 13920,
    nRemainingMinute: 1176,
    nRemainingCost: 196,
    nNonBillableMinute: 6,
    nNonBillableCost: 1,
    dCreatedAt: '2023-01-16T06:52:41.883Z',
    dUpdatedAt: '2023-02-03T08:50:01.059Z',
    __v: 0,
    eProjectType: 'Fixed',
  },
  projectDepartment: [
    {
      iProjectId: '63c4ee5413edef88d9a51165',
      _id: '638485bece2523e0ebd8c46c',
      sName: 'Bde',
      nMinutes: 600,
      nCost: 2000,
      nRemainingMinute: 24,
      nRemainingCost: 4,
      nNonBillableMinute: 6,
      nNonBillableCost: 1,
    },
  ],
  projectWiseTag: [
    {
      iProjectId: '63c4ee5413edef88d9a51165',
      _id: '63918ef018c9b8fcf29e1ca4',
      sName: 'Automation',
      sKey: 'AUTOMATION',
      sTextColor: 'hsl(236deg, 65%, 50%)',
    },
  ],
  changeRequest: 1,
}
console.log(calculateProjectHours(res))
console.log(calculateDepartmentHours(res))
