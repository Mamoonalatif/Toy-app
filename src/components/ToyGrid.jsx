import React from 'react'
import ToyCard from './ToyCard'

// Importing images from src/assets
import a1 from '../assets/a1.png';
import a2 from '../assets/a2.png';
import a3 from '../assets/a3.png';
import a4 from '../assets/a4.png';

const hardcodedToys = [
  { id: 1, image: a1, title: 'Toy Car', ageGroup: '3+', category: 'Vehicles' },
  { id: 2, image: a2, title: 'Doll House', ageGroup: '5+', category: 'Playsets' },
  { id: 3, image: a3, title: 'Puzzle', ageGroup: '6+', category: 'Educational' },
  { id: 4, image: a4, title: 'Action Figure', ageGroup: '4+', category: 'Figures' },
  { id: 5, image: a1, title: 'Toy Truck', ageGroup: '3+', category: 'Vehicles' },
  { id: 6, image: a2, title: 'Barbie Set', ageGroup: '5+', category: 'Playsets' },
  { id: 7, image: a3, title: 'Board Game', ageGroup: '7+', category: 'Games' },
  { id: 8, image: a4, title: 'Building Blocks', ageGroup: '3+', category: 'Educational' },
]

export default function ToyGrid() {
  return (
    <div className="book-grid toy-grid">
      {hardcodedToys.map((toy) => (
        <ToyCard key={toy.id} toy={toy} />
      ))}
    </div>
  )
}
