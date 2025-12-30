import React, { createContext, useContext, useEffect, useState } from 'react'
import { sampleToys } from '../utils/sampleData'
import { v4 as uuidv4 } from 'uuid'

const StoreContext = createContext(null)

const getLS = (key, fallback) => {
  const raw = localStorage.getItem(key)
  return raw ? JSON.parse(raw) : fallback
}

export const useStore = () => useContext(StoreContext)

export function StoreProvider({ children }) {
  const [toys, setToys] = useState(() => getLS('bn_toys', sampleToys))
  const [cart, setCart] = useState(() => getLS('bn_cart', []))
  const [reservations, setReservations] = useState(() => getLS('bn_reservations', []))
  const [wishlist, setWishlist] = useState([]) // Wishlist managed by database, not localStorage
  const [totalBorrowed, setTotalBorrowed] = useState(() => Number(localStorage.getItem('bn_totalBorrowed') || 0))

  const [user, setUser] = useState(() => getLS('bn_user', null))
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchToys();

    // Fetch wishlist if user is logged in (restored from localStorage)
    if (user && user._id) {
      fetchWishlist(user._id);
    }
  }, []);

  const fetchWishlist = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/users/${userId}/wishlist`);
      const data = await response.json();

      if (response.ok) {
        const wishlistIds = data.map(item =>
          typeof item === 'object' ? item._id : item
        );
        setWishlist(wishlistIds);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
    }
  };

  const fetchToys = async () => {
    try {
      // using 127.0.0.1 to avoid localhost resolution issues
      console.log('Fetching toys from DB...');
      const response = await fetch('http://127.0.0.1:5000/api/products');
      const data = await response.json();
      if (response.ok) {
        // Map backend countInStock to frontend copies for consistency
        const mappedData = data.map(toy => ({
          ...toy,
          copies: toy.countInStock !== undefined ? Number(toy.countInStock) : (Number(toy.copies) || 0),
          id: toy._id, // Ensure id is also set
        }));
        console.log(`Fetched ${mappedData.length} toys`);
        setToys(mappedData);
      } else {
        console.error("Failed to fetch toys response not ok", data);
      }
    } catch (error) {
      console.error("Failed to fetch toys", error);
    }
  };

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories from DB...');
      const response = await fetch('http://127.0.0.1:5000/api/categories');
      const data = await response.json();

      console.log('Categories response:', { ok: response.ok, status: response.status, data });

      if (response.ok) {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Categories data is not an array:", data);
          setCategories([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const addCategory = async (categoryData) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      const data = await response.json();
      if (response.ok) {
        setCategories(prev => [...prev, data]);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/categories/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setCategories(prev => prev.filter(c => c._id !== id));
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  const updateCategory = async (id, categoryData) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });
      const data = await response.json();
      if (response.ok) {
        setCategories(prev => prev.map(c => c._id === id ? data : c));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  useEffect(() => localStorage.setItem('bn_toys', JSON.stringify(toys)), [toys])
  useEffect(() => localStorage.setItem('bn_cart', JSON.stringify(cart)), [cart])
  useEffect(() => localStorage.setItem('bn_reservations', JSON.stringify(reservations)), [reservations])
  useEffect(() => localStorage.setItem('bn_totalBorrowed', String(totalBorrowed)), [totalBorrowed])
  // Wishlist is now managed by database, not localStorage
  useEffect(() => {
    if (user) localStorage.setItem('bn_user', JSON.stringify(user))
    else localStorage.removeItem('bn_user')
  }, [user])

  const login = async (email, password) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const newUser = {
          ...data,
          role: data.isAdmin ? 'admin' : 'user', // Map backend isAdmin to frontend role
        };
        setUser(newUser);

        // Set wishlist from user data (convert from full objects to just IDs if needed)
        if (data.wishlist) {
          const wishlistIds = data.wishlist.map(item =>
            typeof item === 'object' ? item._id : item
          );
          setWishlist(wishlistIds);
        }

        return { success: true, user: newUser };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  const logout = () => {
    setUser(null)
    setCart([]) // Clear cart on logout
    setWishlist([]) // Clear wishlist on logout
  }

  const register = async (name, email, password) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const newUser = {
          ...data,
          role: data.isAdmin ? 'admin' : 'user',
        };
        setUser(newUser);
        setWishlist(data.wishlist || []); // Initialize wishlist for new user
        return { success: true, user: newUser };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  const addToy = async (toyData) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...toyData, user: user?._id }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchToys();
        return { success: true, message: 'Toy added successfully!' }
      } else {
        return { success: false, message: data.message || 'Error adding toy' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  const deleteToy = async (toyId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/products/${toyId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        setToys(prev => prev.filter(t => t._id !== toyId));
        return { success: true, message: 'Toy deleted successfully' };
      } else {
        return { success: false, message: data.message || 'Error deleting toy' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  const updateToy = async (id, toyData) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toyData)
      });
      const data = await response.json();
      if (response.ok) {
        await fetchToys();
        return { success: true, message: 'Toy updated successfully' };
      } else {
        return { success: false, message: data.message || 'Error updating toy' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  const addToCart = (toyId) => {
    const toy = toys.find((t) => t.id === toyId || t._id === toyId)
    if (!toy) return { success: false, message: 'Toy not found' }

    // Check stock
    const stock = toy.countInStock !== undefined ? toy.countInStock : toy.copies
    if (stock <= 0) return { success: false, message: 'Toy is currently out of stock.' }

    // Check if already in cart
    if (cart.find((c) => c.toyId === toyId)) return { success: true, message: 'Toy already in cart', alreadyInCart: true }

    setCart((s) => [...s, { toyId, quantity: 1 }])
    return { success: true, message: 'Toy added to cart.' }
  }

  const removeFromCart = (toyId) => setCart((s) => s.filter((c) => c.toyId !== toyId))

  function updateCartQuantity(toyId, quantity) {
    const toy = toys.find((t) => t.id === toyId || t._id === toyId)
    if (!toy) return { success: false, message: 'Toy not found' }

    // Check available stock
    const stock = toy.countInStock !== undefined ? toy.countInStock : toy.copies

    // Only limit by stock, not arbitrary number
    const maxQuantity = stock
    const newQuantity = Math.max(1, Math.min(quantity, maxQuantity))

    setCart((s) => s.map((c) => c.toyId === toyId ? { ...c, quantity: newQuantity } : c))
    return { success: true, quantity: newQuantity }
  }

  function isInCart(toyId) {
    return cart.some((c) => c.toyId === toyId)
  }

  const toggleWishlist = async (toyId) => {
    // Check if user is logged in
    if (!user) {
      alert('Please login to add items to your wishlist');
      return { success: false, message: 'Please login to add items to your wishlist' };
    }

    try {
      const isInWishlist = wishlist.includes(toyId);

      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(`http://127.0.0.1:5000/api/users/${user._id}/wishlist/${toyId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const updatedWishlist = await response.json();
          const wishlistIds = updatedWishlist.map(item =>
            typeof item === 'object' ? item._id : item
          );
          setWishlist(wishlistIds);
          return { success: true, message: 'Removed from wishlist' };
        } else {
          return { success: false, message: 'Failed to remove from wishlist' };
        }
      } else {
        // Add to wishlist
        const response = await fetch(`http://127.0.0.1:5000/api/users/${user._id}/wishlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId: toyId }),
        });

        if (response.ok) {
          const updatedWishlist = await response.json();
          const wishlistIds = updatedWishlist.map(item =>
            typeof item === 'object' ? item._id : item
          );
          setWishlist(wishlistIds);
          return { success: true, message: 'Added to wishlist' };
        } else {
          return { success: false, message: 'Failed to add to wishlist' };
        }
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      return { success: false, message: error.message };
    }
  }

  function confirmReservation(reservationData) {
    const id = uuidv4()
    const itemsWithDue = reservationData.items.map((it) => {
      const pickup = new Date(it.pickupDate)
      const due = new Date(pickup)
      due.setDate(due.getDate() + Number(it.duration))
      return { ...it, dueDate: due.toISOString(), extended: false, status: 'pending' }
    })
    const created = { id, ...reservationData, items: itemsWithDue, status: 'pending', createdAt: new Date().toISOString() }
    setReservations((s) => [created, ...s])
    setToys((prev) => prev.map((t) => {
      const reservedItem = reservationData.items.find((it) => it.toyId === t.id)
      if (reservedItem) {
        const quantity = reservedItem.quantity || 1
        const newCopies = Math.max(0, t.copies - quantity)
        return { ...t, copies: newCopies, availability: newCopies > 0 ? 'Available' : 'Reserved' }
      }
      return t
    }))
    setCart([])
    return id
  }

  function pickupReservation(reservationId) {
    const resv = reservations.find((r) => r.id === reservationId)
    if (!resv) return { success: false, message: 'Reservation not found' }
    if (resv.status !== 'pending') return { success: false, message: 'Reservation already processed' }
    const updated = { ...resv, status: 'picked-up', pickedAt: new Date().toISOString() }
    updated.items = updated.items.map((it) => ({ ...it, status: 'borrowed', borrowedAt: new Date().toISOString() }))
    setReservations((s) => s.map((r) => (r.id === reservationId ? updated : r)))
    setToys((prev) => prev.map((t) => {
      const borrowedItem = updated.items.find((it) => it.toyId === t.id)
      return borrowedItem ? { ...t, availability: 'Borrowed' } : t
    }))
    setTotalBorrowed((n) => n + (updated.items ? updated.items.length : 0))
    return { success: true, message: 'Marked as picked up' }
  }

  function extendBorrowing(reservationId, toyId) {
    const resv = reservations.find((r) => r.id === reservationId)
    if (!resv) return { success: false, message: 'Reservation not found' }
    const item = resv.items.find((it) => it.toyId === toyId)
    if (!item) return { success: false, message: 'Toy not found in reservation' }
    if (item.extended) return { success: false, message: 'Extension already used for this toy' }
    if (item.status !== 'borrowed') return { success: false, message: 'Can only extend after pickup (borrowed)' }
    if (reservations.some((r) => r.id !== reservationId && r.items.some((it) => it.toyId === toyId))) return { success: false, message: 'Cannot extend: another reservation exists for this toy' }
    item.extended = true
    const due = new Date(item.dueDate)
    due.setDate(due.getDate() + 7)
    item.dueDate = due.toISOString()
    setReservations((s) => s.map((r) => r.id === reservationId ? { ...resv } : r))
    return { success: true, message: 'Borrowing extended by 7 days', dueDate: item.dueDate }
  }

  function cancelReservation(reservationId) {
    const res = reservations.find((r) => r.id === reservationId)
    if (!res) return { success: false, message: 'Reservation not found' }
    if (res.status !== 'pending') return { success: false, message: 'Only pending reservations can be cancelled' }
    setToys((prev) => prev.map((t) => {
      const returnedItem = res.items.find((it) => it.toyId === t.id)
      if (returnedItem) {
        const quantity = returnedItem.quantity || 1
        return { ...t, copies: t.copies + quantity, availability: 'Available' }
      }
      return t
    }))
    setReservations((s) => s.filter((r) => r.id !== reservationId))
    return { success: true, message: 'Reservation cancelled and copies restored' }
  }


  const addReview = async (productId, rating, comment) => {
    try {
      if (!user) {
        return { success: false, message: 'Please login to add a review' };
      }

      const response = await fetch(`http://127.0.0.1:5000/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, comment, userId: user._id }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, review: data };
      } else {
        return { success: false, message: data.message || 'Failed to add review' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  const fetchReviews = async (productId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/products/${productId}/reviews`);
      const data = await response.json();

      if (response.ok) {
        return { success: true, reviews: data };
      } else {
        return { success: false, reviews: [] };
      }
    } catch (error) {
      console.error('Failed to fetch reviews', error);
      return { success: false, reviews: [] };
    }
  }

  // Order Management Functions
  const createOrder = async (orderData) => {
    try {
      if (!user) {
        return { success: false, message: 'Please login to place an order' };
      }

      const { customerInfo, cart, itemsPrice, shippingPrice, totalPrice, giftWrapping, giftWrappingPrice } = orderData;

      // Prepare order items
      const orderItems = cart.map(c => {
        const toy = toys.find(t => (t._id || t.id) === c.toyId);
        return {
          name: toy?.name || toy?.title,
          qty: c.quantity,
          image: toy?.image || toy?.cover,
          price: toy?.price || 0,
          product: toy?._id || toy?.id
        };
      });

      const response = await fetch('http://127.0.0.1:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: user._id,
          customerInfo: {
            phoneNumber: customerInfo.phoneNumber,
            address: customerInfo.address,
            city: customerInfo.city,
            postalCode: customerInfo.postalCode
          },
          orderItems,
          shippingAddress: {
            address: customerInfo.address,
            city: customerInfo.city,
            postalCode: customerInfo.postalCode,
            country: 'Pakistan'
          },
          phoneNumber: customerInfo.phoneNumber,
          itemsPrice,
          shippingPrice,
          giftWrapping,
          giftWrappingPrice,
          totalPrice
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear cart after successful order
        setCart([]);
        // Refresh toys to update stock quantities
        await fetchToys();
        return { success: true, orderId: data._id, trackingNumber: data.trackingNumber };
      } else {
        return { success: false, message: data.message || 'Failed to create order' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  const getOrderById = async (orderId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/orders/${orderId}`);
      const data = await response.json();

      if (response.ok) {
        return { success: true, order: data };
      } else {
        return { success: false, message: data.message || 'Order not found' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  const getOrderByTrackingNumber = async (trackingNumber) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/orders/track/${trackingNumber}`);
      const data = await response.json();

      if (response.ok) {
        return { success: true, order: data };
      } else {
        return { success: false, message: data.message || 'Order not found' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  const getOrderTracking = async (orderId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/orders/${orderId}/tracking`);
      const data = await response.json();

      if (response.ok) {
        return { success: true, tracking: data };
      } else {
        return { success: false, tracking: [] };
      }
    } catch (error) {
      console.error('Failed to fetch tracking', error);
      return { success: false, tracking: [] };
    }
  }

  const updateOrderStatus = async (orderId, status, notes) => {
    try {
      if (!user || !user.isAdmin) {
        return { success: false, message: 'Admin access required' };
      }

      const response = await fetch(`http://127.0.0.1:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes, updatedBy: user._id }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, order: data.order };
      } else {
        return { success: false, message: data.message || 'Failed to update order status' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  const getAllOrders = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/orders');
      const data = await response.json();

      if (response.ok) {
        return { success: true, orders: data };
      } else {
        return { success: false, orders: [] };
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
      return { success: false, orders: [] };
    }
  }

  // Admin Functions
  const getAllReviews = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/reviews');
      const data = await response.json();

      if (response.ok) {
        return { success: true, reviews: data };
      } else {
        return { success: false, reviews: [] };
      }
    } catch (error) {
      console.error('Failed to fetch reviews', error);
      return { success: false, reviews: [] };
    }
  }

  const getAllCustomers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/customers/all');
      const data = await response.json();

      if (response.ok) {
        return { success: true, customers: data };
      } else {
        return { success: false, customers: [] };
      }
    } catch (error) {
      console.error('Failed to fetch customers', error);
      return { success: false, customers: [] };
    }
  }

  const submitQuery = async (queryData) => {
    try {
      if (!user) {
        return { success: false, message: 'Please login to submit a query' };
      }

      const response = await fetch('http://127.0.0.1:5000/api/queries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(queryData),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, query: data };
      } else {
        return { success: false, message: data.message || 'Failed to submit query' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  const getAllQueries = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/queries');
      const data = await response.json();

      if (response.ok) {
        return { success: true, queries: data };
      } else {
        return { success: false, queries: [] };
      }
    } catch (error) {
      console.error('Failed to fetch queries', error);
      return { success: false, queries: [] };
    }
  }

  // --- Admin Stats Fetch ---
  const getAdminStats = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/orders/stats');
      const data = await response.json();
      if (response.ok) {
        return { success: true, stats: data };
      } else {
        return { success: false, stats: null };
      }
    } catch (error) {
      console.error('Failed to fetch admin stats', error);
      return { success: false, stats: null };
    }
  }

  // --- User Management (Admin) ---
  const getAllUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/users');
      const data = await response.json();
      if (response.ok) {
        return { success: true, users: data };
      } else {
        return { success: false, users: [] };
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
      return { success: false, users: [] };
    }
  }

  const adminAddUser = async (userData) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, message: 'User created' };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  const adminUpdateUser = async (id, userData) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, message: 'User updated' };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  const adminDeleteUser = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/users/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        return { success: true, message: 'User deleted' };
      } else {
        const data = await response.json();
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  const value = {
    user,
    login,
    logout,
    register,
    addToy,
    deleteToy,
    updateToy,
    toys, // was books
    cart, // contains toyId
    wishlist,
    reservations,
    totalBorrowed,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    isInCart,
    toggleWishlist,
    confirmReservation,
    cancelReservation,
    pickupReservation,
    extendBorrowing,
    categories,
    fetchCategories,
    addCategory,
    deleteCategory,
    updateCategory,
    addReview,
    fetchReviews,
    createOrder,
    getOrderById,
    getOrderByTrackingNumber,
    getOrderTracking,
    updateOrderStatus,
    getAllOrders,
    getAllReviews,
    getAllCustomers,
    submitQuery,
    getAllQueries,
    getAdminStats,
    getAllUsers,
    adminAddUser,
    adminUpdateUser,
    adminDeleteUser,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export default StoreContext
