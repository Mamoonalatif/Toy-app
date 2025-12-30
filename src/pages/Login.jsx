import React, { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import Button from '../components/ui/Button'
import FormInput from '../components/contact/FormInput'

export default function Login() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { login } = useStore()
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')

    const redirect = searchParams.get('redirect') || '/'

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields')
            return
        }

        const { success, user } = await login(formData.email, formData.password)
        if (success) {
            if (user.role === 'admin') navigate('/dashboard')
            else navigate(redirect)
        } else {
            setError('Login failed')
        }
    }

    return (
        <div className="page login-page" style={{ maxWidth: '400px', margin: '40px auto' }}>
            <div className="section-header">
                <h2 className="section-title">Sign In</h2>
                <p className="section-subtitle">Welcome back to ToyShop</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form" style={{ background: 'var(--color-surface)', padding: '30px', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
                <FormInput
                    label="Email Address"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="admin@toyshop.com"
                />
                <FormInput
                    label="Password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                />

                {error && <p className="error-text" style={{ marginBottom: '16px' }}>{error}</p>}

                <Button type="submit" variant="primary" style={{ width: '100%' }}>Sign In</Button>

                <p style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--color-muted)', textAlign: 'center' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Sign Up</Link>
                </p>

            </form>
        </div>
    )
}
