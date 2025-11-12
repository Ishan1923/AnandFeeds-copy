import React from 'react';
import StripeContainer from '../../components/StripeContainer';
import './index.css';

const page = () => {
  return (
    <div>
        {/* <StripeContainer /> */}
        <form>
          <script src="https://checkout.razorpay.com/v1/payment-button.js" data-payment_button_id="pl_NFjQQw2Ymt7YeS" async></script>
        </form>
    </div>
  )
}

export default page