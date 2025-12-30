import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import { StoreProvider } from './context/StoreContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ToyDetails from './pages/ToyDetails'
import Checkout from './pages/Checkout'
import Cart from './pages/Cart'

import Confirmation from './pages/Confirmation'
import OrderTracking from './pages/OrderTracking'
import Dashboard from './pages/Dashboard'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AddToy from './pages/AddToy'
import AddCategory from './pages/AddCategory'
import CategoryPage from './pages/CategoryPage'
import About from './pages/About'
import Wishlist from './pages/Wishlist'
import GiftWrappingManager from './pages/GiftWrappingManager'
import UserOrders from './pages/UserOrders'
function App() {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')

  return (
    <StoreProvider>
      <div className="app-root">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/toys/:id" element={<ToyDetails />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/my-orders" element={<UserOrders />} />
            <Route path="/checkout" element={<Checkout />} />

            <Route path="/confirmation/:id" element={<Confirmation />} />
            <Route path="/track-order" element={<OrderTracking />} />
            <Route path="/track-order/:id" element={<OrderTracking />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/add-toy" element={<AddToy />} />
            <Route path="/add-category" element={<AddCategory />} />
            <Route path="/admin/gift-wrapping" element={<GiftWrappingManager />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {!isDashboard && <Footer />}
      </div>
    </StoreProvider>
  )
}

export default App
