import React from 'react'
import QuantityControl from './QuantityControl'
import Button from '../ui/Button'

// Displays a single toy in the cart with quantity controls
export default function CartItem({ item, toy, onQuantityChange, onRemove }) {
  const itemPrice = (toy?.price || 0) * item.quantity

  return (
    <div className="cart-item">
      <div className="cart-left">
        <img src={toy?.cover || toy?.image} alt={toy?.title || toy?.name} className="cart-book-cover" />
        <div className="cart-book-info">
          <h4>{toy?.title || toy?.name}</h4>
          <p className="cart-author">{toy?.author || toy?.ageGroup}</p>
          <p className="cart-genre">{toy?.genre || (typeof toy?.category === 'object' ? toy?.category?.name : toy?.category)}</p>
          <div className="cart-status-row">
            <span className={`availability-badge ${toy?.availability?.toLowerCase() || 'available'}`}>
              {toy?.availability || 'Available'}
            </span>
            <span className="cart-copies">
              {toy?.copies} {toy?.copies === 1 ? 'copy' : 'copies'} available
            </span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-primary)' }}>
            Rs. {toy?.price?.toFixed(2)} × {item.quantity} = Rs. {itemPrice.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="cart-right">
        <QuantityControl
          quantity={item.quantity}
          maxQuantity={toy?.copies || 0}
          onIncrease={() => onQuantityChange(item.toyId, 1)}
          onDecrease={() => onQuantityChange(item.toyId, -1)}
        />
        <Button variant="remove" onClick={() => onRemove(item.toyId)}>
          Remove
        </Button>
      </div>
    </div>
  )
}
