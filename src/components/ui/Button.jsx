import React from 'react'

// PURPOSE: Reusable button with variant styles (primary, secondary, remove, etc.)
export default function Button({ children, variant = 'primary', onClick, disabled = false, type = 'button', className = '' }) {
  const classes = `btn btn-${variant} ${className}`.trim()
  
  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
