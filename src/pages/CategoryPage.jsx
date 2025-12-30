import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import ToyGrid from '../components/ToyGrid'

export default function CategoryPage() {
    const { id } = useParams()
    const { toys, categories } = useStore()

    const category = useMemo(() => categories.find(c => c._id === id || c.slug === id), [categories, id])
    const categoryToys = useMemo(() => {
        if (!category) return []
        return toys.filter(t =>
            (t.category?._id || t.category) === category._id ||
            (t.category?.name || t.category) === category.name
        )
    }, [toys, category])

    if (!category) {
        return <div className="page"><div style={{ textAlign: 'center', marginTop: '50px' }}><h2>Category not found</h2></div></div>
    }

    return (
        <div className="page category-page" style={{ paddingBottom: '60px' }}>

            {/* LIGHT HERO WITH STAMP IMAGE */}
            <div className="container" style={{ marginTop: '40px', marginBottom: '60px' }}>
                <div style={{
                    background: '#F0F9FF', /* Light Background as requested */
                    borderRadius: '40px',
                    padding: '60px 80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#023E8A', /* Dark Blue Text */
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '500px', /* Increased Height */
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #E0F7FA'
                }}>

                    {/* Background Pattern (Doodles) */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.05, pointerEvents: 'none', background: 'radial-gradient(#023E8A 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                    {/* Text Side */}
                    <div style={{ flex: '1', position: 'relative', zIndex: 2, paddingRight: '40px' }}>
                        <span style={{
                            background: '#CAF0F8',
                            color: '#0077B6',
                            padding: '10px 20px',
                            borderRadius: '30px',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            letterSpacing: '1px',
                            display: 'inline-block',
                            marginBottom: '20px',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                        }}>
                            COLLECTION
                        </span>

                        <h1 style={{
                            fontSize: '4.5rem', /* Larger Title */
                            margin: '0 0 20px',
                            fontWeight: '800',
                            lineHeight: '1.1',
                            fontFamily: "'Poppins', sans-serif",
                            color: '#023E8A'
                        }}>
                            {category.name}
                        </h1>

                        <p style={{
                            fontSize: '1.3rem',
                            color: '#4A5568',
                            maxWidth: '500px',
                            lineHeight: '1.6'
                        }}>
                            {category.description || `Discover our amazing selection of ${category.name}. Handpicked for quality, fun, and learning!`}
                        </p>
                    </div>

                    {/* Image Side - STAMP EFFECT (LARGER) */}
                    <div style={{
                        flex: '1',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        position: 'relative',
                        zIndex: 2
                    }}>
                        <div style={{
                            position: 'relative',
                            width: '420px', /* Increased Size */
                            height: '420px', /* Increased Size */
                            background: 'white',
                            padding: '30px',
                            /* The Stamp Effect: White box with dashed border matching bg color to simulate perforation */
                            border: '14px dashed #F0F9FF',
                            boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
                            transform: 'rotate(-3deg) scale(1.05)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.3s ease'
                        }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'rotate(0deg) scale(1.1)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'rotate(-3deg) scale(1.05)'}
                        >
                            <img
                                src={category.image || 'https://via.placeholder.com/500x500?text=Toy'}
                                alt={category.name}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain'
                                }}
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Toys Grid */}
            <div className="container" style={{ marginTop: '20px', paddingBottom: '80px' }}>
                <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #F0F9FF', paddingBottom: '20px' }}>
                    <h2 className="section-title-custom" style={{ margin: 0, fontSize: '2rem', textAlign: 'left', color: '#023E8A' }}>All Items</h2>
                    <span style={{
                        background: '#E0F7FA',
                        color: '#023E8A',
                        padding: '8px 20px',
                        borderRadius: '30px',
                        fontWeight: 'bold',
                        border: '1px solid #BDE0FE'
                    }}>
                        {categoryToys.length} Toys
                    </span>
                </div>

                {categoryToys.length > 0 ? (
                    <ToyGrid toys={categoryToys} />
                ) : (
                    <div style={{ textAlign: 'center', padding: '80px', color: '#888' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🏃‍♂️</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>No toys found here yet!</h3>
                        <p>We're stocking up the shelves. Check back later!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
