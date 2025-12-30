import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import Button from '../components/ui/Button'

export default function OrderTracking() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getOrderById, getOrderByTrackingNumber, getOrderTracking } = useStore()
    const [order, setOrder] = useState(null)
    const [tracking, setTracking] = useState([])
    const [loading, setLoading] = useState(!!id)
    const [trackingInput, setTrackingInput] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        if (id) {
            fetchOrderData(id)
        }
    }, [id])

    const fetchOrderData = async (identifier) => {
        setLoading(true)
        setError('')

        let orderResult;

        // Determine if identifier is MongoID (hex) or Tracking Number (TRK...)
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(identifier)

        if (isMongoId) {
            orderResult = await getOrderById(identifier)
        } else {
            orderResult = await getOrderByTrackingNumber(identifier)
        }

        if (orderResult.success) {
            setOrder(orderResult.order)
            // For tracking history, we need the order _id, which we now have
            const trackingResult = await getOrderTracking(orderResult.order._id)
            if (trackingResult.success) setTracking(trackingResult.tracking)
        } else {
            setError(orderResult.message || 'Order not found')
            setOrder(null)
        }

        setLoading(false)
    }

    const handleTrackSubmit = (e) => {
        e.preventDefault()
        if (trackingInput.trim()) {
            navigate(`/track-order/${trackingInput.trim()}`)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return { bg: '#FFF3E0', color: '#E65100' }
            case 'Booked': return { bg: '#E3F2FD', color: '#1976D2' }
            case 'In Route': return { bg: '#F3E5F5', color: '#7B1FA2' }
            case 'Delivered': return { bg: '#E8F5E9', color: '#2E7D32' }
            default: return { bg: '#F5F5F5', color: '#666' }
        }
    }

    const statusSteps = ['Pending', 'Booked', 'In Route', 'Delivered']
    const currentStatusIndex = order ? statusSteps.indexOf(order.orderStatus) : 0

    if (!id || error) {
        return (
            <div className="page" style={{ maxWidth: '600px', margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '30px', color: 'var(--color-primary)' }}>Track Your Order</h2>
                <div style={{ background: 'var(--color-surface)', padding: '40px', borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }}>
                    <p style={{ marginBottom: '20px', color: 'var(--color-muted)' }}>Enter your Tracking ID to check status</p>
                    <form onSubmit={handleTrackSubmit}>
                        <input
                            type="text"
                            value={trackingInput}
                            onChange={(e) => setTrackingInput(e.target.value)}
                            placeholder="e.g., TRK1734091234"
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '8px',
                                border: '2px solid var(--border)',
                                fontSize: '1.1rem',
                                marginBottom: '20px',
                                textAlign: 'center',
                                letterSpacing: '1px'
                            }}
                            required
                        />
                        <Button type="submit" variant="primary" style={{ width: '100%', padding: '14px', fontSize: '1.1rem' }}>
                            Track Order
                        </Button>
                    </form>
                    {error && (
                        <div style={{ marginTop: '20px', color: '#d32f2f', background: '#ffebee', padding: '12px', borderRadius: '8px' }}>
                            {error}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="page" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <p>Loading tracking information...</p>
            </div>
        )
    }

    if (!order) return null // Should be handled by error state above

    return (
        <div className="page order-tracking-page" style={{ maxWidth: '800px', margin: '40px auto' }}>
            <Button onClick={() => navigate('/track-order')} style={{ marginBottom: '20px', background: 'none', border: 'none', color: 'var(--color-primary)', padding: 0 }}>
                ← Track Another Order
            </Button>
            <h2>Order Status</h2>

            <section style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>Tracking Number</p>
                        <h3 style={{ color: 'var(--color-primary)', margin: '4px 0' }}>{order.trackingNumber}</h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>Current Status</p>
                        <span style={{
                            ...getStatusColor(order.orderStatus),
                            background: getStatusColor(order.orderStatus).bg,
                            color: getStatusColor(order.orderStatus).color,
                            padding: '6px 16px',
                            borderRadius: '16px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            display: 'inline-block',
                            marginTop: '4px'
                        }}>
                            {order.orderStatus}
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginTop: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                        {/* Progress Line */}
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            left: '0',
                            right: '0',
                            height: '4px',
                            background: '#E0E0E0',
                            zIndex: 0
                        }}>
                            <div style={{
                                height: '100%',
                                background: 'var(--color-primary)',
                                width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%`,
                                transition: 'width 0.3s'
                            }} />
                        </div>

                        {/* Status Steps */}
                        {statusSteps.map((status, index) => {
                            const isCompleted = index <= currentStatusIndex
                            return (
                                <div key={status} style={{ flex: 1, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: isCompleted ? 'var(--color-primary)' : '#E0E0E0',
                                        color: isCompleted ? 'white' : '#999',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto',
                                        fontWeight: 'bold',
                                        fontSize: '1.2rem',
                                        transition: 'all 0.3s'
                                    }}>
                                        {isCompleted ? '✓' : index + 1}
                                    </div>
                                    <p style={{
                                        marginTop: '12px',
                                        fontSize: '0.85rem',
                                        fontWeight: isCompleted ? '600' : '400',
                                        color: isCompleted ? 'var(--color-text)' : 'var(--color-muted)'
                                    }}>
                                        {status}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Tracking History */}
            <section style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
                <h3>Tracking History</h3>
                <div style={{ marginTop: '20px' }}>
                    {tracking.length > 0 ? (
                        tracking.map((entry, index) => (
                            <div key={entry._id} style={{
                                display: 'flex',
                                gap: '16px',
                                marginBottom: '20px',
                                paddingBottom: '20px',
                                borderBottom: index < tracking.length - 1 ? '1px solid var(--border)' : 'none'
                            }}>
                                <div style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: getStatusColor(entry.status).color,
                                    marginTop: '6px',
                                    flexShrink: 0
                                }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <strong>{entry.status}</strong>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                                            {new Date(entry.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    {entry.notes && (
                                        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
                                            {entry.notes}
                                        </p>
                                    )}
                                    {entry.updatedBy && (
                                        <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: '4px' }}>
                                            Updated by: {entry.updatedBy.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: 'var(--color-muted)', textAlign: 'center' }}>No tracking history available</p>
                    )}
                </div>
            </section>

            {/* Order Details */}
            <section style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
                <h3>Order Details</h3>
                <div style={{ marginTop: '16px', display: 'grid', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--color-muted)' }}>Order ID:</span>
                        <strong>{order._id}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--color-muted)' }}>Order Date:</span>
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--color-muted)' }}>Total Amount:</span>
                        <strong>Rs. {order.totalPrice?.toFixed(2)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--color-muted)' }}>Payment Method:</span>
                        <span>{order.paymentMethod}</span>
                    </div>
                </div>
            </section>

            <Button variant="primary" onClick={() => navigate('/')} style={{ width: '100%' }}>
                Back to Home
            </Button>
        </div>
    )
}
