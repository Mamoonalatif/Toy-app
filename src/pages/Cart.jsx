import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import CartItem from '../components/cart/CartItem'
import EmptyState from '../components/dashboard/EmptyState'
import Button from '../components/ui/Button'

export default function Cart() {
  const { cart, toys, removeFromCart, updateCartQuantity } = useStore()
  const navigate = useNavigate()

  const items = useMemo(() =>
    cart.map(c => ({ ...c, toy: toys.find(t => (t._id || t.id) === c.toyId) })),
    [cart, toys]
  )

  const totalToys = useMemo(() =>
    items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  )

  const subtotal = useMemo(() =>
    items.reduce((sum, item) => sum + (item.toy?.price || 0) * item.quantity, 0),
    [items]
  )

  const shippingPrice = subtotal > 5000 ? 0 : 200
  const totalPrice = subtotal + shippingPrice

  const handleQuantityChange = (toyId, change) => {
    const item = cart.find(c => c.toyId === toyId)
    if (!item) return

    const newQuantity = item.quantity + change
    updateCartQuantity(toyId, newQuantity)
  }

  return (
    <div className="page cart-page">
      <div className="cart-header">
        <h2>Your Cart</h2>
        {items.length > 0 && (
          <div className='book-count-indicator'>
            {totalToys} {totalToys === 1 ? 'toy' : 'toys'}
          </div>
        )}
      </div>
      {items.length === 0 ? (
        <EmptyState
          icon={<span style={{ color: 'white' }}>🛒</span>}
          title="Your cart is empty"
          description="Start exploring our collection and add toys to your cart!"
          action={<Button variant="primary" onClick={() => navigate('/')}>Browse Toys</Button>}
        />
      ) : (
        <div className="cart-list">
          {items.map(it => (
            <CartItem
              key={it.toyId}
              item={it}
              toy={it.toy}
              onQuantityChange={handleQuantityChange}
              onRemove={removeFromCart}
            />
          ))}

          {/* Cart Summary */}
          <div className="cart-summary" style={{
            background: 'var(--color-surface)',
            padding: '24px',
            borderRadius: '12px',
            marginTop: '24px'
          }}>
            <h3 style={{ marginBottom: '16px' }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Toys:</span>
                <strong>{totalToys}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Items:</span>
                <strong>{items.length} {items.length === 1 ? 'title' : 'titles'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                <span>Subtotal:</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping:</span>
                <span>{shippingPrice === 0 ? 'FREE' : `Rs. ${shippingPrice.toFixed(2)}`}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                paddingTop: '12px',
                borderTop: '2px solid var(--border)',
                marginTop: '8px'
              }}>
                <span>Total:</span>
                <span style={{ color: 'var(--color-primary)' }}>Rs. {totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="cart-actions">
            <Button variant="secondary" onClick={() => navigate('/')}>Continue Browsing</Button>
            <Button variant="primary" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
