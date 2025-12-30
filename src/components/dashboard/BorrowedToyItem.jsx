import React from 'react'
import { format, differenceInCalendarDays } from 'date-fns'

export default function BorrowedToyItem({ toy, item, onExtend }) {
  const daysLeft = differenceInCalendarDays(new Date(item.dueDate), new Date())
  const isOverdue = daysLeft < 0

  return (
    <div className="borrowed-item-card">
      <div className="item-details">
        <h4>{toy?.title}</h4>
        <p className="due-date">Due: <strong>{format(new Date(item.dueDate), 'MMM dd')}</strong></p>
        <p className={`status-text ${isOverdue ? 'overdue' : 'active'}`}>
          {isOverdue ? `Overdue by ${Math.abs(daysLeft)} days` : `${daysLeft} days left`}
        </p>
      </div>
      <div className="item-actions">
        {!item.extended && !isOverdue && (
          <button className="btn-small btn-secondary" onClick={onExtend}>Extend (+7 days)</button>
        )}
      </div>
    </div>
  )
}
