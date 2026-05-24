import { createContext, useContext, useState, useEffect } from "react"
import { loginUser as loginUserAPI, registerUser as registerUserAPI, getUserOrders as getUserOrdersAPI } from "../services/api"

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
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("orders")
    return savedOrders ? JSON.parse(savedOrders) : []
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
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings))
  }, [settings])

  // Load orders from API when user logs in
  useEffect(() => {
    if (user?.token) {
      const loadOrders = async () => {
        try {
          const userOrders = await getUserOrdersAPI(user.token)
          setOrders(userOrders)
        } catch (error) {
          console.error('Error loading orders:', error)
        }
      }
      loadOrders()
    }
  }, [user])

  const login = async (credentials) => {
    try {
      const userData = await loginUserAPI(credentials)
      setUser(userData)
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message || 'Login failed' }
    }
  }

  const register = async (userData) => {
    try {
      const newUser = await registerUserAPI(userData)
      setUser(newUser)
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' }
    }
  }

  const logout = () => {
    setUser(null)
    setOrders([])
  }

  const updateUser = (newUserData) => {
    setUser({ ...user, ...newUserData })
  }

  const addOrder = (order) => {
    setOrders([order, ...orders])
  }

  const updateSettings = (newSettings) => {
    setSettings({ ...settings, ...newSettings })
  }

  const isSeller = user?.isSeller || false
  const isAdmin = user?.isAdmin || false

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
        orders,
        addOrder,
        settings,
        updateSettings,
        isSeller,
        isAdmin,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
