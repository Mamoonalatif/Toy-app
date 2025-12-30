import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import Button from '../components/ui/Button'
import FormInput from '../components/contact/FormInput'

export default function AddCategory({ initialData = null, onSuccess }) {
    const navigate = useNavigate()
    const { addCategory, updateCategory } = useStore()
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        image: initialData?.image || ''
    })

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        let res;
        if (initialData) {
            res = await updateCategory(initialData._id, formData);
        } else {
            res = await addCategory(formData);
        }

        if (res.success) {
            alert(initialData ? 'Category updated!' : 'Category created!')
            if (onSuccess) onSuccess()
            if (!initialData) {
                setFormData({ name: '', description: '', image: '' })
            }
        } else {
            alert(res.message || 'Error saving category')
        }
    }

    return (
        <div className="add-category-form">
            <div style={{ background: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e3f2fd', overflow: 'hidden' }}>
                <div style={{ background: '#e3f2fd', padding: '15px 25px', borderBottom: '1px solid #bbdefb' }}>
                    <h3 style={{ margin: 0, color: '#1565c0', fontSize: '1.2rem', fontWeight: '600' }}>{initialData ? 'Edit Category' : 'Create New Category'}</h3>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px', padding: '30px' }}>
                    <FormInput
                        label="Category Name"
                        required
                        value={formData.name}
                        onChange={e => handleChange('name', e.target.value)}
                        placeholder="e.g. Educational Toys"
                        style={{ background: '#f8f9fa', border: '1px solid #bbdefb', color: '#37474f' }}
                    />



                    <FormInput
                        label="Image URL"
                        value={formData.image}
                        onChange={e => handleChange('image', e.target.value)}
                        style={{ background: '#f8f9fa', border: '1px solid #bbdefb', color: '#37474f' }}
                    />


                    <FormInput
                        label="Description"
                        type="textarea"
                        value={formData.description}
                        onChange={e => handleChange('description', e.target.value)}
                        style={{ background: '#f8f9fa', border: '1px solid #bbdefb', color: '#37474f' }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
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
                            {initialData ? 'Update Category' : 'Create Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
