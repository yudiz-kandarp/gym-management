import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Modal, Form } from 'react-bootstrap'
import { useMutation } from 'react-query'
import { addProjectEmployeeReview, editProjectEmployeeReview } from 'Query/Project/project.mutation'
import { removeSpaces, toaster } from 'helpers'
import { useParams } from 'react-router-dom'
import Button from 'Components/Button'
import { queryClient } from 'App'

const ReviewModal = ({ show, handleClose }) => {
  const { id } = useParams()
  const { employee } = show
  const [reviewDetail, setReviewDetail] = useState('')
  useEffect(() => {
    setReviewDetail(employee?.sReview)
    return () => setReviewDetail('')
  }, [employee])

  const { mutate: addReview, isLoading: addReviewLoading } = useMutation(addProjectEmployeeReview, {
    onSuccess: () => {
      handleClose()
      queryClient.invalidateQueries('project-detail')
      toaster('review added successfully')
    },
  })

  const { mutate: editReview, isLoading: editReviewLoading } = useMutation(editProjectEmployeeReview, {
    onSuccess: () => {
      handleClose()
      queryClient.invalidateQueries('project-detail')
      toaster('review edited successfully')
    },
  })

  function handleAddReview() {
    if (employee?.sReview) {
      editReview({
        id: employee._id,
        data: {
          iProjectId: id,
          sReview: reviewDetail,
        },
      })
    } else {
      addReview({
        id: employee._id,
        data: {
          iProjectId: id,
          sReview: reviewDetail,
        },
      })
    }
  }

  return (
    <Modal show={show.open} onHide={handleClose} centered className="ReviewModal common-modal">
      <Modal.Header closeButton>
        <Modal.Title>Add Review</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h2>Write review for {employee?.sEmployeeName} </h2>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="mb-1">Write Review</Form.Label>
            <Form.Control
              style={{ padding: '10px', color: '#000' }}
              as="textarea"
              rows={5}
              placeholder="Add Review"
              value={reviewDetail}
              onChange={({ target }) => setReviewDetail(target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={!removeSpaces(reviewDetail)?.length} loading={addReviewLoading || editReviewLoading} onClick={handleAddReview}>
          submit
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
ReviewModal.propTypes = {
  show: PropTypes.string,
  handleClose: PropTypes.func,
}
export default ReviewModal
