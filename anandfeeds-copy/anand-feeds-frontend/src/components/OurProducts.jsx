"use client";
import React, { useState, useEffect } from "react";
import OurProductCard from "./OurProductCard";

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI;

const OurProducts = () => {
  const [products, setProducts] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/our-products?populate=*`
        );
        const data = await res.json();
        setProducts(data.data);
        console.log(data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="mt-8 mb-2" id="products">
      <h2 className="text-5xl font-bold font-sans uppercase text-center bg-gradient-to-b from-pink-500 to-indigo-600 bg-clip-text text-transparent">OUR PRODUCTS</h2>

      <div className="featured-cards flex mt-5 gap-10 xl:flex-row flex-col">
        {products &&
          products.length > 0 &&
          products.map((product) => (
            <OurProductCard
              key={product.id}
              title={product.title}
              type={product.type}
              description={product.description}
              image={strapiUrl + product.image.url}
            />
          ))}
      </div>
    </div>
  );
};

export default OurProducts;
