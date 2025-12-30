import React from 'react'
import { format } from 'date-fns'

// Displays user reviews with ratings and timestamps
function ReviewsList({ reviews }) {
  const renderStars = (rating) => {
    return (
      <span style={{ color: '#FFC107', fontSize: '1.1rem' }}>
        {[...Array(5)].map((_, i) => (
          <span key={i}>{i < rating ? '★' : '☆'}</span>
        ))}
      </span>
    )
  }

  return (
    <section className="reviews" style={{ marginTop: '32px' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '1.5rem' }}>Customer Reviews</h3>
      {reviews && reviews.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map((review) => (
            <div
              key={review._id}
              className="review"
              style={{
                background: 'var(--color-surface)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div>
                  <strong style={{ fontSize: '1.05rem' }}>{review.user?.name || 'Anonymous'}</strong>
                  <div style={{ marginTop: '4px' }}>{renderStars(review.rating)}</div>
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                  {review.createdAt ? format(new Date(review.createdAt), 'MMM d, yyyy') : ''}
                </span>
              </div>
              <p style={{ margin: 0, lineHeight: '1.6', color: 'var(--color-text)' }}>
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>
          No reviews yet. Be the first to review this product!
        </p>
      )}
    </section>
  )
}

export default React.memo(ReviewsList)
