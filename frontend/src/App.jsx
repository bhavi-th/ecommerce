import { useState, useEffect, useMemo } from "react"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { CartProvider } from "./context/CartContext"
import { UserProvider } from "./context/UserContext"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import ProductCard from "./components/ProductCard"
import ScrollProgress from "./components/ScrollProgress"
import { getProducts } from "./services/api"
import Landing from "./pages/Landing"
import Home from "./pages/Home"
import Cart from "./pages/Cart"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Checkout from "./pages/Checkout"
import Orders from "./pages/Orders"
import SellerDashboard from "./pages/SellerDashboard"
import ProductDetails from "./pages/ProductDetails"

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching products:', error)
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Force reset state when navigating to products page
  useEffect(() => {
    if (location.pathname === "/products") {
      setSelectedCategory("all")
      setSearchQuery("")
    }
  }, [location.pathname])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery, products])

  const isShopPage = location.pathname === "/products"

  return (
    <div className="min-h-screen bg-background animate-page-fade-in">
      <ScrollProgress />
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="flex">
        {isShopPage && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onCategoryChange={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
        )}
        <main className={`flex-1 ${isShopPage ? "md:ml-64" : ""} ${location.pathname === "/" ? "" : "p-4 md:p-6"}`}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/products"
              element={
                <Home
                  filteredProducts={filteredProducts}
                  selectedCategory={selectedCategory}
                  searchQuery={searchQuery}
                />
              }
            />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/seller-dashboard" element={<SellerDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </UserProvider>
  )
}

export default App
