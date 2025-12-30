import React from 'react'
import { format } from 'date-fns'

export default function PendingToyItem({ toy, item, pickupDate }) {
  return (
    <div className="pending-item-card">
      <div className="item-info">
        <h4>{toy?.title}</h4>
        <p>Pickup: <strong>{format(new Date(pickupDate), 'MMM dd')}</strong></p>
        <p>Duration: {item.duration} days</p>
      </div>
    </div>
  )
}
