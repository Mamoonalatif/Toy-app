import React from 'react'
import { Link } from 'react-router-dom'

const sizes = {
  small: { icon: 32, text: '1.1rem' },
  medium: { icon: 40, text: '1.4rem' },
  large: { icon: 56, text: '2rem' }
}

export default function Logo({ size = 'medium' }) {
  const s = sizes[size]

  return (
    <Link to="/" className="logo-link" aria-label="ToyShop Home">
      <div className="logo-container">
        <svg width={s.icon} height={s.icon} viewBox="0 0 100 100" fill="none" className="logo-icon">
          {/* Simple building blocks icon */}
          <rect x="25" y="45" width="25" height="25" rx="2" fill="var(--color-primary)" stroke="var(--color-text)" strokeWidth="2" />
          <rect x="50" y="45" width="25" height="25" rx="2" fill="var(--color-accent)" stroke="var(--color-text)" strokeWidth="2" />
          <rect x="37" y="20" width="25" height="25" rx="2" fill="var(--color-secondary)" stroke="var(--color-text)" strokeWidth="2" />
          <circle cx="80" cy="30" r="5" fill="var(--color-accent)" />
          <circle cx="15" cy="70" r="8" fill="var(--color-secondary)" opacity="0.5" />
        </svg>
        <div className="logo-text-container">
          <span className="logo-text" style={{ fontSize: s.text }}>
            Toy<span className="logo-accent">Shop</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
