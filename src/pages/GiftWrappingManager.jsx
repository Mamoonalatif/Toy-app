import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import './GiftWrappingManager.css';

const GiftWrappingManager = () => {
    const { user } = useStore();
    const navigate = useNavigate();
    const [giftWraps, setGiftWraps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [editId, setEditId] = useState(null); // Track if we are editing

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchGiftWraps();
    }, [user, navigate]);

    const fetchGiftWraps = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/giftwraps/all');
            const data = await response.json();
            if (response.ok) {
                setGiftWraps(data);
            } else {
                setError('Failed to fetch gift wraps');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = editId
            ? `http://127.0.0.1:5000/api/giftwraps/${editId}`
            : 'http://127.0.0.1:5000/api/giftwraps';

        const method = editId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    description,
                    price: Number(price),
                    image
                }),
            });

            if (response.ok) {
                resetForm();
                fetchGiftWraps();
            } else {
                alert(`Failed to ${editId ? 'update' : 'add'} gift wrap`);
            }
        } catch (err) {
            console.error(err);
            alert(`Error ${editId ? 'updating' : 'adding'} gift wrap`);
        }
    };

    const handleEdit = (wrap) => {
        setEditId(wrap._id);
        setName(wrap.name);
        setDescription(wrap.description);
        setPrice(wrap.price);
        setImage(wrap.image);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditId(null);
        setName('');
        setDescription('');
        setPrice('');
        setImage('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this option?')) return;

        try {
            const response = await fetch(`http://127.0.0.1:5000/api/giftwraps/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchGiftWraps();
                if (editId === id) resetForm(); // Reset form if we deleted the item being edited
            } else {
                alert('Failed to delete');
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="gift-manager-container">
            <h1>Gift Wrapping Manager</h1>

            {/* Add/Edit Section */}
            <div className="add-wrap-section">
                <h2>{editId ? 'Edit Option' : 'Add New Option'}</h2>
                <form onSubmit={handleSubmit} className="add-wrap-form">
                    <div className="form-group">
                        <label>Theme Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Birthday Blast"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Colorful balloons..."
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Price (Rs.)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0.00"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Image URL</label>
                        <input
                            type="text"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="http://..."
                            required
                        />
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="add-btn">
                            {editId ? 'Update Option' : 'Add Option'}
                        </button>
                        {editId && (
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List Section */}
            <div className="wrap-list-section">
                <h2>Current Options</h2>
                <div className="wrap-grid">
                    {giftWraps.map(wrap => (
                        <div key={wrap._id} className="wrap-card-admin">
                            <img src={wrap.image} alt={wrap.name} />
                            <div className="wrap-info">
                                <h3>{wrap.name}</h3>
                                <p className="price">Rs. {wrap.price.toFixed(2)}</p>
                                <p className="desc">{wrap.description}</p>
                                <div className="card-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEdit(wrap)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(wrap._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GiftWrappingManager;
