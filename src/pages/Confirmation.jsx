import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import Button from '../components/ui/Button'

export default function Confirmation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getOrderById } = useStore()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      const result = await getOrderById(id)
      if (result.success) {
        setOrder(result.order)
      }
      setLoading(false)
    }
    fetchOrder()
  }, [id, getOrderById])

  if (loading) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p>Loading order details...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Order Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/')}>Go to Home</Button>
      </div>
    )
  }

  return (
    <div className="page confirmation-page" style={{ maxWidth: '700px', margin: '40px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>✅</div>
        <h2 style={{ color: 'var(--color-primary)', marginBottom: '8px' }}>Order Placed Successfully!</h2>
        <p style={{ color: 'var(--color-muted)' }}>Thank you for your order</p>
      </div>

      <section style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
        <h3>Order Information</h3>
        <div style={{ marginTop: '16px', display: 'grid', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-muted)' }}>Order ID:</span>
            <strong>{order._id}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-muted)' }}>Tracking Number:</span>
            <strong style={{ color: 'var(--color-primary)' }}>{order.trackingNumber}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-muted)' }}>Status:</span>
            <span style={{
              background: '#E8F5E9',
              color: '#2E7D32',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              {order.orderStatus}
            </span>
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

      <section style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
        <h3>Delivery Address</h3>
        <div style={{ marginTop: '12px', lineHeight: '1.8' }}>
          <p>{order.shippingAddress?.address}</p>
          <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
          <p>{order.phoneNumber}</p>
        </div>
      </section>

      <section style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
        <h3>Order Items</h3>
        <div style={{ marginTop: '16px' }}>
          {order.orderItems?.map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px',
              paddingBottom: '12px',
              borderBottom: index < order.orderItems.length - 1 ? '1px solid var(--border)' : 'none'
            }}>
              <div>
                <strong>{item.name}</strong>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>Qty: {item.qty}</p>
              </div>
              <span>Rs. {(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </section>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Button variant="primary" onClick={() => navigate(`/track-order/${order._id}`)} style={{ flex: 1 }}>
          Track Order
        </Button>
        <Button variant="secondary" onClick={() => navigate('/')} style={{ flex: 1 }}>
          Continue Shopping
        </Button>
      </div>


    </div>
  )
}
