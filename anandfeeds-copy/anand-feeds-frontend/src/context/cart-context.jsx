"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"

const CartContext = createContext(undefined)

export const CartProvider = ({ children }) => {
  const { data: session } = useSession()
  const [email, setEmail] = useState("")
  const [cartItems, setCartItems] = useState([])
  const [subTotal, setSubTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (session) {
      if (session?.user?.email) {
        setEmail(session?.user?.email)
      }

      if (session?.user?.phone) {
        setEmail(session?.user?.phone + "@gmail.com")
      }
    }
  }, [session])

  useEffect(() => {
    const fetchUserCart = async (email) => {
      setIsLoading(true)
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/cart/user`, { email })
        const data = response.data
        setCartItems(data.cartItems)
      } catch (error) {
        console.error("Error fetching user cart:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (email) {
      fetchUserCart(email)
    }
  }, [email, refreshTrigger])

  useEffect(() => {
    let total = 0
    cartItems.forEach((item) => {
      total += item.productPrice * item.quantity
    })
    setSubTotal(total)
  }, [cartItems])

  const refreshCart = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return <CartContext.Provider value={{ cartItems, subTotal, refreshCart, isLoading }}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
