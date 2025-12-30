import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import Button from '../ui/Button'

export default function AddReviewForm({ productId, onReviewAdded }) {
    const { user, addReview } = useStore()
    const navigate = useNavigate()
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    const [hoveredRating, setHoveredRating] = useState(0)
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!comment.trim()) {
            setError('Please write a comment')
            return
        }

        setSubmitting(true)
        const { success, message } = await addReview(productId, rating, comment)
        setSubmitting(false)

        if (success) {
            setComment('')
            setRating(5)
            if (onReviewAdded) onReviewAdded()
        } else {
            setError(message || 'Failed to submit review')
        }
    }

    const handleLoginRedirect = () => {
        navigate(`/login?redirect=/toys/${productId}`)
    }

    if (!user) {
        return (
            <div className="add-review-form" style={{
                background: 'var(--color-surface)',
                padding: '24px',
                borderRadius: '12px',
                marginBottom: '24px',
                textAlign: 'center'
            }}>
                <h3 style={{ marginBottom: '12px' }}>Share Your Experience</h3>
                <p style={{ color: 'var(--color-muted)', marginBottom: '16px' }}>
                    Please sign in to leave a review
                </p>
                <Button variant="primary" onClick={handleLoginRedirect}>
                    Sign In to Review
                </Button>
            </div>
        )
    }

    return (
        <div className="add-review-form" style={{
            background: 'var(--color-surface)',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '24px'
        }}>
            <h3 style={{ marginBottom: '16px' }}>Write a Review</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                        Your Rating
                    </label>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '2rem' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                style={{
                                    cursor: 'pointer',
                                    color: star <= (hoveredRating || rating) ? '#FFC107' : '#ddd',
                                    transition: 'color 0.2s'
                                }}
                            >
                                ★
                            </span>
                        ))}
                        <span style={{ fontSize: '1rem', marginLeft: '12px', alignSelf: 'center', color: 'var(--color-muted)' }}>
                            {rating} {rating === 1 ? 'star' : 'stars'}
                        </span>
                    </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                        Your Review
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about this toy..."
                        rows="4"
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            fontSize: '1rem',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                        }}
                        required
                    />
                </div>

                {error && <p className="error-text" style={{ marginBottom: '12px' }}>{error}</p>}

                <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
            </form>
        </div>
    )
}
