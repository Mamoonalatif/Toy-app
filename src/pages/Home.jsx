import React, { useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ToyGrid from '../components/ToyGrid'
import HeroSection from '../components/HeroSection'
import { useStore } from '../context/StoreContext'

export default function Home() {
  const navigate = useNavigate()
  const { toys, categories } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const featuredToys = useMemo(() => [...toys].sort((a, b) => b.rating - a.rating).slice(0, 4), [toys])

  const filteredToys = useMemo(() => {
    let filtered = toys

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(toy => {
        const toyCategory = toy.category?.name || toy.category
        return toyCategory === selectedCategory
      })
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(toy =>
        toy.name?.toLowerCase().includes(term) ||
        toy.description?.toLowerCase().includes(term) ||
        toy.ageGroup?.toLowerCase().includes(term)
      )
    }

    return filtered
  }, [toys, selectedCategory, searchTerm])

  const scrollRef = useRef(null);
  const scrollAmount = 250; // px

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="page home-page">
      <HeroSection onSearch={setSearchTerm} />
      {!searchTerm && selectedCategory === 'All' && (
        <section className="category-section-styled">
          <h2 className="section-title-custom">Shop by Category</h2>
          <div className="category-scroll-container" ref={scrollRef}>
            {categories.map((cat, index) => {
              const isObject = typeof cat === 'object' && cat !== null;
              const name = isObject ? (cat.name || 'Uncategorized') : cat;
              const key = isObject ? (cat._id || index) : `cat-${index}`;
              const image = isObject ? cat.image : null;

              return (
                <div
                  key={key}
                  className="cat-circle-card"
                  style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both` }}
                  onClick={() => {
                    if (name === 'All') {
                      setSelectedCategory('All')
                    } else {
                      const id = isObject ? cat._id : cat;
                      navigate(`/category/${id}`)
                    }
                  }}
                >
                  <div className="cat-circle-img-wrapper">
                    {image ? (
                      <img src={image} alt={name} />
                    ) : (
                      <span style={{ fontSize: '3rem' }}>🎁</span>
                    )}
                  </div>
                  <span className="cat-name">{name}</span>
                </div>
              )
            })}
          </div>
        </section>
      )}
      <section className="books-section">
        {searchTerm || selectedCategory !== 'All' ? (
          <div className="filter-info">
            <h2>{searchTerm && selectedCategory !== 'All' ? `"${searchTerm}" in ${selectedCategory}` : searchTerm ? `Results for "${searchTerm}"` : `${selectedCategory} Toys`}</h2>
            <p className="results-count">{filteredToys.length} toys found</p>
          </div>
        ) : (
          <div className="section-header">
            <h2 className="section-title">All Toys</h2>
            <p className="section-subtitle">Browse our complete collection</p>
          </div>
        )}
        <ToyGrid toys={filteredToys} />
      </section>
    </div>
  )
}
