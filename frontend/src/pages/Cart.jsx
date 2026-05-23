import { Plus, Minus, Trash2, CreditCard, MapPin, CheckCircle, ShoppingBag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card"
import Button from "../components/Button"
import { useCart } from "../context/CartContext"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useIntersectionObserver } from "../hooks/useIntersectionObserver"

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [showCheckout, setShowCheckout] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [titleRef, titleVisible] = useIntersectionObserver({ threshold: 0.1 })
  const [cartItemsRef, cartItemsVisible] = useIntersectionObserver({ threshold: 0.1 })
  const [summaryRef, summaryVisible] = useIntersectionObserver({ threshold: 0.1 })
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCheckout = (e) => {
    e.preventDefault()
    setOrderPlaced(true)
    clearCart()
    setTimeout(() => {
      setOrderPlaced(false)
      setShowCheckout(false)
      navigate("/")
    }, 3000)
  }

  if (orderPlaced) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] px-4">
        <Card className="w-full max-w-md p-6 md:p-8 text-center animate-scale-in">
          <CheckCircle className="h-12 w-12 md:h-16 md:w-16 text-green-500 mx-auto mb-3 md:mb-4 animate-bounce-slow" />
          <h3 className="text-xl md:text-2xl font-bold mb-2">Order Placed!</h3>
          <p className="text-muted-foreground text-sm md:text-base mb-3 md:mb-4">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          <p className="text-xs md:text-sm text-muted-foreground">
            Redirecting you back to the store...
          </p>
        </Card>
      </div>
    )
  }

  if (showCheckout) {
    return (
      <div className="max-w-2xl mx-auto px-4 animate-page-fade-in">
        <button
          onClick={() => setShowCheckout(false)}
          className="text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors hover:translate-x-[-4px] inline-block"
        >
          ← Back to Cart
        </button>
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Checkout</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCheckout} className="space-y-4 md:space-y-6">
              <div className="space-y-3 md:space-y-4">
                <h3 className="font-semibold flex items-center gap-2 text-sm md:text-base">
                  <MapPin className="h-4 w-4" />
                  Shipping Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs md:text-sm font-medium mb-1 block">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full rounded-md border-2 border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary transition-all duration-200"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-xs md:text-sm font-medium mb-1 block">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded-md border-2 border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary transition-all duration-200"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs md:text-sm font-medium mb-1 block">Address</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full rounded-md border-2 border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary transition-all duration-200"
                      placeholder="123 Main St"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs md:text-sm font-medium mb-1 block">City</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-2 border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary transition-all duration-200"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium mb-1 block">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        required
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-2 border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary transition-all duration-200"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                <h3 className="font-semibold flex items-center gap-2 text-sm md:text-base">
                  <CreditCard className="h-4 w-4" />
                  Payment Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs md:text-sm font-medium mb-1 block">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      required
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="w-full rounded-md border-2 border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary transition-all duration-200"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs md:text-sm font-medium mb-1 block">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        required
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-2 border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary transition-all duration-200"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium mb-1 block">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        required
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-2 border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary transition-all duration-200"
                        placeholder="123"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2 md:space-y-3">
                <div className="flex justify-between text-sm md:text-base">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span>Tax</span>
                  <span>${(cartTotal * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base md:text-lg font-bold border-t pt-3">
                  <span>Total</span>
                  <span>${(cartTotal * 1.08).toFixed(2)}</span>
                </div>
              </div>

              <Button type="submit" className="w-full group relative overflow-hidden text-sm md:text-base" size="lg">
                <span className="relative z-10">
                  Place Order - ${(cartTotal * 1.08).toFixed(2)}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className={`text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 transition-all duration-700 ${titleVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-8'}`} ref={titleRef}>
        Shopping Cart ({cart.length})
      </h1>
      {cart.length === 0 ? (
        <Card className="animate-scale-in">
          <CardContent className="flex flex-col items-center justify-center py-10 md:py-12 text-muted-foreground px-4">
            <ShoppingBag className="h-10 w-10 md:h-12 md:w-12 lg:h-16 lg:w-16 mb-3 md:mb-4 opacity-50 animate-float" />
            <p className="text-sm md:text-base lg:text-lg mb-2">Your cart is empty</p>
            <p className="text-xs md:text-sm mb-4">Add some products to get started</p>
            <Button onClick={() => navigate("/")} className="hover:scale-105 transition-transform">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          <div className={`lg:col-span-2 space-y-2 md:space-y-3 ${cartItemsVisible ? 'animate-fade-in' : 'opacity-0'}`} ref={cartItemsRef}>
            {cart.map((item, index) => (
              <Card
                key={item.id}
                className={`hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${cartItemsVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-4'}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-3 md:p-4">
                  <div className="flex gap-3 md:gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 object-cover rounded-md transition-transform duration-300 hover:scale-105 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm md:text-base truncate">{item.name}</h4>
                      <p className="text-xs md:text-sm text-muted-foreground mb-2">
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 hover:scale-110 transition-transform"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-5 md:w-6 lg:w-8 text-center font-medium text-xs md:text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 hover:scale-110 transition-transform"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 ml-auto text-destructive hover:scale-110 transition-transform"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div ref={summaryRef}>
            <Card className={`sticky top-16 md:top-20 hover:shadow-xl transition-shadow duration-300 ${summaryVisible ? 'animate-slide-in-right opacity-100' : 'opacity-0 translate-x-8'}`}>
              <CardHeader>
                <CardTitle className="text-base md:text-lg lg:text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 md:space-y-3 lg:space-y-4">
                <div className="flex justify-between text-xs md:text-sm lg:text-base">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm lg:text-base">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm lg:text-base">
                  <span>Tax</span>
                  <span>${(cartTotal * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm md:text-base lg:text-lg font-bold border-t pt-3">
                  <span>Total</span>
                  <span>${(cartTotal * 1.08).toFixed(2)}</span>
                </div>
                <Button
                  className="w-full group relative overflow-hidden text-xs md:text-sm lg:text-base"
                  size="lg"
                  onClick={() => setShowCheckout(true)}
                >
                  <span className="relative z-10">Proceed to Checkout</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
