// hooks/useCart.js
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "../components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/cart-context";



export default function useCartIndividual() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [reload, setReload] = useState(false);
  const {refreshCart } = useCart();

  useEffect(() => {
    if (session) {
      if (session.user?.email) {
        setEmail(session.user.email);
      } else if (session.user?.phone) {
        setEmail(session.user.phone + "@gmail.com");
      }
    }
  }, [session]);

  const addToCart = async (productId, selectedQty, selectedPrice, image) => {
    if (!email) {
      alert("Please log in to add to cart");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/carts/`,
        {
          email,
          product: productId,
          quantity: selectedQty,
          price: selectedPrice,
          image,
        }
      );

      if (response.status === 200) {
        toast({
          title: "Item successfully added to cart",
          variant: "success",
          className: "bg-green-500 text-white",
        });
        // setReload((prev) => !prev)
        // ;
        refreshCart()
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast({
        title: "Item could not be added to cart",
        variant: "error",
        className: "bg-red-500 text-white",
      });
    }
  };

  return { addToCart, reload };
}
