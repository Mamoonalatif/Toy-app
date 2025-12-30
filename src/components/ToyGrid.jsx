import React from 'react'
import ToyCard from './ToyCard'
import { useStore } from '../context/StoreContext'

export default function ToyGrid({ toys: propToys }) {
  const { toys: storeToys, addToCart } = useStore()
  const displayToys = propToys || storeToys

  if (!displayToys || displayToys.length === 0) {
    return <div className="empty-state">No toys available at the moment.</div>
  }

  return (
    <div className="book-grid toy-grid">
      {displayToys.map((toy) => (
        <ToyCard key={toy.id} toy={toy} onAdd={addToCart} />
      ))}
    </div>
  )
}
