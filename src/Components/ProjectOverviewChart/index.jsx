import DoughnutChart from 'Components/Chart/DoughnutChart'
import Wrapper from 'Components/wrapper'
import React from 'react'
import PropTypes from 'prop-types'
import Divider from 'Components/Divider'
import { Col, Row } from 'react-bootstrap'
import './_projectoverview.scss'
import { formatDate, projectStatusColor, projectStatusColorCode, isGranted, permissionsName } from 'helpers'
import ErrorBoundary from 'Components/ErrorBoundary'

export default function ProjectOverviewChart({ data, gotoProjectDetails, addWorkLogModalOpen }) {
  const isViewProjectPermission = isGranted(permissionsName.VIEW_PROJECT)
  const isAddWorklogsPermission = isGranted(permissionsName.CREATE_WORKLOGS)

  return (
    <div>
      <Wrapper className="m-0 mx-1 my-3">
        <Row>
          <Col xs={12}>
            <div
              className={'project-status-overview ' + projectStatusColor(data?.eProjectStatus)}
              style={{ background: projectStatusColorCode(data?.eProjectStatus) }}
            >
              {data?.eProjectStatus}
            </div>
            <div>
              <h4 className="font-weight-bold pt-2 text-left">{data?.sName}</h4>
            </div>
            {isViewProjectPermission ? <span className="go-to-details" onClick={() => gotoProjectDetails(data._id)}>
              More details
            </span> : (<></>)}
            <Divider height="2px" backgroundColor="#00000020" className="pt-1 p-0" />
            <span className="light-blue50">{data?.eProjectType}</span>

            {data?.dStartDate && data?.dEndDate ? (
              <span style={{ fontSize: '12px', fontWeight: '500', lineHeight: '22px' }}>
                {formatDate(data?.dStartDate)} TO {formatDate(data?.dEndDate)}
              </span>
            ) : (
              <span style={{ fontSize: '12px', fontWeight: '500', lineHeight: '22px' }}>-</span>
            )}
          </Col>
        </Row>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <ErrorBoundary>
            <div className="project-overview-chart position-relative">
              <DoughnutChart addWorkLogModalOpen={addWorkLogModalOpen} chartData={data} isAddWorklogsPermission={isAddWorklogsPermission} />
              {data.eProjectStatus === 'Pending' && (
                <div className="position-absolute h-100 w-100 project-overview-placeholder">
                  <span> project hasn&apos;t been started yet</span>
                </div>
              )}
              <div className="position-absolute project-overview-details">
                <div className="button-tag">
                  <span className="px-2" style={{ fontSize: '14px' }}>
                    Technologies:{' '}
                  </span>
                  {!data?.projectTechnologies.length ? 'no data' : null}
                  {data?.projectTechnologies?.map((tech, index) => (
                    <span className="light-blue50 m-1" key={index}>
                      {tech?.sName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </ErrorBoundary>
        </div>
      </Wrapper>
    </div>
  )
}

ProjectOverviewChart.propTypes = {
  data: PropTypes.object,
  addWorkLogModalOpen: PropTypes.func,
  gotoProjectDetails: PropTypes.func,
}
