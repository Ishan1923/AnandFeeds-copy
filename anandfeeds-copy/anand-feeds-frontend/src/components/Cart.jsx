"use client"

import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "./ui/button"
import CartItem from "./CartItem"
import intToIndianFormat from "../lib/intToIndianFormat"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"

const Cart = ({ searchParams }) => {
  const { data: session } = useSession()
  const router = useRouter()
  const { cartItems, subTotal, refreshCart } = useCart()

  const [email, setEmail] = useState("")
  const [open, setOpen] = useState(false)
  const [deleteCard, setDeleteCard] = useState(false)

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
    if (deleteCard) {
      refreshCart()
      setDeleteCard(false)
    }
  }, [deleteCard, refreshCart])

  const handlePayment = async () => {
    const data = {
      amount: subTotal,
      email,
      transactionId: "T" + Date.now(),
    }

    //backend req for gettingv final price of the full cart

    console.log("Payment Data:", data)

    try {
      const response = await axios.post("/api/order", data).then((response) => {
        if (response.data && response.data.data.instrumentResponse.redirectInfo.url) {
          window.location.href = response.data.data.instrumentResponse.redirectInfo.url
        }
      })

      console.log("Payment Response:", response)
    } catch (err) {
      console.error("Error in payment:", err)
      alert("Error initiating payment. Please try again.")
    }
  }

  const handleOrderPage = () => {
    router.push("/order")
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button variant="outline">
          <ShoppingCart />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>This is your shopping cart. You can checkout directly from here.</SheetDescription>
          <div className="sheet-body">
            <div className="mt-8">
              <div className="flow-root">
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <CartItem
                        key={item.productId}
                        productTitle={item.productTitle}
                        price={item.productPrice}
                        quantity={item.quantity}
                        setdeleteCard={setDeleteCard}
                        deleteCard={deleteCard}
                        weight={item.weight}
                        // image={item.image}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 text-center">Your cart is empty.</p>
                  )}
                </ul>
              </div>
            </div>

            {/* { Bottom Part } */}
            <div className="border-t border-gray-200 px-4 py-6 sm:px-6 mt-4">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>₹{intToIndianFormat(subTotal)}/-</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
              <div className="mt-6 flex w-full">
                <Button
                  // onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-pink-500 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-pink-700"
                  onClick={handleOrderPage}
                >
                  Checkout
                </Button>
              </div>
              <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                <p>
                  or{" "}
                  <button type="button" className="font-medium text-pink-500 hover:text-pink-700">
                    Continue Shopping
                    <span aria-hidden="true"> &rarr;</span>
                  </button>
                </p>
              </div>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default Cart
