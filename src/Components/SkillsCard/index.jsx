import React from 'react'
import PropTypes from 'prop-types'
import { Col, Card } from 'react-bootstrap'
import './_skills-card.scss'
import { handleAlterImage, imageAppendUrl } from 'helpers'
import iconLogo from 'Assets/Icons/logo.svg'
import AlterImage from 'Components/AlterImage'

const SkillsCard = ({ icon, btnTxt, btnClass, name, description }) => {
  return (
    <Col lg={4} md={6}>
      <div className="skills-card">
        <Card>
          <Card.Body className="skills-card-head">
            <div className="skills-img">
              {icon ? (
                <img src={imageAppendUrl(icon)} alt="iconLogo" onError={(e) => handleAlterImage(e, iconLogo)} className="img-fluid" />
              ) : (
                <AlterImage text={name} />
              )}
            </div>
            <span className={btnClass}>{btnTxt} </span>
          </Card.Body>
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text>{description} </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </Col>
  )
}

SkillsCard.propTypes = {
  icon: PropTypes.string,
  btnTxt: PropTypes.string,
  btnClass: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
}
export default SkillsCard
