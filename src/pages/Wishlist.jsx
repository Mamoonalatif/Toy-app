import React from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import ToyCard from '../components/ToyCard'

export default function Wishlist() {
    const { wishlist, toys, addToCart, toggleWishlist } = useStore()

    // Get full toy objects for wishlist items
    const wishlistToys = toys.filter(toy => wishlist.includes(toy._id || toy.id))

    const handleAddToCart = (toyId) => {
        return addToCart(toyId)
    }

    const handleRemoveFromWishlist = (toyId) => {
        toggleWishlist(toyId)
    }

    if (wishlist.length === 0) {
        return (
            <div className="page">
                <div className="section-header">
                    <h1 className="section-title">My Wishlist</h1>
                    <p className="section-subtitle">Your wishlist is empty</p>
                </div>
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '24px', color: 'var(--color-text-light)' }}>
                        Start adding toys to your wishlist by clicking the star icon on any toy!
                    </p>
                    <Link to="/" className="btn-primary" style={{ textDecoration: 'none', color: 'white' }}>
                        Continue Shopping
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="page">
            <div className="section-header">
                <h1 className="section-title">My Wishlist ⭐</h1>
                <p className="section-subtitle">
                    You have {wishlist.length} {wishlist.length === 1 ? 'toy' : 'toys'} in your wishlist
                </p>
            </div>

            <div className="book-grid">
                {wishlistToys.map((toy) => (
                    <ToyCard
                        key={toy._id || toy.id}
                        toy={toy}
                        onAdd={handleAddToCart}
                    />
                ))}
            </div>

            <div style={{ marginTop: '40px', textAlign: 'center' }}>
                <Link to="/" className="btn-secondary" style={{ textDecoration: 'none', marginRight: '12px' }}>
                    Continue Shopping
                </Link>
            </div>
        </div>
    )
}
