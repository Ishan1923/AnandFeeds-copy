"use client";

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';

const CARD_OPTIONS = {
	iconStyle: "solid",
	style: {
		base: {
			iconColor: "#c4f0ff",
			color: "#fff",
			fontWeight: 500,
			fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
			fontSize: "16px",
			fontSmoothing: "antialiased",
			":-webkit-autofill": { color: "#fce883" },
			"::placeholder": { color: "#87bbfd" }
		},
		invalid: {
			iconColor: "#ffc7ee",
			color: "#ffc7ee"
		}
	}
}

const PaymentForm = () => {
    const [success, setSuccess] = useState(false);

    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)
        });
        if (!error) {
            try {
                const { id } = paymentMethod;
                // Send request to the backend with amount and id
                const response = await fetch('/api/payment/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ amount: 38361, id: id })
                })
                console.log(id);
                setSuccess(true);
            } catch (error) {
                
            }
        }
    }

  return (
    <div>
        {!success ?
        <form onSubmit={handleSubmit}>
            <fieldset className='FormGroup'>
                <div className="FormRow">
                    <CardElement options={CARD_OPTIONS} />
                </div>
            </fieldset>
            <button>Pay</button>
        </form>
        :
        <div>
            <h2>Purchase successful!</h2>
        </div>
        }
    </div>
  )
}

export default PaymentForm