import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { CartProvider } from "./context/CartContext"
import { UserProvider } from "./context/UserContext"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import ProductCard from "./components/ProductCard"
import { products } from "./data/products"
import Landing from "./pages/Landing"
import Home from "./pages/Home"
import Cart from "./pages/Cart"
import Profile from "./pages/Profile"

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const location = useLocation()

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const isShopPage = location.pathname === "/products"

  return (
    <div className="min-h-screen bg-background">
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
        <main className={`flex-1 ${isShopPage ? "md:ml-64" : ""} ${location.pathname === "/" ? "" : "p-6"}`}>
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
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
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
