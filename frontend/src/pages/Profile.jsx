import { User, ShoppingBag, Settings, Bell, CreditCard, MapPin, Save, LogOut, CheckCircle, Clock, Truck, XCircle, Package, ArrowRight, Store } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card"
import Button from "../components/Button"
import Badge from "../components/Badge"
import { useUser } from "../context/UserContext"
import { useState } from "react"
import { useIntersectionObserver } from "../hooks/useIntersectionObserver"
import { useNavigate } from "react-router-dom"
import { updateUserProfile } from "../services/api"

const Profile = () => {
  const navigate = useNavigate()
  const { user, updateUser, orders, settings, updateSettings, logout, isSeller } = useUser()
  const [activeTab, setActiveTab] = useState("profile")
  const [editMode, setEditMode] = useState(false)
  const [tempUser, setTempUser] = useState(user)
  const [headerRef, headerVisible] = useIntersectionObserver({ threshold: 0.1 })
  const [tabsRef, tabsVisible] = useIntersectionObserver({ threshold: 0.1 })
  const [contentRef, contentVisible] = useIntersectionObserver({ threshold: 0.1 })

  const handleSave = () => {
    updateUser(tempUser)
    setEditMode(false)
  }

  const handleCancel = () => {
    setTempUser(user)
    setEditMode(false)
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleToggleSeller = async () => {
    try {
      const updatedUser = await updateUserProfile({ isSeller: !isSeller }, user.token)
      updateUser(updatedUser)
    } catch (error) {
      console.error('Error updating seller status:', error)
    }
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

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Please sign in to view your profile</p>
            <Button onClick={() => navigate("/login")}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className={`text-2xl md:text-3xl font-bold mb-4 md:mb-6 transition-all duration-700 ${headerVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-8'}`} ref={headerRef}>
        {isSeller ? "Seller Dashboard" : "Buyer Dashboard"}
      </h1>

      {/* Tabs */}
      <div className={`flex border-b mb-4 md:mb-6 overflow-x-auto ${tabsVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-4'}`} ref={tabsRef} style={{ animationDelay: '0.1s' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 font-medium text-sm md:text-base transition-all duration-300 border-b-2 hover:scale-105 flex-shrink-0 ${activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div ref={contentRef}>
        {activeTab === "profile" && (
          <div className="space-y-4 md:space-y-6">
            {/* Avatar Section */}
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-4 md:gap-6">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 rounded-full object-cover transition-transform duration-300 hover:scale-110 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold truncate">{user.name}</h3>
                    <p className="text-muted-foreground text-sm md:text-base truncate">{user.email}</p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                      Member since {user.memberSince}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg md:text-xl">Personal Information</CardTitle>
                  {!editMode ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditMode(true)}
                      className="hover:scale-105 transition-transform"
                    >
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCancel} className="hover:scale-105 transition-transform">
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave} className="hover:scale-105 transition-transform">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="grid gap-3 md:gap-4">
                  <div>
                    <label className="text-xs md:text-sm font-medium mb-1 block">Full Name</label>
                    <input
                      type="text"
                      value={editMode ? tempUser.name : user.name}
                      onChange={(e) => setTempUser({ ...tempUser, name: e.target.value })}
                      disabled={!editMode}
                      className="w-full rounded-md border-2 border-border bg-background px-3 py-2 text-sm disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs md:text-sm font-medium mb-1 block">Email</label>
                    <input
                      type="email"
                      value={editMode ? tempUser.email : user.email}
                      onChange={(e) => setTempUser({ ...tempUser, email: e.target.value })}
                      disabled={!editMode}
                      className="w-full rounded-md border-2 border-border bg-background px-3 py-2 text-sm disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs md:text-sm font-medium mb-1 block">Phone</label>
                    <input
                      type="tel"
                      value={editMode ? tempUser.phone : user.phone}
                      onChange={(e) => setTempUser({ ...tempUser, phone: e.target.value })}
                      disabled={!editMode}
                      className="w-full rounded-md border-2 border-border bg-background px-3 py-2 text-sm disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary transition-all duration-200"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <MapPin className="h-4 w-4" />
                  Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:gap-4">
                  <div>
                    <label className="text-xs md:text-sm font-medium mb-1 block">Street Address</label>
                    <input
                      type="text"
                      value={editMode ? tempUser.address : user.address}
                      onChange={(e) => setTempUser({ ...tempUser, address: e.target.value })}
                      disabled={!editMode}
                      className="w-full rounded-md border-2 border-border bg-background px-3 py-2 text-sm disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary transition-all duration-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="text-xs md:text-sm font-medium mb-1 block">City</label>
                      <input
                        type="text"
                        value={editMode ? tempUser.city : user.city}
                        onChange={(e) => setTempUser({ ...tempUser, city: e.target.value })}
                        disabled={!editMode}
                        className="w-full rounded-md border-2 border-border bg-background px-3 py-2 text-sm disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium mb-1 block">ZIP Code</label>
                      <input
                        type="text"
                        value={editMode ? tempUser.zipCode : user.zipCode}
                        onChange={(e) => setTempUser({ ...tempUser, zipCode: e.target.value })}
                        disabled={!editMode}
                        className="w-full rounded-md border-2 border-border bg-background px-3 py-2 text-sm disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs md:text-sm font-medium mb-1 block">Country</label>
                    <input
                      type="text"
                      value={editMode ? tempUser.country : user.country}
                      onChange={(e) => setTempUser({ ...tempUser, country: e.target.value })}
                      disabled={!editMode}
                      className="w-full rounded-md border-2 border-border bg-background px-3 py-2 text-sm disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary transition-all duration-200"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Account */}
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Store className="h-4 w-4" />
                  Seller Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Become a Seller</p>
                    <p className="text-sm text-muted-foreground">Enable seller mode to manage products</p>
                  </div>
                  <Button
                    variant={isSeller ? "default" : "outline"}
                    onClick={handleToggleSeller}
                  >
                    {isSeller ? "Seller Enabled" : "Enable Seller"}
                  </Button>
                </div>
                {isSeller && (
                  <div className="pt-4 border-t border-border">
                    <Button
                      className="w-full"
                      onClick={() => navigate("/seller-dashboard")}
                    >
                      <Store className="h-4 w-4 mr-2" />
                      Go to Seller Dashboard
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold">Order History</h2>
            {orders.length === 0 ? (
              <Card className="animate-scale-in">
                <CardContent className="flex flex-col items-center justify-center py-10 md:py-12 text-muted-foreground px-4">
                  <Package className="h-10 w-10 md:h-12 md:w-12 mb-3 md:mb-4 opacity-50 animate-float" />
                  <p className="text-sm md:text-base">No orders yet</p>
                  <p className="text-xs md:text-sm mb-4">Start shopping to see your orders here</p>
                  <Button onClick={() => navigate("/products")}>
                    Browse Products
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {orders.map((order, index) => (
                  <Card
                    key={order._id}
                    className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
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
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-xl md:text-2xl font-bold">Account Settings</h2>

            {/* Notifications */}
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Bell className="h-4 w-4" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm md:text-base group-hover:text-primary transition-colors">Email notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => updateSettings({ emailNotifications: e.target.checked })}
                    className="h-4 w-4 rounded border-input transition-transform hover:scale-110"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm md:text-base group-hover:text-primary transition-colors">Order updates</span>
                  <input
                    type="checkbox"
                    checked={settings.orderUpdates}
                    onChange={(e) => updateSettings({ orderUpdates: e.target.checked })}
                    className="h-4 w-4 rounded border-input transition-transform hover:scale-110"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm md:text-base group-hover:text-primary transition-colors">Promotional emails</span>
                  <input
                    type="checkbox"
                    checked={settings.promotions}
                    onChange={(e) => updateSettings({ promotions: e.target.checked })}
                    className="h-4 w-4 rounded border-input transition-transform hover:scale-110"
                  />
                </label>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <CreditCard className="h-4 w-4" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs md:text-sm font-medium mb-1 block">Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => updateSettings({ language: e.target.value })}
                    className="w-full rounded-md border-2 border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary transition-all duration-200"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium mb-1 block">Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => updateSettings({ currency: e.target.value })}
                    className="w-full rounded-md border-2 border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:border-primary transition-all duration-200"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Logout */}
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-4 md:p-6">
                <Button variant="destructive" className="w-full hover:scale-105 transition-transform group relative overflow-hidden" onClick={handleLogout}>
                  <span className="relative z-10">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-destructive/0 via-destructive/20 to-destructive/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div >
  )
}

export default Profile
