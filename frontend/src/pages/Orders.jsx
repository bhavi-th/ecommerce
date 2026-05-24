import { Package, CheckCircle, Clock, Truck, XCircle, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card"
import Button from "../components/Button"
import { useUser } from "../context/UserContext"
import { useNavigate } from "react-router-dom"

const Orders = () => {
  const navigate = useNavigate()
  const { user, orders } = useUser()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Please sign in to view your orders</p>
            <Button onClick={() => navigate("/login")}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "Shipped":
        return <Truck className="h-5 w-5 text-blue-500" />
      case "Cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "Pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      case "Shipped":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "Cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
              <Button onClick={() => navigate("/products")}>
                Browse Products
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="overflow-hidden">
                <CardHeader className="border-b border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">Order #{order._id.slice(-8)}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.products.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>

                    {/* Order Details */}
                    <div className="border-t border-border pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Items Total</span>
                        <span>${order.itemsPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span>${order.taxPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>{order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                        <span>Total</span>
                        <span>${order.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                      <div className="border-t border-border pt-4">
                        <p className="text-sm font-medium mb-2">Shipping Address</p>
                        <p className="text-sm text-muted-foreground">
                          {order.shippingAddress.address}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                          {order.shippingAddress.country}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
