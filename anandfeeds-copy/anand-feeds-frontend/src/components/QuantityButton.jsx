"use client";

import React, { useState } from 'react'

const QuantityButton = ({ quantity, setQuantity }) => {
  return (
    <div className='flex w-full items-start flex-col'>
        <p className='text-start'>Quantity</p>
        <div class="w-full py-2 px-3 inline-block bg-white border border-gray-200 rounded-lg dark:bg-slate-900 dark:border-gray-700" data-hs-input-number>
            <div class="flex items-center gap-x-1.5 justify-between">
                <button onClick={() => {
                    if (!quantity || quantity === 1) setQuantity(parseInt(1));
                    else setQuantity(parseInt(quantity)-1);
                }} type="button" class="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-input-number-decrement>
                    <svg class="flex-shrink-0 w-3.5 h-3.5" xmlns="https://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
                </button>
                <input class="p-0 w-full bg-transparent border-0 text-gray-800 text-center focus:ring-0 dark:text-white" type="number" value={quantity} data-hs-input-number-input onChange={(e) => setQuantity(e.target.value)} />
                <button onClick={() => {
                    if (!quantity) setQuantity(parseInt(1));
                    else setQuantity(parseInt(quantity)+1);
                }} type="button" class="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-input-number-increment>
                    <svg class="flex-shrink-0 w-3.5 h-3.5" xmlns="https://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </button>
            </div>
        </div>
    </div>
  )
}

export default QuantityButton