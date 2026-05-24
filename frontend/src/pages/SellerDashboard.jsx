import { useState, useEffect } from "react"
import { Package, Plus, Edit, Trash2, TrendingUp, DollarSign, ShoppingBag, ArrowRight, X, CheckCircle, Clock, Truck, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card"
import Button from "../components/Button"
import { useUser } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import { getSellerProducts, getSellerStats, createProduct, updateProduct, deleteProduct, getSellerOrders, updateOrderStatus, uploadImage } from "../services/api"

const SellerDashboard = () => {
  const navigate = useNavigate()
  const { user, isSeller } = useUser()
  const [activeTab, setActiveTab] = useState("products")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [sellerProducts, setSellerProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    totalSales: 0,
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
    totalOrders: 0
  })
  const [sellerOrders, setSellerOrders] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Electronics",
    description: "",
    image: "",
    stock: ""
  })

  const loadSellerProducts = async () => {
    if (user?.token) {
      try {
        setLoading(true)
        const products = await getSellerProducts(user.token)
        setSellerProducts(products)
      } catch (error) {
        console.error('Error loading seller products:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const loadSellerStats = async () => {
    if (user?.token) {
      try {
        const statsData = await getSellerStats(user.token)
        setStats(statsData)
      } catch (error) {
        console.error('Error loading seller stats:', error)
      }
    }
  }

  const loadSellerOrders = async () => {
    if (user?.token) {
      try {
        const orders = await getSellerOrders(user.token)
        setSellerOrders(orders)
      } catch (error) {
        console.error('Error loading seller orders:', error)
      }
    }
  }

  useEffect(() => {
    loadSellerProducts()
    loadSellerStats()
    loadSellerOrders()
  }, [user])

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

  const handleAddProduct = async () => {
    try {
      const newProduct = await createProduct({
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description,
        image: formData.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
        stock: parseInt(formData.stock)
      }, user.token)
      setSellerProducts([...sellerProducts, newProduct])
      setShowAddModal(false)
      setFormData({ name: "", price: "", category: "Electronics", description: "", image: "", stock: "" })
      setImageFile(null)
      setImagePreview("")
      loadSellerStats()
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Failed to add product: ' + error.message)
    }
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
    setImagePreview(product.image)
    setShowAddModal(true)
  }

  const handleUpdateProduct = async () => {
    try {
      const updatedProduct = await updateProduct(editingProduct.id, {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description,
        image: formData.image,
        stock: parseInt(formData.stock)
      }, user.token)
      setSellerProducts(sellerProducts.map(p =>
        p.id === editingProduct.id ? updatedProduct : p
      ))
      setShowAddModal(false)
      setEditingProduct(null)
      setFormData({ name: "", price: "", category: "Electronics", description: "", image: "", stock: "" })
      setImageFile(null)
      setImagePreview("")
      loadSellerStats()
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product: ' + error.message)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await deleteProduct(productId, user.token)
      setSellerProducts(sellerProducts.filter(p => p.id !== productId))
      loadSellerStats()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product: ' + error.message)
    }
  }

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status, user.token)
      loadSellerOrders()
      loadSellerStats()
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status: ' + error.message)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUpload = async () => {
    if (!imageFile) return

    try {
      setUploadingImage(true)
      const result = await uploadImage(imagePreview, user.token)
      setFormData({ ...formData, image: result.url })
      setUploadingImage(false)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image: ' + error.message)
      setUploadingImage(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'Processing':
        return <Package className="h-5 w-5 text-blue-500" />
      case 'Shipped':
        return <Truck className="h-5 w-5 text-purple-500" />
      case 'Delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'Cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const categories = ["Electronics", "Fashion", "Home", "Sports", "Beauty"]

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
                  <p className="text-2xl font-bold">{stats.totalProducts}</p>
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
                  <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
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
                  <p className="text-2xl font-bold">{stats.totalSales}</p>
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
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
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
            onClick={() => setActiveTab("orders")}
            className={`px-4 md:px-6 py-3 font-medium text-sm md:text-base transition-all duration-300 border-b-2 ${activeTab === "orders" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Orders
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

        {activeTab === "orders" && (
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-6">Orders for Your Products</h2>
            {sellerOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No orders yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {sellerOrders.map((order) => (
                  <Card key={order._id}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(order.status)}
                            <span className="font-semibold">{order.status}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Order ID: {order._id?.toString().slice(-8)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-lg font-bold">${order.totalPrice.toFixed(2)}</p>
                      </div>

                      <div className="space-y-3 mb-4">
                        {order.products.map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        {order.status === 'Pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateOrderStatus(order._id, 'Processing')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Verify & Process
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleUpdateOrderStatus(order._id, 'Cancelled')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}
                        {order.status === 'Processing' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateOrderStatus(order._id, 'Shipped')}
                          >
                            <Truck className="h-4 w-4 mr-1" />
                            Mark as Shipped
                          </Button>
                        )}
                        {order.status === 'Shipped' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateOrderStatus(order._id, 'Delivered')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark as Delivered
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
                    <span className="font-semibold">${stats.todayRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">This Week</span>
                    <span className="font-semibold">${stats.weekRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">This Month</span>
                    <span className="font-semibold">${stats.monthRevenue.toFixed(2)}</span>
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
                    setImageFile(null)
                    setImagePreview("")
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
                  <label className="text-sm font-medium mb-2 block">Product Image</label>

                  {/* Image Preview */}
                  {(imagePreview || formData.image) && (
                    <div className="mb-4">
                      <img
                        src={imagePreview || formData.image}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border-2 border-border"
                      />
                    </div>
                  )}

                  {/* File Upload */}
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="flex-1 rounded-xl border-2 border-border bg-muted/50 px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                      />
                      {imageFile && (
                        <Button
                          onClick={handleImageUpload}
                          disabled={uploadingImage}
                          className="whitespace-nowrap"
                        >
                          {uploadingImage ? "Uploading..." : "Upload"}
                        </Button>
                      )}
                    </div>

                    {/* Manual URL Input */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or enter image URL manually</span>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full rounded-xl border-2 border-border bg-muted/50 px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
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
