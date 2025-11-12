"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import CartItemForOrderPage from "@/components/CartItemForOrderPage";
import intToIndianFormat from "@/lib/intToIndianFormat";
import Navbar from "@/components/Navbar";

const OrderPage = () => {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    city: "",
    state: "",
    pincode: "",
    houseNo: "",
    locality: "",
  });

  useEffect(() => {
    if (session) {
      if (session?.user?.email) {
        setEmail(session?.user?.email);
      }

      if (session?.user?.phone) {
        setEmail(session?.user?.phone + "@gmail.com");
      }
    }
  }, [session]);

  useEffect(() => {
    if (!email) return;

    const fetchUserCart = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/cart/user`,
          { email }
        );
        setCartItems(response.data.cartItems);
      } catch (error) {
        console.error("Error fetching user cart:", error);
      }
    };

    fetchUserCart();
  }, [email]);

  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.productPrice * item.quantity,
      0
    );
    setSubTotal(total);
  }, [cartItems]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/order", {
        name: orderDetails.name,
        order_email: orderDetails.email,
        phoneNumber: orderDetails.phone,
        street: orderDetails.address,
        city: orderDetails.city,
        state: orderDetails.state,
        pincode: orderDetails.pincode,
        locality: orderDetails.locality,
        cartItems: cartItems.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.productPrice,
          weight: item.weight,
          image: item.image,
        })),
        transactionId: "T" + Date.now(),
        email: email,
      });

      // console.log("Order submitted successfully:", response.data);
      // alert("Order placed successfully!");

      if (response.data.success) {
        window.location.href = response.data.checkoutPageUrl;
      }

      // Reset form and cart
      setOrderDetails({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        houseNo: "",
        locality: "",
      });

      setCartItems([]);
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to place the order. Please try again.");
    }
  };

  // const handlePayment = async () => {
  //   const data = {
  //     amount: subTotal,
  //     email,
  //     transactionId: "T" + Date.now(),
  //   };

  //   //backend req for gettingv final price of the full cart

  //   console.log("Payment Data:", data);

  //   try {
  //     const response = await axios.post("/api/order", data).then((response) => {
  //       if (
  //         response.data &&
  //         response.data.data.instrumentResponse.redirectInfo.url
  //       ) {
  //         window.location.href =
  //           response.data.data.instrumentResponse.redirectInfo.url;
  //       }
  //     });

  //     console.log("Payment Response:", response);
  //   } catch (err) {
  //     console.error("Error in payment:", err);
  //     alert("Error initiating payment. Please try again.");
  //   }
  // };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6">Complete Your Order</h1>
      <div className="grid md:grid-cols-2 gap-8 pt-4">
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={orderDetails.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={orderDetails.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={orderDetails.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={orderDetails.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="houseNo">House No.</Label>
                <Input
                  id="houseNo"
                  name="houseNo"
                  value={orderDetails.houseNo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="locality">Locality</Label>
                <Input
                  id="locality"
                  name="locality"
                  value={orderDetails.locality}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={orderDetails.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={orderDetails.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                name="pincode"
                value={orderDetails.pincode}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mt-8 p-4 border rounded-lg bg-gray-100">
              <h2 className="text-lg font-bold mb-2">Terms and Conditions</h2>
              <p className="pt-1">
                <strong>
                  Shipped and delivered within 15-20 days of order placement
                </strong>
              </p>
              <p className="pt-1">
                <strong>Cookies:</strong> We use cookies to enhance user
                experience. By using our site, you agree to our cookie policy.
              </p>
              <p className="pt-1">
                <strong>License:</strong> All intellectual property rights for
                this website belong to Anand Feeds. Personal use is permitted,
                but restrictions apply.
              </p>
            </div>

            <Button type="submit" className="w-full">
              Place Order
            </Button>
          </form>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="divide-y divide-gray-200">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <CartItemForOrderPage
                    key={item.productId}
                    productTitle={item.productTitle}
                    price={item.productPrice}
                    quantity={item.quantity}
                    weight={item.weight}
                    image={item.image}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Your cart is empty.
                </p>
              )}
            </ul>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <span className="font-semibold">Subtotal</span>
              <span className="font-bold">
                ₹{intToIndianFormat(subTotal)}/-
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
