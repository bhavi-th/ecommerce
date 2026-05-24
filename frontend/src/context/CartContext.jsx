import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "./UserContext"
import { addToCart as addToCartAPI, removeFromCart as removeFromCartAPI, getCart as getCartAPI, getProducts } from "../services/api"

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export const CartProvider = ({ children }) => {
  const { user } = useUser()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await getProducts()
        setProducts(productsData)
      } catch (error) {
        console.error('Error loading products:', error)
      }
    }
    loadProducts()
  }, [])

  // Load cart from API if user is logged in
  useEffect(() => {
    if (user?.token) {
      const loadCart = async () => {
        try {
          setLoading(true)
          const apiCart = await getCartAPI(user.token)
          if (apiCart.products) {
            // Convert API cart format to frontend format with product details
            const frontendCart = apiCart.products.map(item => {
              const product = products.find(p => p.id === item.product)
              return {
                id: item.product,
                quantity: item.quantity,
                name: product?.name || '',
                price: product?.price || 0,
                image: product?.image || '',
                description: product?.description || '',
                category: product?.category || '',
                stock: product?.stock || 0,
                rating: product?.rating || 0
              }
            })
            setCart(frontendCart)
          }
        } catch (error) {
          console.error('Error loading cart:', error)
        } finally {
          setLoading(false)
        }
      }
      loadCart()
    } else {
      setCart([])
    }
  }, [user, products])

  const addToCart = async (product) => {
    if (!user?.token) {
      throw new Error('Authentication required')
    }

    try {
      await addToCartAPI(product.id, 1, user.token)
      // Reload cart from API
      const apiCart = await getCartAPI(user.token)
      if (apiCart.products) {
        const frontendCart = apiCart.products.map(item => {
          const productData = products.find(p => p.id === item.product)
          return {
            id: item.product,
            quantity: item.quantity,
            name: productData?.name || '',
            price: productData?.price || 0,
            image: productData?.image || '',
            description: productData?.description || '',
            category: productData?.category || '',
            stock: productData?.stock || 0,
            rating: productData?.rating || 0
          }
        })
        setCart(frontendCart)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  }

  const removeFromCart = async (productId) => {
    if (!user?.token) {
      return
    }

    try {
      await removeFromCartAPI(productId, user.token)
      const apiCart = await getCartAPI(user.token)
      if (apiCart.products) {
        const frontendCart = apiCart.products.map(item => {
          const productData = products.find(p => p.id === item.product)
          return {
            id: item.product,
            quantity: item.quantity,
            name: productData?.name || '',
            price: productData?.price || 0,
            image: productData?.image || '',
            description: productData?.description || '',
            category: productData?.category || '',
            stock: productData?.stock || 0,
            rating: productData?.rating || 0
          }
        })
        setCart(frontendCart)
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
    }
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const cartTotal = cart.reduce(
    (total, item) => total + (item.price || 0) * item.quantity,
    0
  )

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
