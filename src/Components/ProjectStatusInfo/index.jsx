import React from 'react'
import Wrapper from 'Components/wrapper'
import { projectStatusColorCode } from 'helpers'

function ProjectStatusInfo() {
  return (
    <Wrapper className="p-2">
      <div className="d-flex">
        <div className="d-flex align-items-center my-2 me-3">
          <div className="status-dot mx-2" style={{ backgroundColor: projectStatusColorCode('Pending') }}></div>Pending
        </div>
        <div className="d-flex align-items-center my-2 me-3">
          <div className="status-dot mx-2" style={{ backgroundColor: projectStatusColorCode('In Progress') }}></div>In Progress
        </div>
        <div className="d-flex align-items-center my-2 me-3">
          <div className="status-dot mx-2" style={{ backgroundColor: projectStatusColorCode('On Hold') }}></div>On Hold
        </div>
        <div className="d-flex align-items-center my-2 me-3">
          <div className="status-dot mx-2" style={{ backgroundColor: projectStatusColorCode('Completed') }}></div>Completed
        </div>
      </div>
    </Wrapper>
  )
}

export default ProjectStatusInfo
