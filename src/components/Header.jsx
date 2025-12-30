import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import Logo from './Logo'

export default function Header() {
  const { cart, wishlist, user, logout } = useStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Hide header for admin users as they have their own dashboard layout
  if (user?.role === 'admin') return null


  return (
    <header className="app-header" role="banner">
      <div className="header-inner">
        <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--color-text)', textDecoration: 'none' }}>JoyBox</Link>
        <nav aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/track-order">Track Order</Link>
          <Link to="/cart" aria-label={`Cart with ${cart.length} items`}>
            <span className="cart-icon">🛒</span> Cart ({cart.length})
          </Link>
          <Link to="/wishlist" aria-label={`Wishlist with ${wishlist.length} items`}>
            <span className="wishlist-icon">⭐</span> Wishlist ({wishlist.length})
          </Link>
        </nav>
        <div className="header-actions">

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                {user.role === 'admin' ? '🛡️ Admin' : `👤 ${user.name}`}
              </span>
              {user.role !== 'admin' && (
                <Link to="/my-orders" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem', textDecoration: 'none' }}>
                  My Orders
                </Link>
              )}
              <button onClick={handleLogout} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', color: 'white', textDecoration: 'none' }}>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
