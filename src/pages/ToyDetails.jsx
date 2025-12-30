import React, { useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import ReviewsList from '../components/toyDetails/ReviewsList'
import AddReviewForm from '../components/toyDetails/AddReviewForm'
import Button from '../components/ui/Button'

export default function ToyDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toys, addToCart, toggleWishlist, wishlist, isInCart, reservations, fetchReviews } = useStore()
  const toy = toys.find((t) => t._id === id || t.id === id)
  const [reviews, setReviews] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(true)

  // Fetch reviews when component mounts or toy changes
  useEffect(() => {
    const loadReviews = async () => {
      if (toy) {
        setLoadingReviews(true)
        const { success, reviews: fetchedReviews } = await fetchReviews(toy._id || toy.id)
        if (success) {
          setReviews(fetchedReviews)
        }
        setLoadingReviews(false)
      }
    }
    loadReviews()
  }, [toy, fetchReviews])

  // Get borrowed copies for this toy
  const borrowedCopies = useMemo(() => {
    if (!toy) return []
    return reservations
      .filter(r => r.status === 'picked-up')
      .flatMap(r => r.items)
      .filter(item => item.toyId === toy.id && item.status === 'borrowed')
  }, [toy, reservations])

  if (!toy) return <div className="page"><h2>Toy not found</h2></div>

  const toyId = toy._id || toy.id
  const inWishlist = wishlist.includes(toyId)
  const inCart = isInCart(toyId)
  const stockCount = typeof toy.countInStock === 'number' ? toy.countInStock : 0
  const isUnavailable = stockCount <= 0

  const handleReserve = () => {
    const res = addToCart(toyId)
    if (res?.success === false && res.message) {
      alert(res.message)
    } else if (res?.alreadyInCart) {
      navigate('/cart')
    }
  }

  const handleReviewAdded = async () => {
    // Refresh reviews after a new review is added
    const { success, reviews: fetchedReviews } = await fetchReviews(toyId)
    if (success) {
      setReviews(fetchedReviews)
    }
  }

  return (
    <div className="page book-details">
      <div className="details-inner">
        <div className="cover-large" style={{
          height: '500px',
          flex: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fcfcfc',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #eee'
        }}>
          <img
            src={toy.cover || toy.image || '/placeholder-book.png'}
            alt={toy.title || toy.name}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
        <div className="info" style={{ flex: '1' }}>
          {/* Category & Age Group */}
          <div style={{ marginBottom: '10px', color: '#666', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {(typeof toy.category === 'object' ? toy.category?.name : toy.category) || 'Uncategorized'}  •  {toy.ageGroup || 'All Ages'}
          </div>

          {/* Toy Name */}
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: '#2c3e50' }}>{toy.title || toy.name}</h2>


          {/* Stock Status */}
          <div style={{ marginBottom: '24px' }}>
            {stockCount > 0 ? (
              <span style={{
                display: 'inline-block',
                padding: '6px 12px',
                borderRadius: '20px',
                background: '#e8f5e9',
                color: '#2e7d32',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                In Stock ({stockCount} available)
              </span>
            ) : (
              <span style={{
                display: 'inline-block',
                padding: '6px 12px',
                borderRadius: '20px',
                background: '#ffebee',
                color: '#c62828',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                Out of Stock
              </span>
            )}
          </div>

          {/* Description */}
          <p className="description" style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#444', marginBottom: '32px' }}>
            {toy.description}
          </p>

          <div className="detail-actions">
            {inCart ? (
              <Button onClick={() => navigate('/cart')} variant="in-cart">
                In Cart ✓
              </Button>
            ) : (
              <Button
                onClick={handleReserve}
                variant="primary"
                disabled={stockCount <= 0}
                style={{ opacity: stockCount <= 0 ? 0.6 : 1, cursor: stockCount <= 0 ? 'not-allowed' : 'pointer' }}
              >
                {stockCount <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            )}
            <Button onClick={() => toggleWishlist(toyId)} variant="secondary">
              {inWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ marginTop: '48px', maxWidth: '800px' }}>
        <AddReviewForm productId={toyId} onReviewAdded={handleReviewAdded} />
        {loadingReviews ? (
          <p style={{ textAlign: 'center', color: 'var(--color-muted)' }}>Loading reviews...</p>
        ) : (
          <ReviewsList reviews={reviews} />
        )}
      </div>
    </div>
  )
}
