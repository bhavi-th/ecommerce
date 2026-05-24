import { useState, useEffect } from "react"
import { ArrowLeft, ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, Minus, Plus } from "lucide-react"
import { Card, CardContent } from "../components/Card"
import Button from "../components/Button"
import { useCart } from "../context/CartContext"
import { useUser } from "../context/UserContext"
import { useNavigate, useParams } from "react-router-dom"
import { getProducts } from "../services/api"

const ProductDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { addToCart } = useCart()
  const { user } = useUser()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = await getProducts()
        const foundProduct = products.find(p => p.id === parseInt(id))
        setProduct(foundProduct)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching product:', error)
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login")
      return
    }

    if (product) {
      try {
        for (let i = 0; i < quantity; i++) {
          await addToCart(product)
        }
      } catch (error) {
        if (error.message === 'Authentication required') {
          navigate("/login")
        }
      }
    }
  }

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Product not found</p>
            <Button onClick={() => navigate("/products")}>Back to Products</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const images = [product.image, product.image, product.image] // In a real app, these would be different images

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === index ? "border-primary" : "border-border hover:border-primary/50"
                    }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-primary font-medium mb-2">{product.category}</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground text-sm">({product.rating} rating)</span>
              </div>
              <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Stock Status */}
            <div className={`flex items-center gap-2 ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-600" : "bg-red-600"}`} />
              <span className="font-medium">
                {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
              </span>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border-2 border-border rounded-xl">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-accent transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-3 hover:bg-accent transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                className="flex-1 h-14 text-lg"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-14 w-14 rounded-xl"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-sm text-muted-foreground">On orders over $100</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Secure Payment</p>
                  <p className="text-sm text-muted-foreground">100% secure checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <RotateCcw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Easy Returns</p>
                  <p className="text-sm text-muted-foreground">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
