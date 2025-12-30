import React, { useState, useEffect } from 'react'
import FormInput from '../components/contact/FormInput'
import Button from '../components/ui/Button'
import { validators, validateForm } from '../utils/validation'
import { Link } from 'react-router-dom'

const validationSchema = {
  name: [validators.required, validators.minLength(2)],
  email: [validators.required, validators.email],
  subject: [validators.required, validators.minLength(5)],
  message: [validators.required, validators.minLength(20)]
}

import { useStore } from '../context/StoreContext'

export default function Contact() {
  const { submitQuery, user } = useStore()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }))
    }
  }, [user])

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
    if (submitError) setSubmitError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) return; // Should be handled by UI, but double check

    const { isValid, errors: validationErrors } = validateForm(form, validationSchema)
    if (!isValid) return setErrors(validationErrors)

    setIsSubmitting(true)

    // Add user ID to the query
    const queryData = {
      ...form,
      userId: user._id
    }

    const result = await submitQuery(queryData)

    if (result.success) {
      setSent(true)
    } else {
      setSubmitError(result.message)
    }

    setIsSubmitting(false)
  }

  const resetForm = () => {
    setSent(false)
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      subject: '',
      message: ''
    })
  }

  if (sent) {
    return (
      <div className="page contact-page">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>Message Sent Successfully!</h2>
          <p>Thank you for contacting us. Our support team will respond to your inquiry shortly.</p>
          <Button variant="primary" onClick={resetForm}>Send Another Message</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="page contact-page">
      <div className="contact-header">
        <h1>Contact Support</h1>
        <p className="contact-subtitle">Have questions about our toys? We're here to help!</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <h3>Store Information</h3>
          <div className="info-item">
            <span className="info-icon">📍</span>
            <div>
              <strong>Address</strong>
              <p>123 Play Street, Toytown, TY 98765</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📞</span>
            <div>
              <strong>Phone</strong>
              <p>+1 (555) 987-6543</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📧</span>
            <div>
              <strong>Email</strong>
              <p>support@toyshop.com</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">🕒</span>
            <div>
              <strong>Hours</strong>
              <p>Mon-Fri: 9:00 AM - 8:00 PM</p>
              <p>Sat-Sun: 10:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        {user ? (
          <form onSubmit={handleSubmit} className="contact-form">
            <FormInput
              label="Your Name"
              required
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              error={errors.name}
              placeholder="Aashfa Noor"
              disabled={!!user}
            />
            <FormInput
              label="Email Address"
              type="email"
              required
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              error={errors.email}
              placeholder="aashfa@gmail.com"
              disabled={!!user}
            />
            <FormInput
              label="Subject"
              required
              value={form.subject}
              onChange={e => handleChange('subject', e.target.value)}
              error={errors.subject}
              placeholder="Question about a toy?"
            />
            <FormInput
              label="Message"
              type="textarea"
              required
              value={form.message}
              onChange={e => handleChange('message', e.target.value)}
              error={errors.message}
              placeholder="Please describe your inquiry in detail..."
            />
            <Button type="submit" variant="primary" disabled={isSubmitting} className="submit-button">
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
            {submitError && (
              <div style={{ marginTop: '15px', color: '#d32f2f', background: '#ffebee', padding: '10px', borderRadius: '5px' }}>
                {submitError}
              </div>
            )}
          </form>
        ) : (
          <div className="login-prompt">
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              flex: 1
            }}>
              <span style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>🔒</span>
              <h3 style={{ marginBottom: '1rem', color: '#333' }}>Login Required</h3>
              <p style={{ marginBottom: '2rem', color: '#666', lineHeight: '1.6' }}>
                You must be logged in to submit a support query. This helps us track your request and provide better assistance.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link to="/login">
                  <Button variant="primary">Log In</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
