import React from 'react'
import Button from '../ui/Button'

export default function WishlistCard({ toy, onViewDetails }) {
  return (
    <div className="wishlist-card">
      <div className="card-top">
        <img src={toy.cover} alt={toy.title} />
      </div>
      <div className="card-body">
        <h4>{toy.title}</h4>
        <Button variant="secondary" onClick={onViewDetails}>View Details</Button>
      </div>
    </div>
  )
}
