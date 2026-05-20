import { createContext, useContext, useState, useEffect } from "react"

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user")
    return savedUser ? JSON.parse(savedUser) : {
      name: "John Doe",
      email: "john@example.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      phone: "+1 234 567 8900",
      address: "123 Main St",
      city: "New York",
      zipCode: "10001",
      country: "United States",
      memberSince: "January 2024",
    }
  })

  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("orders")
    return savedOrders ? JSON.parse(savedOrders) : [
      {
        id: "ORD-001",
        date: "2024-01-15",
        status: "Delivered",
        total: 299.97,
        items: [
          { name: "Wireless Headphones", quantity: 1, price: 99.99 },
          { name: "Smart Watch", quantity: 1, price: 199.99 },
        ],
      },
      {
        id: "ORD-002",
        date: "2024-02-20",
        status: "Shipped",
        total: 79.99,
        items: [
          { name: "Running Shoes", quantity: 1, price: 79.99 },
        ],
      },
    ]
  })

  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("settings")
    return savedSettings ? JSON.parse(savedSettings) : {
      emailNotifications: true,
      orderUpdates: true,
      promotions: false,
      language: "en",
      currency: "USD",
    }
  })

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user))
  }, [user])

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings))
  }, [settings])

  const updateUser = (newUserData) => {
    setUser({ ...user, ...newUserData })
  }

  const addOrder = (order) => {
    setOrders([order, ...orders])
  }

  const updateSettings = (newSettings) => {
    setSettings({ ...settings, ...newSettings })
  }

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        orders,
        addOrder,
        settings,
        updateSettings,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
