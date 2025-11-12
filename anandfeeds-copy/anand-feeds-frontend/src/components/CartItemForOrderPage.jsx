"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
const CartItemForOrderPage = ({ productTitle, price, quantity, weight, image}) => {
  
  return (
    <div>
      <li className="flex py-6">
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
          <Image src={image} alt="Product Image" width={96} height={96} className="object-cover"/>
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
              Qty-<span className="font-bold">{quantity}</span> {" "}
              Current weight- {weight ?  <span className="font-bold">{weight}Kg </span>: <span className="font-bold">-</span>} 
            </p>
            
          </div>
        </div>
      </li>
    </div>
  );
};

export default CartItemForOrderPage;
