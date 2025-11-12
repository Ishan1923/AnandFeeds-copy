"use client";

import React, { useEffect, useState } from "react";
import intToIndianFormat from "../lib/intToIndianFormat";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { toast } from "./ui/use-toast";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios"; // ✅ Import Axios
import { Trash2 } from "lucide-react";

const CartItem = ({
  productTitle,
  price,
  quantity,
  setdeleteCard,
  deleteCard,
  weight,
  image,
}) => {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");

   useEffect(() => {
      if (session) {
        if(session?.user?.email) {
          setEmail(session?.user?.email);   
        }
  
        if(session?.user?.phone) {
          setEmail(session?.user?.phone + "@gmail.com"); 
        }
      }
    }, [session]);

  const removeProduct = async () => {
    console.log("Clicked product Name:", productTitle);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/cart/remove`,
        {
          email,
          productTitle,
        }
      );
      if (response.status === 200) {
        toast({
          title: "Item removed",
          description: "The item has been removed from your cart successfully.",
          variant: "success",
          className: "bg-green-500 text-white",
        });

        setdeleteCard(!deleteCard);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast({
        title: "Error occured",
        description: "The item could be removed.",
        variant: "error",
        className: "bg-red-500 text-white",
      });
    }
  };

  return (
    <div>
      <li className="flex py-6">
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
          <Image
            src={image}
            alt="Product Image"
            width={96}
            height={96}
            className="object-cover"
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between text-base font-medium text-gray-900">
              <h3>{productTitle}</h3>
              <div className="flex">
                <p className="ml-4 font-light text-[13px]">₹ {price}/-</p>
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm mx-2">
            <p className="text-gray-500">
              Qty-<span className="font-bold">{quantity}</span> Current weight-{" "}
              {weight ? (
                <span className="font-bold">{weight}Kg </span>
              ) : (
                <span className="font-bold">10kg</span>
              )}
            </p>
            <div className="flex">
              <button
                type="button"
                className="font-sm text-pink-500 hover:text-pink-700 flex items-center gap-2"
                onClick={removeProduct}
              >
                {" "}
                <Trash2 />
              </button>
            </div>
          </div>
        </div>
      </li>
    </div>
  );
};

export default CartItem;
