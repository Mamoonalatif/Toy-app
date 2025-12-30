import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import Button from '../components/ui/Button'
import FormInput from '../components/contact/FormInput'

export default function AddToy({ initialData = null, onSuccess }) {
    const navigate = useNavigate()
    const { addToy, updateToy, categories } = useStore()


    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        ageGroup: initialData?.ageGroup || '',
        category: (initialData?.category && typeof initialData.category === 'object' ? initialData.category.name : initialData?.category) || (categories.length > 0 ? categories[0].name : ''),
        countInStock: initialData?.countInStock ?? '0',
        price: initialData?.price || '',
        description: initialData?.description || '',
        image: initialData?.image || ''
    })

    useEffect(() => {
        if (!formData.category && categories.length > 0) {
            setFormData(prev => ({ ...prev, category: categories[0].name }))
        }
    }, [categories, formData.category])

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (Number(formData.price) < 0 || Number(formData.countInStock) < 0) {
            alert('Price and Copies Available cannot be less than zero')
            return
        }

        let res;
        if (initialData) {
            res = await updateToy(initialData._id, formData);
        } else {
            res = await addToy(formData);
        }

        if (res.success) {
            alert(initialData ? 'Toy updated successfully!' : 'Toy added successfully!')
            if (onSuccess) onSuccess();
            if (!initialData) {
                setFormData({
                    name: '', ageGroup: '', category: 'Action Figures', countInStock: '5', price: '', description: '', image: ''
                })
            }
        } else {
            alert(res.message || 'Error saving toy')
        }
    }

    return (
        <div className="add-toy-form">
            <div style={{ background: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e3f2fd', overflow: 'hidden' }}>
                <div style={{ background: '#e3f2fd', padding: '15px 25px', borderBottom: '1px solid #bbdefb' }}>
                    <h3 style={{ margin: 0, color: '#1565c0', fontSize: '1.2rem', fontWeight: '600' }}>{initialData ? 'Edit Toy' : 'Add New Toy'}</h3>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', padding: '30px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <FormInput
                            label="Toy Name"
                            required
                            value={formData.name}
                            onChange={e => handleChange('name', e.target.value)}
                            placeholder="e.g. Super Robot Kit"
                            style={{ background: '#f8f9fa', border: '1px solid #bbdefb', color: '#37474f' }}
                        />
                    </div>


                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#546e7a' }}>Age Group</label>
                        <select
                            value={formData.ageGroup}
                            onChange={e => handleChange('ageGroup', e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #cfd8dc',
                                background: '#f8f9fa',
                                color: '#37474f'
                            }}
                        >
                            <option value="">Select Age Group</option>
                            <option value="All Ages">All Ages</option>
                            <option value="0-2 years">0-2 years</option>
                            <option value="3-5 years">3-5 years</option>
                            <option value="6-8 years">6-8 years</option>
                            <option value="9-12 years">9-12 years</option>
                            <option value="12+ years">12+ years</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#546e7a' }}>Category</label>
                        <select
                            value={formData.category}
                            onChange={e => handleChange('category', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #cfd8dc',
                                background: '#f8f9fa',
                                color: '#37474f'
                            }}
                        >
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <FormInput
                        label="Copies Available"
                        type="number"
                        min="0"
                        required
                        value={formData.countInStock}
                        onChange={e => handleChange('countInStock', e.target.value)}
                        style={{ background: '#f8f9fa', border: '1px solid #bbdefb', color: '#37474f' }}
                    />
                    <FormInput
                        label="Price (Rs)"
                        type="number"
                        min="0"
                        required
                        value={formData.price}
                        onChange={e => handleChange('price', e.target.value)}
                        style={{ background: '#f8f9fa', border: '1px solid #bbdefb', color: '#37474f' }}
                    />

                    <div style={{ gridColumn: '1 / -1' }}>
                        <FormInput
                            label="Image URL"
                            value={formData.image}
                            onChange={e => handleChange('image', e.target.value)}
                            placeholder="https://..."
                            style={{ background: '#f8f9fa', border: '1px solid #bbdefb', color: '#37474f' }}
                        />

                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <FormInput
                            label="Description"
                            type="textarea"
                            required
                            value={formData.description}
                            onChange={e => handleChange('description', e.target.value)}
                            placeholder="Describe the toy..."
                            style={{ background: '#f8f9fa', border: '1px solid #bbdefb', color: '#37474f' }}
                        />
                    </div>

                    <div style={{ gridColumn: '1 / -1', marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            type="submit"
                            style={{
                                padding: '12px 30px',
                                background: '#1e88e5',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '1rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(30, 136, 229, 0.3)',
                                transition: 'background 0.2s'
                            }}
                        >
                            {initialData ? 'Update Toy' : 'Add Toy to Shop'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

