import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import Button from '../components/ui/Button'
import FormInput from '../components/contact/FormInput'

export default function Signup() {
    const navigate = useNavigate()
    const { register } = useStore()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        // Validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        const { success, message } = await register(formData.name, formData.email, formData.password)
        if (success) {
            // Redirect to home page after successful registration
            navigate('/')
        } else {
            setError(message || 'Registration failed')
        }
    }

    return (
        <div className="page signup-page" style={{ maxWidth: '400px', margin: '40px auto' }}>
            <div className="section-header">
                <h2 className="section-title">Create Account</h2>
                <p className="section-subtitle">Join ToyShop today</p>
            </div>

            <form onSubmit={handleSubmit} className="signup-form" style={{ background: 'var(--color-surface)', padding: '30px', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
                <FormInput
                    label="Full Name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                />
                <FormInput
                    label="Email Address"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john@example.com"
                />
                <FormInput
                    label="Password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                />
                <FormInput
                    label="Confirm Password"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="••••••••"
                />

                {error && <p className="error-text" style={{ marginBottom: '16px' }}>{error}</p>}

                <Button type="submit" variant="primary" style={{ width: '100%' }}>Create Account</Button>

                <p style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--color-muted)', textAlign: 'center' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Sign In</Link>
                </p>
            </form>
        </div>
    )
}
