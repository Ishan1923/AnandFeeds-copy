"use client"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import axios from "axios"
import { useSession } from "next-auth/react"


const AddToCartButton = ({ productId, productTitle, productPrice, weight = "" }: AddToCartButtonProps) => {
  const { refreshCart } = useCart()
  const { data: session } = useSession()

  const handleAddToCart = async () => {
    if (!session) {
      alert("Please login to add items to cart")
      return
    }

    const email = session?.user?.email || (session?.user?.phone ? session?.user?.phone + "@gmail.com" : "")

    if (!email) {
      alert("User email not found")
      return
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/cart/add`, {
        email,
        productId,
        productTitle,
        productPrice,
        quantity: 1,
        weight,
      })

      // Refresh the cart after adding the item
      refreshCart()

      alert("Product added to cart successfully!")
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Failed to add product to cart. Please try again.")
    }
  }

  return <Button onClick={handleAddToCart}>Add to Cart</Button>
}

export default AddToCartButton
