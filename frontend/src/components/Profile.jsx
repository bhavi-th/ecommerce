import { X, User, ShoppingBag, Settings, Bell, CreditCard, MapPin, Save, LogOut } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./Card"
import Button from "./Button"
import Badge from "./Badge"
import { useUser } from "../context/UserContext"
import { useState } from "react"

const Profile = ({ onClose }) => {
  const { user, updateUser, orders, settings, updateSettings } = useUser()
  const [activeTab, setActiveTab] = useState("profile")
  const [editMode, setEditMode] = useState(false)
  const [tempUser, setTempUser] = useState(user)

  const handleSave = () => {
    updateUser(tempUser)
    setEditMode(false)
  }

  const handleCancel = () => {
    setTempUser(user)
    setEditMode(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500"
      case "Shipped":
        return "bg-blue-500"
      case "Processing":
        return "bg-yellow-500"
      case "Cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl border-l bg-background shadow-lg">
        <Card className="h-full rounded-none border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <CardTitle>My Profile</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-5rem)] overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="flex border-b">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === "profile" && (
                <div className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-2xl font-bold">{user.name}</h3>
                      <p className="text-muted-foreground">{user.email}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Member since {user.memberSince}
                      </p>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">Personal Information</h4>
                      {!editMode ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditMode(true)}
                        >
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={handleCancel}>
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleSave}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Full Name</label>
                        <input
                          type="text"
                          value={editMode ? tempUser.name : user.name}
                          onChange={(e) => setTempUser({ ...tempUser, name: e.target.value })}
                          disabled={!editMode}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Email</label>
                        <input
                          type="email"
                          value={editMode ? tempUser.email : user.email}
                          onChange={(e) => setTempUser({ ...tempUser, email: e.target.value })}
                          disabled={!editMode}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Phone</label>
                        <input
                          type="tel"
                          value={editMode ? tempUser.phone : user.phone}
                          onChange={(e) => setTempUser({ ...tempUser, phone: e.target.value })}
                          disabled={!editMode}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </h4>
                    <div className="grid gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Street Address</label>
                        <input
                          type="text"
                          value={editMode ? tempUser.address : user.address}
                          onChange={(e) => setTempUser({ ...tempUser, address: e.target.value })}
                          disabled={!editMode}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">City</label>
                          <input
                            type="text"
                            value={editMode ? tempUser.city : user.city}
                            onChange={(e) => setTempUser({ ...tempUser, city: e.target.value })}
                            disabled={!editMode}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">ZIP Code</label>
                          <input
                            type="text"
                            value={editMode ? tempUser.zipCode : user.zipCode}
                            onChange={(e) => setTempUser({ ...tempUser, zipCode: e.target.value })}
                            disabled={!editMode}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Country</label>
                        <input
                          type="text"
                          value={editMode ? tempUser.country : user.country}
                          onChange={(e) => setTempUser({ ...tempUser, country: e.target.value })}
                          disabled={!editMode}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Order History</h4>
                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Card key={order.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h5 className="font-semibold">{order.id}</h5>
                                <p className="text-sm text-muted-foreground">{order.date}</p>
                              </div>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                            <div className="space-y-2 mb-3">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>{item.quantity}x {item.name}</span>
                                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between font-semibold pt-3 border-t">
                              <span>Total</span>
                              <span>${order.total.toFixed(2)}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Account Settings
                  </h4>

                  {/* Notifications */}
                  <div className="space-y-4">
                    <h5 className="font-medium flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Notifications
                    </h5>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm">Email notifications</span>
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => updateSettings({ emailNotifications: e.target.checked })}
                          className="h-4 w-4 rounded border-input"
                        />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm">Order updates</span>
                        <input
                          type="checkbox"
                          checked={settings.orderUpdates}
                          onChange={(e) => updateSettings({ orderUpdates: e.target.checked })}
                          className="h-4 w-4 rounded border-input"
                        />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm">Promotional emails</span>
                        <input
                          type="checkbox"
                          checked={settings.promotions}
                          onChange={(e) => updateSettings({ promotions: e.target.checked })}
                          className="h-4 w-4 rounded border-input"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="space-y-4">
                    <h5 className="font-medium flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Preferences
                    </h5>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Language</label>
                        <select
                          value={settings.language}
                          onChange={(e) => updateSettings({ language: e.target.value })}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Currency</label>
                        <select
                          value={settings.currency}
                          onChange={(e) => updateSettings({ currency: e.target.value })}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="CAD">CAD ($)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Logout */}
                  <div className="pt-4 border-t">
                    <Button variant="destructive" className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Profile
