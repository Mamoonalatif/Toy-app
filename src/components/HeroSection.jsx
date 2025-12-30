import React, { useState } from 'react'
import a3 from '../assets/a3.png'

export default function HeroSection({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  return (
    <section className="hero-section-new">
      <div className="hero-container">
        <div className="hero-text-side">
          <h1 className="hero-title-new">
            A Fun Kids Play <br />
            Everyday
          </h1>
          <p className="hero-description-new">
            Discover our premium collection of educational and fun toys. Sparking joy and imagination in every child's heart.
          </p>

          <div className="hero-actions">
            <button className="btn-shop-now" onClick={() => {
              const element = document.querySelector('.books-section');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}>
              Shop Now &rarr;
            </button>

            <form onSubmit={handleSearch} className="hero-search-mini">
              <input
                type="text"
                placeholder="Search toys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">🔍</button>
            </form>
          </div>
        </div>

        <div className="hero-image-side">
          <div className="hero-circle-bg"></div>
          <img src={a3} alt="Teddy Bear" className="hero-main-img" />

          {/* Floating Icons */}
          <div className="float-icon icon-1">🧸</div>
          <div className="float-icon icon-2">🚗</div>
          <div className="float-icon icon-3">🎨</div>
          <div className="float-icon icon-4">🛸</div>
        </div>
      </div>

      {/* Cloud Shape Bottom */}
      <div className="hero-clouds">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path fill="#ffffff" fillOpacity="1" d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,149.3C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  )
}
