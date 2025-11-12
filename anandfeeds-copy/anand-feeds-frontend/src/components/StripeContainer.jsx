"use client";

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react'
import PaymentForm from './PaymentForm';

const PUBLIC_KEY = "pk_test_51LOzc5SIXBIR3SJ5KEMT0uBwy089CqFDX5S64mtdDSPPWlFtzYmbmHIUfXhfvMf5Dvls8Eu0zBkp39NmRjJ828MN00ovA53vaX";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

const StripeContainer = () => {
  return (
    <div className="checkout-container">
      <h1 className='text-3xl'>Checkout</h1>
      <Elements stripe={stripeTestPromise}>
          <PaymentForm />
      </Elements>
    </div>
  )
}

export default StripeContainer