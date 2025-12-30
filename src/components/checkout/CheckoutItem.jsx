import React from 'react'
import Button from '../ui/Button'

export default function CheckoutItem({ cartItem, toy, onRemove }) {
  return (
    <div className="checkout-item" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 0', borderBottom: '1px solid #eee' }}>
      <img
        src={toy?.image || toy?.cover || 'https://via.placeholder.com/80'}
        alt={toy?.title || toy?.name}
        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
      />
      <div className="checkout-item-details" style={{ flex: 1 }}>
        <p className="item-title" style={{ margin: '0 0 5px 0', fontWeight: '600' }}>{toy?.title || toy?.name}</p>
        <p className="item-meta" style={{ margin: 0, color: '#666' }}>Quantity: {cartItem.quantity || 1}</p>
        <p className="item-price" style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: '#2e7d32' }}>
          Rs. {toy?.price ? toy.price.toFixed(2) : '0.00'}
        </p>
      </div>

      <Button variant="text" className="btn-remove" onClick={() => onRemove(cartItem.toyId)} style={{ color: '#d32f2f' }}>
        Remove
      </Button>
    </div>
  )
}
