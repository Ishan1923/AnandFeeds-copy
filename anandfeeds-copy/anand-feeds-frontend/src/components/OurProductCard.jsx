"use client";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

const OurProductCard = ({ type, title, description, image }) => {
  return (
    <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xs xl:max-w-sm bg-white border border-pink-400 rounded-lg shadow-lg dark:bg-gray-900 dark:border-blue-500 flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 mt-2 mx-auto">
      {/* Product Image */}
      {image && (
        <Image
          className="w-full h-48 object-cover rounded-t-lg"
          src={image}
          width={500}
          height={400}
          alt={title}
          objectFit="contain"
        />
      )}

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex-grow flex flex-col items-center justify-center">
        <Link href={`/explore?category=${type}`}>
          <h5 className="mb-2 text-xl font-semibold text-pink-600 dark:text-pink-400 hover:text-blue-500 transition-colors duration-300 text-center sm:text-left">
            {title}
          </h5>
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
          {description}
        </p>
      </div>

      {/* Button */}
      <div className="p-4">
        <Link href={`/explore?category=${type}`} className="w-full">
          <Button className="w-full flex items-center justify-center bg-blue-500 hover:bg-pink-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 gap-2">
            <ShoppingBag />
            Shop Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OurProductCard;
