import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card"
import Button from "../components/Button"
import { useCart } from "../context/CartContext"
import { useUser } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import { useIntersectionObserver } from "../hooks/useIntersectionObserver"

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart()
  const { user } = useUser()
  const navigate = useNavigate()
  const [titleRef, titleVisible] = useIntersectionObserver({ threshold: 0.1 })
  const [cartItemsRef, cartItemsVisible] = useIntersectionObserver({ threshold: 0.1 })
  const [summaryRef, summaryVisible] = useIntersectionObserver({ threshold: 0.1 })

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Please sign in to view your cart</p>
            <Button onClick={() => navigate("/login")}>Sign In</Button>
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
                  <span>{cartTotal > 100 ? 'Free' : '$10.00'}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm lg:text-base">
                  <span>Tax (10%)</span>
                  <span>${(cartTotal * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm md:text-base lg:text-lg font-bold border-t pt-3">
                  <span>Total</span>
                  <span>${(cartTotal * 1.1 + (cartTotal > 100 ? 0 : 10)).toFixed(2)}</span>
                </div>
                <Button
                  className="w-full group relative overflow-hidden text-xs md:text-sm lg:text-base"
                  size="lg"
                  onClick={() => navigate("/checkout")}
                >
                  <span className="relative z-10">Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
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
