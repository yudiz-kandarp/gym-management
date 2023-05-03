import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap'
import './_projectCard.scss'

export default function CardModel({ cardData }) {
  return (
    <>
      <Card className="card_container p-2">
        <Card.Body className="d-flex flex-column justify-content-between">
          <Card.Title className="card_header d-flex justify-content-between">
            <div className="card_image">
              <img src={'https://jr-web-developer.s3.ap-south-1.amazonaws.com/' + cardData?.sLogo} />
            </div>
            <h6 className="card_label">{cardData?.eProjectStatus}</h6>
          </Card.Title>
          <div className="card_footer">
            <Card.Title className="card_title">{cardData?.sName}</Card.Title>
            <Card.Subtitle className="card_subtitle">Lifting Equipment rental management application</Card.Subtitle>
          </div>
        </Card.Body>
      </Card>
    </>
  )
}

CardModel.propTypes = {
  cardData: PropTypes.string,
}
