import { useState } from "react"
import { MapPin, CreditCard, Truck, Shield, ArrowRight, ShoppingBag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card"
import Button from "../components/Button"
import { useCart } from "../context/CartContext"
import { useUser } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import { createOrder } from "../services/api"

const Checkout = () => {
  const navigate = useNavigate()
  const { cart, cartTotal, clearCart } = useCart()
  const { user, addOrder } = useUser()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "United States",
    paymentMethod: "Card"
  })
  const [errors, setErrors] = useState({})

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Please sign in to checkout</p>
            <Button onClick={() => navigate("/login")}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={() => navigate("/products")}>Browse Products</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required"
    if (!formData.country.trim()) newErrors.country = "Country is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      navigate("/login")
      return
    }

    if (!validateForm()) return

    setLoading(true)

    try {
      const orderData = {
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod
      }

      const order = await createOrder(orderData, user.token)
      addOrder(order)
      clearCart()
      navigate("/orders")
    } catch (error) {
      console.error('Error creating order:', error)
    } finally {
      setLoading(false)
    }
  }

  const taxPrice = cartTotal * 0.1
  const shippingPrice = cartTotal > 100 ? 0 : 10
  const totalPrice = cartTotal + taxPrice + shippingPrice

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={() => navigate("/products")}>Continue Shopping</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className={`w-full rounded-xl border-2 border-border bg-muted/50 px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all ${errors.address ? 'border-destructive' : ''}`}
                      placeholder="Street address"
                    />
                    {errors.address && <p className="text-destructive text-xs mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className={`w-full rounded-xl border-2 border-border bg-muted/50 px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all ${errors.city ? 'border-destructive' : ''}`}
                        placeholder="City"
                      />
                      {errors.city && <p className="text-destructive text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Postal Code</label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className={`w-full rounded-xl border-2 border-border bg-muted/50 px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all ${errors.postalCode ? 'border-destructive' : ''}`}
                        placeholder="Postal code"
                      />
                      {errors.postalCode && <p className="text-destructive text-xs mt-1">{errors.postalCode}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Country</label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className={`w-full rounded-xl border-2 border-border bg-muted/50 px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all ${errors.country ? 'border-destructive' : ''}`}
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                    </select>
                    {errors.country && <p className="text-destructive text-xs mt-1">{errors.country}</p>}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-border rounded-xl cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Card"
                      checked={formData.paymentMethod === "Card"}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-4 h-4 text-primary"
                    />
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border-2 border-border rounded-xl cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="PayPal"
                      checked={formData.paymentMethod === "PayPal"}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-4 h-4 text-primary"
                    />
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">PayPal</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>${taxPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span>Free shipping on orders over $100</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Secure payment processing</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-105 rounded-xl h-11"
                  disabled={loading || !user}
                >
                  {loading ? 'Processing...' : user ? 'Place Order' : 'Sign in to Checkout'}
                  {!loading && user && <ArrowRight className="h-4 w-4 ml-2" />}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
