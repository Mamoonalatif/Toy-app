import React from 'react'

// +/- buttons to adjust book quantity in cart
export default function QuantityControl({ quantity, maxQuantity, onIncrease, onDecrease }) {
  return (
    <div className="quantity-controls">
      <button className="qty-btn" onClick={onDecrease} disabled={quantity <= 1}>
        −
      </button>
      <span className="quantity-display">{quantity}</span>
      <button className="qty-btn" onClick={onIncrease} disabled={quantity >= maxQuantity}>
        +
      </button>
    </div>
  )
}
