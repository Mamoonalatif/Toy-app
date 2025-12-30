
import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { format } from 'date-fns'
import BorrowedToyItem from '../components/dashboard/BorrowedToyItem'
import PendingToyItem from '../components/dashboard/PendingToyItem'
import WishlistCard from '../components/dashboard/WishlistCard'
import EmptyState from '../components/dashboard/EmptyState'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import AddToy from './AddToy'
import AddCategory from './AddCategory'
import AddUser from './AddUser'
import GiftWrappingManager from './GiftWrappingManager'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

export default function Dashboard() {
    const handleDeleteUser = async (userId) => {
      if (window.confirm('Are you sure you want to delete this user?')) {
        const res = await adminDeleteUser(userId);
        if (res.success) {
          alert('User deleted');
          fetchAllUsers(); // Refresh the user list
        } else {
          alert(res.message || 'Failed to delete user');
        }
      }
    };
  // Add this function at the top level of your component
  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserView('edit');
  };
  const navigate = useNavigate()
  const { reservations, wishlist, toys, cancelReservation, extendBorrowing, user, logout, deleteToy, getAllReviews, getAllCustomers, getAllOrders, updateOrderStatus, getAllQueries, getAdminStats, getAllUsers, adminDeleteUser } = useStore()
  const [activeTab, setActiveTab] = useState(user?.role === 'admin' ? 'reports' : 'borrowed')
  const [toyView, setToyView] = useState('list') // 'list', 'add', 'edit'
  const [editingToy, setEditingToy] = useState(null)

  const [categoryView, setCategoryView] = useState('list') // 'list', 'add', 'edit'
  const [editingCategory, setEditingCategory] = useState(null)

  const [userView, setUserView] = useState('list') // 'list', 'add', 'edit'
  const [editingUser, setEditingUser] = useState(null)

  const { categories, deleteCategory } = useStore() // Ensure categories and deleteCategory are destructured

  // Admin data states
  const [reviews, setReviews] = useState([])
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])
  const [queries, setQueries] = useState([])
  const [users, setUsers] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [loadingQueries, setLoadingQueries] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [stats, setStats] = useState(null)
  const [loadingStats, setLoadingStats] = useState(false)

  // Fetch admin data when tabs change
  useEffect(() => {
    if (user?.role === 'admin') {
      if (activeTab === 'reviews') {
        fetchAllReviews()
      } else if (activeTab === 'customers') {
        fetchAllCustomers()
      } else if (activeTab === 'orders') {
        fetchAllOrders()
      } else if (activeTab === 'queries') {
        fetchAllQueries()
      } else if (activeTab === 'queries') {
        fetchAllQueries()
      } else if (activeTab === 'users') {
        fetchAllUsers()
      } else if (activeTab === 'reports') {
        fetchAllOrders()
        fetchAllCustomers()
        fetchStats()
      }
    }
  }, [activeTab, user])

  // Chart Data Preparation
  const salesData = useMemo(() => {
    const dailyData = {};
    if (!orders.length) return [];

    // Initialize with 0 for sorting
    orders.forEach(order => {
      const date = format(new Date(order.createdAt), 'MMM dd');
      if (!dailyData[date]) dailyData[date] = 0;
      dailyData[date] += order.totalPrice || 0;
    });

    return Object.keys(dailyData).map(date => ({
      name: date,
      sales: dailyData[date]
    })).reverse().slice(0, 7).reverse(); // Just take some data
    // Improved sorting logic would be better but this is simple aggregation
  }, [orders]);

  const statusData = useMemo(() => {
    const counts = { Pending: 0, Booked: 0, 'In Route': 0, Delivered: 0 };
    orders.forEach(order => {
      if (counts[order.orderStatus] !== undefined) counts[order.orderStatus]++;
      else counts[order.orderStatus] = 1;
    });
    return Object.keys(counts).map(status => ({
      name: status,
      value: counts[status]
    }));
  }, [orders]);

  const COLORS = ['#FFC107', '#2196F3', '#9C27B0', '#4CAF50', '#8884d8'];

  const fetchAllReviews = async () => {
    setLoadingReviews(true)
    const result = await getAllReviews()
    if (result.success) {
      setReviews(result.reviews)
    }
    setLoadingReviews(false)
  }

  const fetchAllCustomers = async () => {
    setLoadingCustomers(true)
    const result = await getAllCustomers()
    if (result.success) {
      setCustomers(result.customers)
    }
    setLoadingCustomers(false)
  }

  const fetchAllOrders = async () => {
    setLoadingOrders(true)
    const result = await getAllOrders()
    if (result.success) {
      setOrders(result.orders)
    }
    setLoadingOrders(false)
  }

  const fetchAllQueries = async () => {
    setLoadingQueries(true)
    const result = await getAllQueries()
    if (result.success) {
      setQueries(result.queries)
    }
    setLoadingQueries(false)
  }

  const fetchAllUsers = async () => {
    setLoadingUsers(true)
    const result = await getAllUsers()
    if (result.success) {
      setUsers(result.users)
    }
    setLoadingUsers(false)
  }

  const fetchStats = async () => {
    setLoadingStats(true)
    const result = await getAdminStats()
    if (result.success) {
      setStats(result.stats)
    }
    setLoadingStats(false)
  }

  const handleOrderStatusChange = async (orderId, newStatus) => {
    // Optimistically update the UI
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      )
    )

    // Update on the server
    const result = await updateOrderStatus(orderId, newStatus, `Status changed to ${newStatus}`)

    if (!result.success) {
      // Revert on failure
      alert(result.message || 'Failed to update order status')
      fetchAllOrders() // Refresh to get correct data
    }
  }

  const handleEditCategory = (cat) => {
    setEditingCategory(cat)
    setCategoryView('edit')
  }

  const handleDeleteCategory = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      const res = await deleteCategory(id)
      if (res.success) alert('Category deleted')
      else alert(res.message)
    }
  }

  const handleEdit = (toy) => {
    setEditingToy(toy)
    setToyView('edit')
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this toy?')) {
      const res = await deleteToy(id)
      if (res.success) alert('Toy deleted')
      else alert(res.message)
    }
  }

  // Helper generic icon component
  const Icon = ({ d }) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d={d} />
    </svg>
  );

  const adminTabs = [
    {
      id: 'users',
      label: 'User Management',
      icon: <Icon d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    },
    {
      id: 'toys',
      label: 'Toy Management',
      icon: <Icon d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l9-5.25V7.93zm-10.5 14.25v-9l-9-5.25v9l9 5.25z" />
    },
    {
      id: 'categories',
      label: 'Category Management',
      icon: <Icon d="M9.315 2.254a2.25 2.25 0 011.664.65l8.118 8.117a2.25 2.25 0 010 3.182l-7.39 7.39a2.25 2.25 0 01-3.182 0l-8.12-8.116a2.25 2.25 0 01-.65-1.664v-5.08A2.25 2.25 0 012 4.484V4.498A2.25 2.25 0 014.25 2.25h5.065zM5.5 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    },
    {
      id: 'orders',
      label: 'Order Management',
      icon: <Icon d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375zM2.25 9.75l1.5 11.25c.085.645.75 1.5 1.5 1.5h13.5c.75 0 1.415-.855 1.5-1.5l1.5-11.25H2.25z" />
    },
    {
      id: 'queries',
      label: 'User Queries',
      icon: <Icon d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.291 3.802v5.736c0 1.94-1.37 3.552-3.291 3.802-1.928.25-3.923.39-5.914.409l-3.328 2.396a.916.916 0 01-1.442-.765v-1.65c-2.001-.03-3.998-.173-5.932-.424-1.92-.25-3.29-1.862-3.29-3.802V6.46c0-1.94 1.37-3.551 3.29-3.802z" />
    },
    {
      id: 'reviews',
      label: 'User Reviews',
      icon: <Icon d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    },
    {
      id: 'customers',
      label: 'Customer Data',
      icon: <Icon d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM20.25 7.875a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-5.246-4.821z" />
    },
    {
      id: 'gift-wrapping',
      label: 'Gift Wrapping',
      icon: <Icon d="M11.25 4.5l-.27-1.393A2.252 2.252 0 008.775 1.5 2.25 2.25 0 006.5 3.75V4.5h4.75zM12.75 4.5l.27-1.393A2.252 2.252 0 0115.225 1.5 2.25 2.25 0 0117.5 3.75V4.5h-4.75zM5 5.25v13.5a1.5 1.5 0 001.5 1.5h4.75V5.25H5zM12.75 20.25h4.75a1.5 1.5 0 001.5-1.5V5.25h-6.25v15z" />
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <Icon d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
    },
  ]

  // --- User Logic ---
  const borrowedToys = useMemo(() => reservations.filter(r => r.status === 'picked-up'), [reservations])
  const pendingReservations = useMemo(() => reservations.filter(r => r.status === 'pending'), [reservations])

  const handleExtend = (reservationId, toyId) => {
    const res = extendBorrowing(reservationId, toyId)
    if (res?.message) alert(res.message)
  }

  const handleCancel = (reservationId) => {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      const res = cancelReservation(reservationId)
      if (res?.message) alert(res.message)
    }
  }

  const userTabs = [
    { id: 'borrowed', label: 'Currently Borrowed' },
    { id: 'pending', label: 'Pending Reservations' },
    { id: 'history', label: 'History' },
    { id: 'wishlist', label: 'Wishlist' }
  ]

  if (!user) {
    return <div className="page"><div style={{ textAlign: 'center', marginTop: '50px' }}><h2>Please login to view dashboard</h2><Button onClick={() => navigate('/login')}>Login</Button></div></div>
  }

  // --- Admin Dashboard Layout ---
  if (user.role === 'admin') {
    return (
      <div className="page dashboard-page admin-dashboard" style={{ display: 'flex', gap: '0', maxWidth: '100%', padding: 0, background: '#f0f8ff', minHeight: '100vh' }}>
        {/* Soft Sky Blue Sidebar */}
        <div style={{ width: '250px', background: '#e3f2fd', color: '#1e88e5', minHeight: '100vh', display: 'flex', flexDirection: 'column', borderRight: '1px solid #bbdefb' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #90caf9', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1565c0' }}>ToyShop Admin</span>
          </div>

          <div style={{ padding: '15px 10px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #90caf9' }}>
            <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#64b5f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>A</div>
            <span style={{ color: '#0d47a1', fontWeight: '500' }}>Admin User</span>
          </div>

          <nav style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {adminTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 15px',
                  background: activeTab === tab.id ? '#42a5f5' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#1976d2',
                  border: 'none',
                  borderRadius: '4px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '0.95rem'
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          <div style={{ marginTop: 'auto', padding: '10px' }}>
            <button
              onClick={() => { logout(); navigate('/') }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#ffebee';
                e.currentTarget.style.color = '#c62828';
                e.currentTarget.style.border = '1px solid #ffcdd2';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#1565c0';
                e.currentTarget.style.border = '1px solid transparent';
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 15px',
                width: '100%',
                background: 'transparent',
                color: '#1565c0',
                border: '1px solid transparent',
                borderRadius: '4px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              <span><Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2h-2V5H5v14h4v-2h2v2a2 2 0 0 1-2 2zm11-9-5-5v3H9v4h6v3l5-5z" /></span>
              Logout (Exit)
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px' }}>



            {/* Main Content Card (Table-like container) */}
            <div style={{ background: 'white', borderRadius: '4px', borderTop: '3px solid #007bff', boxShadow: '0 0 1px rgba(0,0,0,.125), 0 1px 3px rgba(0,0,0,.2)' }}>
              <div style={{ padding: '15px 20px', borderBottom: '1px solid #f4f4f4', display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '400' }}>{adminTabs.find(t => t.id === activeTab)?.label}</h3>
              </div>
              <div style={{ padding: '20px' }}>

                {activeTab === 'toys' && (
                  toyView === 'list' ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, color: '#1565c0' }}>Toy Inventory</h3>
                        <button
                          onClick={() => setToyView('add')}
                          style={{
                            background: '#1e88e5',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                        >
                          + Add New Toy
                        </button>
                      </div>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                          <thead>
                            <tr style={{ background: '#e3f2fd', color: '#1565c0', textAlign: 'left' }}>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Image</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Name</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Age Group</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Category</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Price</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Stock</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb', textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {toys.map(toy => (
                              <tr key={toy.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '10px' }}>
                                  <img
                                    src={toy.image}
                                    alt={toy.name}
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #dee2e6' }}
                                  />
                                </td>
                                <td style={{ padding: '10px', fontWeight: '500', color: '#455a64' }}>{toy.name}</td>
                                <td style={{ padding: '10px', color: '#78909c' }}>{toy.ageGroup}</td>
                                <td style={{ padding: '10px' }}><Badge>{toy.category?.name || 'Uncategorized'}</Badge></td>
                                <td style={{ padding: '10px', fontWeight: 'bold', color: '#2e7d32' }}>Rs. {toy.price}</td>
                                <td style={{ padding: '10px' }}>
                                  <span style={{ color: toy.countInStock > 0 ? '#2e7d32' : '#c62828', fontWeight: '500' }}>
                                    {toy.countInStock > 0 ? `${toy.countInStock} in stock` : 'Out of stock'}
                                  </span>
                                </td>
                                <td style={{ padding: '10px', textAlign: 'right' }}>
                                  <button
                                    onClick={() => handleEdit(toy)}
                                    style={{ marginRight: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }} title="Edit">
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() => handleDelete(toy._id)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }} title="Delete">
                                    🗑️
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {toys.length === 0 && (
                              <tr>
                                <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#78909c' }}>No toys found. Add one to get started!</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => { setToyView('list'); setEditingToy(null); }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#1e88e5',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          marginBottom: '15px',
                          fontWeight: '500'
                        }}
                      >
                        ← Back to Inventory
                      </button>
                      <AddToy initialData={editingToy} onSuccess={() => setToyView('list')} />
                    </div>
                  )
                )}
                {activeTab === 'categories' && (
                  categoryView === 'list' ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, color: '#1565c0' }}>Category Management</h3>
                        <button
                          onClick={() => setCategoryView('add')}
                          style={{
                            background: '#1e88e5',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                        >
                          + Add New Category
                        </button>
                      </div>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                          <thead>
                            <tr style={{ background: '#e3f2fd', color: '#1565c0', textAlign: 'left' }}>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Image</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Name</th>

                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb', textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categories.map(cat => (
                              <tr key={cat._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '10px' }}>
                                  <img
                                    src={cat.image}
                                    alt={cat.name}
                                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #dee2e6' }}
                                  />
                                </td>
                                <td style={{ padding: '10px', fontWeight: '500', color: '#455a64' }}>{cat.name}</td>

                                <td style={{ padding: '10px', textAlign: 'right' }}>
                                  <button
                                    onClick={() => handleEditCategory(cat)}
                                    style={{ marginRight: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }} title="Edit">
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCategory(cat._id)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }} title="Delete">
                                    🗑️
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {categories.length === 0 && (
                              <tr>
                                <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#78909c' }}>No categories found.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => { setCategoryView('list'); setEditingCategory(null); }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#1e88e5',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          marginBottom: '15px',
                          fontWeight: '500'
                        }}
                      >
                        ← Back to Categories
                      </button>
                      <AddCategory initialData={editingCategory} onSuccess={() => setCategoryView('list')} />
                    </div>
                  )
                )}
                {activeTab === 'users' && (
                  userView === 'list' ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, color: '#1565c0' }}>User Management</h3>
                        <button
                          onClick={() => setUserView('add')}
                          style={{
                            background: '#1e88e5',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                        >
                          + Add New User
                        </button>
                      </div>
                      {loadingUsers ? <p>Loading users...</p> : (
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                              <tr style={{ background: '#e3f2fd', color: '#1565c0', textAlign: 'left' }}>
                                <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Name</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Email</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Role</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb', textAlign: 'right' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {users.map(u => (
                                <tr key={u._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                  <td style={{ padding: '10px', fontWeight: '500', color: '#455a64' }}>{u.name}</td>
                                  <td style={{ padding: '10px', color: '#78909c' }}>{u.email}</td>
                                  <td style={{ padding: '10px' }}>
                                    <Badge color={u.isAdmin ? 'blue' : 'gray'}>{u.isAdmin ? 'Admin' : 'User'}</Badge>
                                  </td>
                                  <td style={{ padding: '10px', textAlign: 'right' }}>
                                    <button
                                      onClick={() => handleEditUser(u)}
                                      style={{ marginRight: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }} title="Edit">
                                      ✏️
                                    </button>
                                    <button
                                      onClick={() => handleDeleteUser(u._id)}
                                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }} title="Delete">
                                      🗑️
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>)}
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => { setUserView('list'); setEditingUser(null); }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#1e88e5',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          marginBottom: '15px',
                          fontWeight: '500'
                        }}
                      >
                        ← Back to Users
                      </button>
                      <AddUser initialData={editingUser} onSuccess={() => { setUserView('list'); fetchAllUsers(); }} />
                    </div>
                  )
                )}
                {activeTab === 'orders' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ margin: 0, color: '#1565c0' }}>All Orders</h3>
                    </div>
                    {loadingOrders ? (
                      <p style={{ textAlign: 'center', color: '#78909c' }}>Loading orders...</p>
                    ) : orders.length === 0 ? (
                      <EmptyState icon="📦" title="No orders yet" description="Customer orders will appear here." />
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                          <thead>
                            <tr style={{ background: '#e3f2fd', color: '#1565c0', textAlign: 'left' }}>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Order ID</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Customer</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Tracking #</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Items</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Total</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Status</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map(order => (
                              <tr key={order._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '10px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#455a64' }}>{order._id.slice(-8)}</td>
                                <td style={{ padding: '10px' }}>
                                  <div style={{ fontWeight: '500', color: '#455a64' }}>{order.user?.name || 'N/A'}</div>
                                  <div style={{ fontSize: '0.85rem', color: '#78909c' }}>{order.user?.email || 'N/A'}</div>
                                </td>
                                <td style={{ padding: '10px', fontFamily: 'monospace', fontSize: '0.9rem', color: '#1976d2' }}>{order.trackingNumber}</td>
                                <td style={{ padding: '10px', color: '#78909c' }}>{order.orderItems?.length || 0} items</td>
                                <td style={{ padding: '10px', fontWeight: 'bold', color: '#2e7d32' }}>Rs. {order.totalPrice?.toFixed(2)}</td>
                                <td style={{ padding: '10px' }}>
                                  <select
                                    value={order.orderStatus}
                                    onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                                    style={{
                                      padding: '6px 10px',
                                      borderRadius: '4px',
                                      border: '1px solid #bbdefb',
                                      background:
                                        order.orderStatus === 'Pending' ? '#fff3e0' :
                                          order.orderStatus === 'Booked' ? '#e3f2fd' :
                                            order.orderStatus === 'In Route' ? '#fff9c4' :
                                              '#e8f5e9',
                                      color:
                                        order.orderStatus === 'Pending' ? '#e65100' :
                                          order.orderStatus === 'Booked' ? '#1565c0' :
                                            order.orderStatus === 'In Route' ? '#f57f17' :
                                              '#2e7d32',
                                      fontWeight: '500',
                                      fontSize: '0.9rem',
                                      cursor: 'pointer',
                                      outline: 'none'
                                    }}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Booked">Booked</option>
                                    <option value="In Route">In Route</option>
                                    <option value="Delivered">Delivered</option>
                                  </select>
                                </td>
                                <td style={{ padding: '10px', color: '#78909c', fontSize: '0.9rem' }}>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ margin: 0, color: '#1565c0' }}>All Reviews</h3>
                    </div>
                    {loadingReviews ? (
                      <p style={{ textAlign: 'center', color: '#78909c' }}>Loading reviews...</p>
                    ) : reviews.length === 0 ? (
                      <EmptyState icon="⭐" title="No reviews yet" description="Customer reviews will appear here." />
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                          <thead>
                            <tr style={{ background: '#e3f2fd', color: '#1565c0', textAlign: 'left' }}>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Product</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Customer</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Rating</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Comment</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reviews.map(review => (
                              <tr key={review._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '10px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {review.product?.image && (
                                      <img src={review.product.image} alt={review.product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                    )}
                                    <span style={{ fontWeight: '500', color: '#455a64' }}>{review.product?.name || 'Deleted Product'}</span>
                                  </div>
                                </td>
                                <td style={{ padding: '10px' }}>
                                  <div style={{ fontWeight: '500', color: '#455a64' }}>{review.user?.name || 'Anonymous'}</div>
                                  <div style={{ fontSize: '0.85rem', color: '#78909c' }}>{review.user?.email || 'N/A'}</div>
                                </td>
                                <td style={{ padding: '10px' }}>
                                  <div style={{ color: '#ffa726', fontSize: '1.1rem' }}>
                                    {'⭐'.repeat(review.rating)}
                                  </div>
                                </td>
                                <td style={{ padding: '10px', color: '#455a64', maxWidth: '300px' }}>{review.comment}</td>
                                <td style={{ padding: '10px', color: '#78909c', fontSize: '0.9rem' }}>{format(new Date(review.createdAt), 'MMM dd, yyyy')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === 'customers' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ margin: 0, color: '#1565c0' }}>All Customers</h3>
                    </div>
                    {loadingCustomers ? (
                      <p style={{ textAlign: 'center', color: '#78909c' }}>Loading customers...</p>
                    ) : customers.length === 0 ? (
                      <EmptyState icon="👥" title="No customers yet" description="Customer data will appear here." />
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                          <thead>
                            <tr style={{ background: '#e3f2fd', color: '#1565c0', textAlign: 'left' }}>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Name</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Email</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Phone</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>City</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Address</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Registered</th>
                            </tr>
                          </thead>
                          <tbody>
                            {customers.map(customer => (
                              <tr key={customer._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '10px', fontWeight: '500', color: '#455a64' }}>{customer.user?.name || 'N/A'}</td>
                                <td style={{ padding: '10px', color: '#78909c' }}>{customer.user?.email || 'N/A'}</td>
                                <td style={{ padding: '10px', color: '#455a64' }}>{customer.phoneNumber}</td>
                                <td style={{ padding: '10px' }}><Badge>{customer.city}</Badge></td>
                                <td style={{ padding: '10px', color: '#78909c', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{customer.address}</td>
                                <td style={{ padding: '10px', color: '#78909c', fontSize: '0.9rem' }}>{format(new Date(customer.createdAt), 'MMM dd, yyyy')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === 'gift-wrapping' && (
                  <GiftWrappingManager />
                )}
                {activeTab === 'queries' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ margin: 0, color: '#1565c0' }}>User Queries</h3>
                    </div>
                    {loadingQueries ? (
                      <p style={{ textAlign: 'center', color: '#78909c' }}>Loading queries...</p>
                    ) : queries.length === 0 ? (
                      <EmptyState icon="💬" title="No queries yet" description="User messages will appear here." />
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                          <thead>
                            <tr style={{ background: '#e3f2fd', color: '#1565c0', textAlign: 'left' }}>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Name</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Email</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Subject</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Message</th>
                              <th style={{ padding: '12px', borderBottom: '2px solid #bbdefb' }}>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {queries.map(query => (
                              <tr key={query._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '10px', fontWeight: '500', color: '#455a64' }}>{query.name}</td>
                                <td style={{ padding: '10px', color: '#78909c' }}>{query.email}</td>
                                <td style={{ padding: '10px', color: '#455a64', fontWeight: 'bold' }}>{query.subject}</td>
                                <td style={{ padding: '10px', color: '#455a64', maxWidth: '300px' }}>{query.message}</td>
                                <td style={{ padding: '10px', color: '#78909c', fontSize: '0.9rem' }}>{format(new Date(query.createdAt), 'MMM dd, yyyy')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === 'reports' && (
                  <div className="reports-container">
                    <h3 style={{ margin: '0 0 20px 0', color: '#1565c0' }}>Business Analytics</h3>

                    {/* Key Metrics Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: '4px solid #4CAF50' }}>
                        <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Total Revenue</p>
                        <h2 style={{ margin: '5px 0 0 0', color: '#333' }}>
                          Rs. {stats?.overall?.totalRevenue?.toLocaleString() || orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0).toLocaleString()}
                        </h2>
                      </div>

                      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: '4px solid #2196F3' }}>
                        <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Total Orders</p>
                        <h2 style={{ margin: '5px 0 0 0', color: '#333' }}>{stats?.overall?.totalOrders || orders.length}</h2>
                      </div>

                      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: '4px solid #FF9800' }}>
                        <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Total Customers</p>
                        <h2 style={{ margin: '5px 0 0 0', color: '#333' }}>{customers.length}</h2>
                      </div>

                      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: '4px solid #9C27B0' }}>
                        <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Active Products</p>
                        <h2 style={{ margin: '5px 0 0 0', color: '#333' }}>{toys.length}</h2>
                      </div>
                    </div>

                    {/* Charts Section */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '30px' }}>

                      {/* Sales Chart */}
                      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', minHeight: '350px' }}>
                        <h4 style={{ margin: '0 0 20px 0', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Sales Trend (Last 7 Days)</h4>
                        <div style={{ height: '280px', width: '100%' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.dailySales?.map(d => ({ name: format(new Date(d._id), 'MMM dd'), sales: d.sales })) || salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rs ${value}`} />
                              <Tooltip
                                cursor={{ fill: '#f5f5f5' }}
                                formatter={(value) => [`Rs ${value.toLocaleString()}`, 'Revenue']}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                              />
                              <Bar dataKey="sales" fill="#1976D2" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Top Products Table (New) */}
                      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', minHeight: '350px' }}>
                        <h4 style={{ margin: '0 0 20px 0', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Top Selling Toys</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ textAlign: 'left', color: '#78909c', fontSize: '0.9rem' }}>
                              <th style={{ paddingBottom: '10px' }}>Toy Name</th>
                              <th style={{ paddingBottom: '10px', textAlign: 'right' }}>Sold</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stats?.topProducts?.map((p, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                <td style={{ padding: '12px 0', color: '#455a64', fontWeight: '500' }}>
                                  {i + 1}. {p.name}
                                </td>
                                <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 'bold', color: '#2e7d32' }}>
                                  {p.totalSold} units
                                </td>
                              </tr>
                            ))}
                            {!stats?.topProducts?.length && <tr><td colSpan="2" style={{ textAlign: 'center', padding: '20px', color: '#ccc' }}>No sales data yet</td></tr>}
                          </tbody>
                        </table>
                      </div>

                      {/* Status Chart */}
                      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', minHeight: '350px' }}>
                        <h4 style={{ margin: '0 0 20px 0', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Order Status Distribution</h4>
                        <div style={{ height: '280px', width: '100%' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {statusData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value, name) => [value, name]} itemStyle={{ color: '#333' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                              <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                      {/* Low Stock Alerts */}
                      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <h4 style={{ margin: '0 0 15px 0', borderBottom: '1px solid #eee', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          ⚠️ Low Stock Alerts <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#666' }}>(Less than 3)</span>
                        </h4>
                        {toys.filter(t => (t.countInStock !== undefined ? t.countInStock : t.copies) < 3).length === 0 ? (
                          <p style={{ color: '#4CAF50', fontStyle: 'italic' }}>All products are well stocked! ✅</p>
                        ) : (
                          <table style={{ width: '100%', fontSize: '0.9rem' }}>
                            <thead>
                              <tr style={{ textAlign: 'left', color: '#666' }}>
                                <th style={{ paddingBottom: '8px' }}>Product</th>
                                <th style={{ paddingBottom: '8px' }}>Stock</th>
                              </tr>
                            </thead>
                            <tbody>
                              {toys.filter(t => (t.countInStock !== undefined ? t.countInStock : t.copies) < 3).map(toy => (
                                <tr key={toy._id || toy.id} style={{ borderTop: '1px solid #f9f9f9' }}>
                                  <td style={{ padding: '8px 0' }}>{toy.name}</td>
                                  <td style={{ padding: '8px 0', color: '#d32f2f', fontWeight: 'bold' }}>
                                    {toy.countInStock !== undefined ? toy.countInStock : toy.copies} left
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- Normal User Dashboard ---
  return (
    <div className="page dashboard-page">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
      </div>

      <div className="dashboard-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {activeTab === 'borrowed' && (
          <section className="dashboard-section">
            {borrowedToys.length === 0 ? (
              <EmptyState
                icon={<span style={{ color: 'white' }}>🧸</span>}
                title="No toys borrowed yet"
                description="Start exploring our collection and borrow your first toy!"
                action={<Button variant="primary" onClick={() => navigate('/')}>Browse Toys</Button>}
              />
            ) : (
              <div className="books-list">
                {borrowedToys.map(r => (
                  <div key={r.id} className="reservation-card">
                    <div className="reservation-header">
                      <div className="reservation-info">
                        <h3>{r.user.name}</h3>
                        <p className="reservation-meta">Picked up: {format(new Date(r.pickedAt), 'MMM dd, yyyy')}</p>
                      </div>
                      <Badge variant="borrowed" className="status-badge status-borrowed">Borrowed</Badge>
                    </div>
                    <div className="borrowed-items">
                      {r.items.map(it => (
                        <BorrowedToyItem
                          key={it.toyId}
                          toy={toys.find(t => t.id === it.toyId)}
                          item={it}
                          onExtend={() => handleExtend(r.id, it.toyId)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'pending' && (
          <section className="dashboard-section">
            {pendingReservations.length === 0 ? (
              <EmptyState
                icon={<span style={{ color: 'white' }}>⏳</span>}
                title="No pending reservations"
                description="Reserve toys to pick them up later"
              />
            ) : (
              <div className="books-list">
                {pendingReservations.map(r => (
                  <div key={r.id} className="reservation-card">
                    <div className="reservation-header">
                      <div className="reservation-info">
                        <h3>{r.user.name}</h3>
                        <p className="reservation-meta">Reserved: {format(new Date(r.createdAt), 'MMM dd, yyyy')}</p>
                      </div>
                      <Badge variant="pending" className="status-badge status-pending">Pending Pickup</Badge>
                    </div>
                    <div className="pending-items">
                      {r.items.map(it => (
                        <PendingToyItem
                          key={it.toyId}
                          toy={toys.find(t => t.id === it.toyId)}
                          item={it}
                          pickupDate={it.pickupDate}
                        />
                      ))}
                    </div>
                    <div className="reservation-actions">
                      <Button variant="cancel" onClick={() => handleCancel(r.id)}>Cancel Reservation</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'history' && (
          <section className="dashboard-section">
            {reservations.length === 0 ? (
              <EmptyState
                icon={<span style={{ color: 'white' }}>📋</span>}
                title="No reservation history"
                description="Your reservation history will appear here"
              />
            ) : (
              <div className="history-list">
                {reservations.map(r => (
                  <div key={r.id} className="history-card">
                    <div className="history-header">
                      <div>
                        <h4>{r.user.name}</h4>
                        <p className="history-date">{format(new Date(r.createdAt), 'MMM dd, yyyy')}</p>
                      </div>
                      <Badge variant={r.status === 'pending' ? 'pending' : 'borrowed'} className={`status-badge status-${r.status}`}>
                        {r.status === 'pending' ? 'Pending' : r.status === 'picked-up' ? 'Active' : r.status}
                      </Badge>
                    </div>
                    <div className="history-books">
                      {r.items.map(it => {
                        const toy = toys.find(t => t.id === it.toyId)
                        const quantity = it.quantity || 1
                        return (
                          <div key={it.toyId} className="history-book">
                            • {toy?.title}
                            {quantity > 1 && <span className="history-quantity"> (×{quantity})</span>}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'wishlist' && (
          <section className="dashboard-section">
            {wishlist.length === 0 ? (
              <EmptyState
                icon={<span style={{ color: 'white' }}>❤️</span>}
                title="Your wishlist is empty"
                description="Add toys to your wishlist to save them for later"
                action={<Button variant="primary" onClick={() => navigate('/')}>Browse Toys</Button>}
              />
            ) : (
              <div className="wishlist-grid">
                {wishlist.map(id => {
                  const toy = toys.find(x => x.id === id)
                  if (!toy) return null
                  return <WishlistCard key={id} toy={toy} onViewDetails={() => navigate(`/toys/${toy.id}`)} />
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
