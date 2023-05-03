import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { ReactComponent as FilledStar } from 'Assets/Icons/filled-star.svg'
import { ReactComponent as Star } from 'Assets/Icons/star.svg'
import './_rating.scss'

export default function Rating({ setFunction, sTitle, sId, ratingCount }) {
  const [rating, setRating] = useState(parseInt(ratingCount) || 0)
  // const [hover, setHover] = useState(0)
  return (
    <>
      <div className="outer d-flex justify-content-between">
        <div className="star-rating">
          {[...Array(10)].map((star, eScore) => {
            eScore += 1
            return (
              <div
                key={eScore}
                onClick={() => {
                  setRating(eScore)
                  setFunction({ eScore, sName: sTitle, iSkillId: sId })
                }}
                // onMouseEnter={() => setHover(eScore)}
                // onMouseLeave={() => setHover(rating)}
              >
                {eScore <= (rating || ratingCount) ? (
                  <div className="filled-star">
                    <FilledStar />
                  </div>
                ) : (
                  <div className="star">
                    <Star />
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <span>{rating || ratingCount || 0} /10 </span>
      </div>
    </>
  )
}

Rating.propTypes = {
  setFunction: PropTypes.func,
  setRating: PropTypes.func,
  rating: PropTypes.any,
  ratingCount: PropTypes.number || PropTypes.string,
  sTitle: PropTypes.string,
  sId: PropTypes.string,
}
