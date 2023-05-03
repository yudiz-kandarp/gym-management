import React from 'react'
import PropTypes from 'prop-types'
import { Col, Card } from 'react-bootstrap'
import './_style.scss'

const DashboardCard = ({ name, number, color }) => {
  return (
    <Col xxl={3} lg={4} md={6}>
      <div className="custom-card mb-4">
        <Card>
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text as="h3" style={{ color }}>
              {number}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </Col>
  )
}

DashboardCard.propTypes = {
  name: PropTypes.string,
  color: PropTypes.string,
  number: PropTypes.number,
}
export default DashboardCard
