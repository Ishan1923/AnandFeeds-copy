"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "axios";
import { useSession } from "next-auth/react";
import IndividualCard from "./IndividualCard";
import { toast } from "./ui/use-toast";
import { useCart } from "../context/cart-context";

const HotProducts = ({ reload, setreloadCartFromHotProduct }) => {
  const [hotProducts, setHotProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const { refreshCart } = useCart()

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI;

  useEffect(() => {
    const fetchHotProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/products?populate=*&filters[isHotProduct][$eq]=true`
        );
        const data = await res.json();
        setHotProducts(data.data);
        console.log(data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchHotProducts();
  }, []);

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
          image: image,
        }
      );
      // setreloadCartFromHotProduct(!reload);
      
      toast({
        title: "Item successfully added to cart",
        variant: "success",
        className: "bg-green-500 text-white",
      });
      refreshCart();
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast({
        title: "Item could not be added to cart",
        variant: "error",
        className: "bg-red-500 text-white",
      });
    }
    finally{
      refreshCart()
    }
  };

  return (
    <>
      {hotProducts && (
        <div className="hot-products mt-12" id="hotproducts">
          <h2 className="text-4xl font-bold font-sans uppercase text-center bg-gradient-to-b from-pink-500 to-indigo-600 bg-clip-text text-transparent">
            Hot Products
          </h2>
          {/* <div className="p-1 flex flex-wrap items-center justify-center"> */}
          <section
            id="Projects"
            className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5"
          >
            {hotProducts &&
              hotProducts.length > 0 &&
              hotProducts.map((product) => (
                <IndividualCard
                  key={product.id}
                  title={product.name}
                  description={product.description?.description}
                  features={product.description?.features}
                  images={
                    product.image && product.image.length > 0
                      ? product.image.map(
                          (img) => strapiUrl + img.formats.thumbnail.url
                        )
                      : ["/default-image.jpg"]
                  }
                  price={product.price ? product.price : "N/A"}
                  priceOptions={product.price_options || []}
                  addToCart={addToCart}
                  product={product}
                  quantity={product.quantity || "-"}
                  isVariableQuantity={product.isVariableQuantity}
                />
              ))}
          </section>
          {/* </div> */}
        </div>
      )}
    </>
  );
};

export default HotProducts;
