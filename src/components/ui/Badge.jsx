import React from 'react'

// PURPOSE: Small label/tag for displaying status or category
export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`badge badge-${variant} ${className}`.trim()}>
      {children}
    </span>
  )
}
