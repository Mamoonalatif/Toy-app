import React, { useState, useEffect } from 'react'
import { useStore } from '../context/StoreContext'

export default function AddUser({ initialData, onSuccess }) {
    const { adminAddUser, adminUpdateUser } = useStore()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (initialData) {
            setName(initialData.name)
            setEmail(initialData.email)
            setIsAdmin(initialData.isAdmin)
            setPassword('') // Don't prefill password
        } else {
            setName('')
            setEmail('')
            setPassword('')
            setIsAdmin(false)
        }
    }, [initialData])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const userData = {
            name,
            email,
            isAdmin,
        }

        if (password) {
            userData.password = password
        } else if (!initialData) {
            // Password required for new user
            alert('Password is required')
            setLoading(false)
            return
        }

        let result
        if (initialData) {
            result = await adminUpdateUser(initialData._id, userData)
        } else {
            result = await adminAddUser(userData)
        }

        if (result.success) {
            alert(initialData ? 'User updated successfully' : 'User created successfully')
            if (onSuccess) onSuccess()
        } else {
            alert(result.message)
        }
        setLoading(false)
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 0', padding: '20px', background: 'white', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <h3 style={{ color: '#1565c0', marginTop: 0 }}>{initialData ? 'Edit User' : 'Add New User'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>{initialData ? 'New Password (leave blank to keep current)' : 'Password'}</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            style={{ width: '18px', height: '18px' }}
                        />
                        <span style={{ color: '#555' }}>Admin Privileges</span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        background: '#1976d2',
                        color: 'white',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        marginTop: '10px',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Processing...' : (initialData ? 'Update User' : 'Create User')}
                </button>
            </form>
        </div>
    )
}
