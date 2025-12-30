import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function ToyCard({ toy, onAdd }) {
  const { isInCart, wishlist, toggleWishlist } = useStore()
  const navigate = useNavigate()
  const inCart = isInCart(toy.id)
  const inWishlist = wishlist.includes(toy._id || toy.id)

  const handleAction = () => {
    if (inCart) return navigate('/cart')
    const res = onAdd?.(toy._id || toy.id)
    if (res?.success === false && res?.message) alert(res.message)
    else if (res?.alreadyInCart) navigate('/cart')
  }

  const handleWishlistToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    await toggleWishlist(toy._id || toy.id)
  }

  return (
    <article className="book-card toy-card" aria-labelledby={`title-${toy._id || toy.id}`}>
      <div className="card-top">
        <div className="cover">
          <img src={toy.image} alt={`${toy.title || toy.name} cover`} loading="lazy" />
        </div>
      </div>
      <div className="card-body">
        <h3 id={`title-${toy._id || toy.id}`}>{toy.title || toy.name}</h3>
        <div className="meta-row">
          <span className="author">{toy.author || toy.ageGroup}</span>
          <span className="genre">{toy.genre || (typeof toy.category === 'object' ? toy.category?.name : toy.category) || 'Category'}</span>
        </div>
        <div className="meta-row single-line-info">
          <button
            className="rating-star-wishlist"
            onClick={handleWishlistToggle}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {inWishlist ? '⭐' : '☆'} {toy.rating}
          </button>
          <span className={`availability-badge ${toy.availability?.toLowerCase() || 'available'}`}>
            {toy.availability || 'Available'}
          </span>
          <span className="copies-info">{toy.copies} {toy.copies === 1 ? 'copy' : 'copies'}</span>
        </div>
        <div className="card-actions">
          <Link to={`/toys/${toy._id || toy.id}`} className="btn-secondary">Details</Link>
          <button onClick={handleAction} className={inCart ? 'btn-in-cart' : 'btn-primary'} disabled={!inCart && toy.copies <= 0}>
            {inCart ? 'In Cart ✓' : (toy.copies <= 0 ? 'Unavailable' : 'Add to Cart')}
          </button>
        </div>
      </div>
    </article>
  )
}
