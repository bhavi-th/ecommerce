import { useState } from "react"
import { Package, Plus, Edit, Trash2, TrendingUp, DollarSign, ShoppingBag, ArrowRight, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card"
import Button from "../components/Button"
import { useUser } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import { products } from "../data/products"

const SellerDashboard = () => {
  const navigate = useNavigate()
  const { user, isSeller } = useUser()
  const [activeTab, setActiveTab] = useState("products")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [sellerProducts, setSellerProducts] = useState(products.slice(0, 10)) // Simulated seller products

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Electronics",
    description: "",
    image: "",
    stock: ""
  })

  if (!user || !isSeller) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">You need to be a seller to access this dashboard</p>
            <Button onClick={() => navigate("/profile")}>Go to Profile</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now(),
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      description: formData.description,
      image: formData.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
      rating: 4.5,
      stock: parseInt(formData.stock)
    }
    setSellerProducts([...sellerProducts, newProduct])
    setShowAddModal(false)
    setFormData({ name: "", price: "", category: "Electronics", description: "", image: "", stock: "" })
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      image: product.image,
      stock: product.stock
    })
    setShowAddModal(true)
  }

  const handleUpdateProduct = () => {
    setSellerProducts(sellerProducts.map(p => 
      p.id === editingProduct.id 
        ? { ...p, ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) }
        : p
    ))
    setShowAddModal(false)
    setEditingProduct(null)
    setFormData({ name: "", price: "", category: "Electronics", description: "", image: "", stock: "" })
  }

  const handleDeleteProduct = (productId) => {
    setSellerProducts(sellerProducts.filter(p => p.id !== productId))
  }

  const totalSales = sellerProducts.reduce((acc, p) => acc + (p.price * (100 - p.stock)), 0)
  const totalProducts = sellerProducts.length
  const totalRevenue = sellerProducts.reduce((acc, p) => acc + (p.price * (100 - p.stock)), 0)

  const categories = ["Electronics", "Clothing", "Home & Garden", "Sports", "Books"]

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Seller Dashboard</h1>
          <p className="text-muted-foreground">Manage your products and track sales</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                  <p className="text-2xl font-bold">{totalSales}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Growth</p>
                  <p className="text-2xl font-bold">+12%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 md:px-6 py-3 font-medium text-sm md:text-base transition-all duration-300 border-b-2 ${activeTab === "products" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 md:px-6 py-3 font-medium text-sm md:text-base transition-all duration-300 border-b-2 ${activeTab === "analytics" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Analytics
          </button>
        </div>

        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold">My Products</h2>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {sellerProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1 truncate">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold">Sales Analytics</h2>
            <Card>
              <CardHeader>
                <CardTitle>Recent Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Today's Sales</span>
                    <span className="font-semibold">$1,234.56</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">This Week</span>
                    <span className="font-semibold">$8,765.43</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">This Month</span>
                    <span className="font-semibold">$34,567.89</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => {
                    setShowAddModal(false)
                    setEditingProduct(null)
                    setFormData({ name: "", price: "", category: "Electronics", description: "", image: "", stock: "" })
                  }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border-2 border-border bg-muted/50 px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="Enter product name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Price</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full rounded-xl border-2 border-border bg-muted/50 px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Stock</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full rounded-xl border-2 border-border bg-muted/50 px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border-2 border-border bg-muted/50 px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-xl border-2 border-border bg-muted/50 px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all min-h-[100px]"
                    placeholder="Enter product description"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full rounded-xl border-2 border-border bg-muted/50 px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                >
                  {editingProduct ? "Update Product" : "Add Product"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default SellerDashboard
