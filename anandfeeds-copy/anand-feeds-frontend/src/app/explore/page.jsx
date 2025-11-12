"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";
import "./index.css";
import { useSession } from "next-auth/react";
import axios from "axios";
import IndividualCard from "../../components/IndividualCard";
import Cart from "../../components/Cart";
import { toast } from "../../components/ui/use-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { useCart } from "@/context/cart-context";

const Page = () => {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI;
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const { data: session } = useSession();
  const [reload, setReload] = useState(false);

  const [email, setEmail] = useState("");
  const { refreshCart } = useCart()

  const getProducts = async () => {
    try {
      if (products.length > 0) return;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/products?populate=*&filters[category][name][$eq]=${category}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const json = await response.json();
      setProducts(json.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    if (category) getProducts();
  }, [category, reload]);

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

      if (response.status === 200) {
        // setCartItems((prev) => [...prev, response.data.cartItem]);
        toast({
          title: "Item successfully added to cart",
          variant: "success",
          className: "bg-green-500 text-white",
        });
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

  return (
    <div>
      <Navbar reloadCart={reload} />
      <div className="filters flex m-auto w-fit gap-4 mt-16 "></div>
      <section
        id="Products"
        className="explore-section mx-10 w-fit  grid justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5"
      >
        {products.length > 0 ? (
          products.map((product) => (
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
              addToCart={addToCart ? addToCart : () => {}}
              product={product}
              quantity={product.quantity || "-"}
              isVariableQuantity={product.isVariableQuantity}
            />
          ))
        ) : (
          <></>
        )}
      </section>

      {products.length === 0 && (
        <div className="flex justify-center items-center h-screen">
          <ClipLoader
            color="#FFC0CB"
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
    </div>
  );
};

export default Page;
