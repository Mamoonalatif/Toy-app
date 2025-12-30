import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import Button from '../components/ui/Button'

export default function UserOrders() {
    const { user } = useStore()
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }

        const fetchOrders = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/orders/myorders?userId=${user._id || user.id}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch orders')
                }
                const data = await response.json()
                setOrders(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [user, navigate])

    if (loading) return <div className="page" style={{ textAlign: 'center' }}>Loading orders...</div>

    if (error) return <div className="page" style={{ textAlign: 'center', color: 'red' }}>Error: {error}</div>

    return (
        <div className="page container">
            <div className="section-header">
                <h2 className="section-title">My Orders</h2>
                <p className="section-subtitle">Track and manage your recent purchases</p>
            </div>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: 'var(--color-surface)', borderRadius: '12px' }}>
                    <h3>No orders found</h3>
                    <p>You haven't placed any orders yet.</p>
                    <Link to="/" className="btn-primary" style={{ marginTop: '10px' }}>Start Shopping</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {orders.map(order => (
                        <div key={order._id} style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            padding: '24px',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>Order #{order._id.slice(-6)}</h3>
                                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '6px 12px',
                                        background: order.orderStatus === 'Delivered' ? '#e8f5e9' : '#e3f2fd',
                                        color: order.orderStatus === 'Delivered' ? '#2e7d32' : '#1565c0',
                                        borderRadius: '20px',
                                        fontWeight: '600',
                                        fontSize: '0.9rem',
                                        marginBottom: '5px'
                                    }}>
                                        {order.orderStatus}
                                    </span>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Rs. {order.totalPrice.toFixed(2)}</div>
                                </div>
                            </div>

                            {/* Tracking Info */}
                            <div style={{
                                background: '#f8f9fa',
                                padding: '15px',
                                borderRadius: '8px',
                                marginBottom: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '10px'
                            }}>
                                <div>
                                    <span style={{ color: '#666', marginRight: '10px' }}>Tracking Number:</span>
                                    <strong style={{ fontSize: '1.1rem', color: '#333' }}>{order.trackingNumber}</strong>
                                </div>
                                <Button
                                    onClick={() => navigate(`/track-order/${order._id}`)}
                                    variant="primary"
                                    style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                                >
                                    Track Order
                                </Button>
                            </div>

                            {/* Order Items Summary */}
                            <div>
                                <h4 style={{ fontSize: '1rem', margin: '0 0 10px 0', color: '#555' }}>Items</h4>
                                {(order.orderItems || []).map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '5px', color: '#444' }}>
                                        <span>{item.qty}x {item.name}</span>
                                        <span>Rs. {(item.price * item.qty).toFixed(2)}</span>
                                    </div>
                                ))}
                                {order.giftWrappingPrice > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '5px', color: '#444', fontStyle: 'italic' }}>
                                        <span>🎁 Gift Wrapping</span>
                                        <span>Rs. {order.giftWrappingPrice.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
