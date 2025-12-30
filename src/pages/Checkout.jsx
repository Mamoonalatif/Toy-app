import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import CheckoutItem from '../components/checkout/CheckoutItem'
import EmptyState from '../components/dashboard/EmptyState'
import Button from '../components/ui/Button'

const PAKISTANI_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  'Hyderabad', 'Sukkur', 'Larkana', 'Abbottabad', 'Mardan',
  'Sargodha', 'Bahawalpur', 'Sahiwal', 'Jhang', 'Rahim Yar Khan'
]

export default function Checkout() {
  const { cart, toys, removeFromCart, user, createOrder } = useStore()
  const navigate = useNavigate()
  const [terms, setTerms] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: '',
    address: '',
    city: '',
    postalCode: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Gift Wrapping State
  const [giftWraps, setGiftWraps] = useState([])
  const [selectedWrap, setSelectedWrap] = useState(null)
  const [showWraps, setShowWraps] = useState(false)
  const [viewImage, setViewImage] = useState(null)

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout')
    }
  }, [user, navigate])

  // Fetch gift wraps
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/giftwraps')
      .then(res => res.json())
      .then(data => setGiftWraps(data))
      .catch(err => console.error('Failed to load gift wraps', err))
  }, [])

  const totalToys = useMemo(() => cart.reduce((sum, c) => sum + (c.quantity || 1), 0), [cart])

  // Calculate prices
  const itemsPrice = useMemo(() => {
    return cart.reduce((sum, c) => {
      const toy = toys.find(t => (t._id || t.id) === c.toyId)
      return sum + (toy?.price || 0) * (c.quantity || 1)
    }, 0)
  }, [cart, toys])

  const shippingPrice = itemsPrice > 5000 ? 0 : 200 // Free shipping over Rs. 5000
  const wrapPrice = selectedWrap ? selectedWrap.price : 0
  const totalPrice = itemsPrice + shippingPrice + wrapPrice

  const handleChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const validatePakistaniPhone = (phone) => {
    const pakistaniPhoneRegex = /^(\+92|92|0)?3[0-9]{9}$/
    const cleanedPhone = phone.replace(/[\s-]/g, '')
    return pakistaniPhoneRegex.test(cleanedPhone)
  }

  const handleConfirm = useCallback(async (e) => {
    e.preventDefault()
    setError('')

    if (!user) {
      setError('Please login to place an order')
      navigate('/login?redirect=/checkout')
      return
    }

    if (!terms) return setError('You must accept terms and conditions')
    if (!customerInfo.name || !customerInfo.email) return setError('Enter your name and email')
    if (!customerInfo.phoneNumber) return setError('Phone number is required')
    if (!validatePakistaniPhone(customerInfo.phoneNumber)) {
      return setError('Please enter a valid Pakistani phone number (e.g., 03XX XXXXXXX)')
    }
    if (!customerInfo.address) return setError('Address is required')
    if (!customerInfo.city) return setError('Please select a city')
    if (!customerInfo.postalCode) return setError('Postal code is required')
    if (cart.length === 0) return setError('Cart is empty')

    setLoading(true)

    try {
      const orderData = {
        customerInfo,
        cart,
        itemsPrice,
        shippingPrice,
        giftWrapping: selectedWrap ? selectedWrap._id : null,
        giftWrappingPrice: wrapPrice,
        totalPrice
      }

      const result = await createOrder(orderData)

      if (result.success) {
        navigate(`/confirmation/${result.orderId}`)
      } else {
        setError(result.message || 'Failed to place order')
        setLoading(false)
      }
    } catch (err) {
      setError('An error occurred while placing your order')
      setLoading(false)
    }
  }, [terms, customerInfo, cart, itemsPrice, shippingPrice, totalPrice, createOrder, navigate, user, selectedWrap, wrapPrice])

  if (!user) return null

  return (
    <div className="page checkout-page">
      <h2>Checkout</h2>
      {cart.length === 0 ? (
        <EmptyState
          icon={<span style={{ color: 'white' }}>🛒</span>}
          title="Your cart is empty"
          description="Add toys to your cart before checking out"
          action={<Button variant="primary" onClick={() => navigate('/')}>Browse Toys</Button>}
        />
      ) : (
        <form onSubmit={handleConfirm} className="checkout-form">
          <section className="checkout-summary-header">
            <h3>Order Summary</h3>
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Total Toys:</span>
                <strong>{totalToys}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Subtotal:</span>
                <span>Rs. {itemsPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Shipping:</span>
                <span>{shippingPrice === 0 ? 'FREE' : `Rs. ${shippingPrice.toFixed(2)}`}</span>
              </div>
              {selectedWrap && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#4CAF50' }}>
                  <span>Gift Wrapping ({selectedWrap.name}):</span>
                  <span>Rs. {selectedWrap.price.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '12px', paddingTop: '12px', borderTop: '2px solid var(--border)' }}>
                <span>Total:</span>
                <span>Rs. {totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </section>

          <section className="cart-items">
            <h3>Items in Your Order</h3>
            {cart.map((c) => {
              const toy = toys.find(t => (t._id || t.id) === c.toyId)
              return (
                <CheckoutItem
                  key={c.toyId}
                  cartItem={c}
                  toy={toy}
                  onRemove={removeFromCart}
                />
              )
            })}
          </section>

          {/* Gift Wrapping Section */}
          <section className="gift-wrapping-section" style={{ background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              🎁 Gift Wrapping
            </h3>

            {!selectedWrap ? (
              <div
                onClick={() => setShowWraps(true)}
                style={{
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  color: '#666',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#4CAF50'; e.currentTarget.style.color = '#4CAF50' }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#ccc'; e.currentTarget.style.color = '#666' }}
              >
                <span style={{ fontSize: '1.2rem' }}>+ Add Gift Wrapping</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f0fff4', padding: '15px', borderRadius: '8px', border: '1px solid #4CAF50' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img src={selectedWrap.image} alt={selectedWrap.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#2e7d32' }}>{selectedWrap.name}</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>{selectedWrap.description}</p>
                    <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: '#4CAF50' }}>Rs. {selectedWrap.price}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowWraps(true)}
                    style={{ padding: '8px 12px', background: '#e3f2fd', color: '#1565c0', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedWrap(null)}
                    style={{ padding: '8px 12px', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>
                    Remove
                  </button>
                </div>
              </div>
            )}

            {/* Gift Wrapping Modal Popup */}
            {showWraps && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}>
                <div style={{
                  background: 'white',
                  width: '90%',
                  maxWidth: '800px',
                  maxHeight: '90vh',
                  borderRadius: '12px',
                  padding: '25px',
                  position: 'relative',
                  overflowY: 'auto',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                    <h2 style={{ margin: 0, color: '#333' }}>Select Gift Wrapping</h2>
                    <button
                      type="button"
                      onClick={() => setShowWraps(false)}
                      style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#999' }}
                    >✕</button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {giftWraps.map(wrap => (
                      <div
                        key={wrap._id}
                        onClick={() => {
                          setSelectedWrap(wrap);
                          setShowWraps(false);
                        }}
                        style={{
                          border: selectedWrap?._id === wrap._id ? '2px solid #4CAF50' : '1px solid #eee',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)' }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)' }}
                      >
                        <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                          <img src={wrap.image} alt={wrap.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewImage(wrap.image);
                            }}
                            title="View Full Image"
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              background: 'rgba(255,255,255,0.8)',
                              borderRadius: '50%',
                              width: '30px',
                              height: '30px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'zoom-in',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                          >
                            🔍
                          </div>
                        </div>
                        <div style={{ padding: '15px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#333' }}>{wrap.name}</h3>
                            <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 8px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 'bold' }}>Rs. {wrap.price}</span>
                          </div>
                          <p style={{ margin: 0, color: '#666', fontSize: '0.95rem', lineHeight: '1.5' }}>{wrap.description}</p>
                          <button
                            type="button"
                            style={{
                              width: '100%',
                              marginTop: '15px',
                              padding: '10px',
                              background: '#4CAF50',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: '600'
                            }}
                          >
                            Select This Style
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {giftWraps.length === 0 && (
                    <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No wrapping options available at the moment.</p>
                  )}
                </div>
              </div>
            )}

            {/* Full Image Modal */}
            {viewImage && (
              <div
                onClick={() => setViewImage(null)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.9)',
                  zIndex: 2000,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'zoom-out'
                }}
              >
                <img
                  src={viewImage}
                  alt="Full View"
                  style={{
                    maxWidth: '90%',
                    maxHeight: '90vh',
                    objectFit: 'contain',
                    borderRadius: '4px',
                    boxShadow: '0 0 20px rgba(0,0,0,0.5)'
                  }}
                />
              </div>
            )}
          </section>

          <section className="user-info">
            <h3>Delivery Information</h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <label>
                Full Name *
                <input
                  value={customerInfo.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  disabled={!!user}
                />
              </label>
              <label>
                Email *
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  disabled={!!user}
                />
              </label>
              <label>
                Phone Number * <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>(Pakistani number)</span>
                <input
                  type="tel"
                  value={customerInfo.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  required
                  placeholder="03XX XXXXXXX"
                />
              </label>
              <label>
                Complete Address *
                <textarea
                  value={customerInfo.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  required
                  rows="3"
                />
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <label>
                  City *
                  <select
                    value={customerInfo.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    required
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
                  >
                    <option value="">Select City</option>
                    {PAKISTANI_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Postal Code *
                  <input
                    value={customerInfo.postalCode}
                    onChange={(e) => handleChange('postalCode', e.target.value)}
                    required
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="payment-info" style={{ background: '#FFF9E6', padding: '20px', borderRadius: '12px', marginTop: '24px', border: '2px solid #FFD54F' }}>
            <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              💵 Cash on Delivery
            </h4>
            <p style={{ color: '#666', lineHeight: '1.6', margin: 0 }}>
              You will pay <strong>Rs. {totalPrice.toFixed(2)}</strong> in cash when your order is delivered to your doorstep.
            </p>
          </section>

          <section className="terms">
            <label>
              <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
              I accept the terms and conditions
            </label>
          </section>

          {error && <p className="error" style={{ color: '#d32f2f', background: '#ffebee', padding: '12px', borderRadius: '8px', marginTop: '16px' }}>{error}</p>}
          <div className="checkout-actions">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Placing Order...' : `Confirm Order (Rs. ${totalPrice.toFixed(2)})`}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
