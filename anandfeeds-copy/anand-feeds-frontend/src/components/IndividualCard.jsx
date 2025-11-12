"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ShoppingCart } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LoginModal from "./LoginModal";

const IndividualCard = ({
  title,
  description,
  features,
  images,
  price,
  priceOptions,
  product,
  addToCart,
  quantity,
  isVariableQuantity,
}) => {
  const { data: session } = useSession();
  const [open, setOpen]=useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedOption, setSelectedOption] = useState(
    priceOptions?.length > 0 ? priceOptions[0] : null
  );

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!session) {
      setOpen(true);
      return;
    }

    const selectedQty = selectedOption ? selectedOption.quantity : quantity;
    const selectedPrice = selectedOption ? selectedOption.price : price;

    if (!selectedQty) {
      alert("Please select a weight before adding to cart.");
      return;
    }

    await addToCart(product.id, selectedQty, selectedPrice, images[0]);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index) => setCurrentSlide(index),
  };

  return (
    <div className="mx-auto max-w-sm w-full bg-white border border-pink-400 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      <Link href={`/explore/${product.id}`} className="block">
        <div className="relative h-40 w-full overflow-hidden">
          <Slider {...settings}>
            {images && images.length > 0 ? (
              images.map((image, index) => (
                <div key={index} className="relative h-40 w-full">
                  <Image
                    src={image || "/placeholder.png"}
                    alt={`${title} - Image ${index + 1}`}
                    layout="fill"
                    objectFit="contain"
                    className="transition-transform duration-300 hover:scale-105"
                  />
                </div>
              ))
            ) : (
              <div className="relative h-40 w-full flex items-center justify-center bg-blue-200">
                <span className="text-blue-500">No Image Available</span>
              </div>
            )}
          </Slider>
        </div>
      </Link>

      <div className="p-4 flex-grow">
        <h3 className="text-xl font-bold text-pink-600 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>

        {features && features.length > 0 && (
          <ul className="list-disc list-inside mt-2 text-sm text-gray-600 space-y-1">
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="w-full p-4 border-t">
        {isVariableQuantity ? (
          priceOptions && priceOptions.length > 0 ? (
            <div className="flex items-center justify-between">
              <label
                htmlFor="weightSelect"
                className="text-sm font-medium text-gray-700"
              >
                Select Weight:
              </label>
              <select
                id="weightSelect"
                className="p-2 border border-pink-400 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-pink-400"
                value={selectedOption?.quantity || ""}
                onChange={(e) => {
                  e.stopPropagation();
                  const selected = priceOptions.find(
                    (opt) => opt.quantity == e.target.value
                  );
                  setSelectedOption(selected);
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="" disabled>
                  Select weight
                </option>
                {priceOptions.map((option) => (
                  <option key={option.id} value={option.quantity}>
                    {option.quantity} kg - ₹{option.price}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-sm text-red-500">No price options available.</p>
          )
        ) : (
          <div className="text-sm font-medium text-gray-700">
            <p>Quantity: {quantity} kg</p>
            <p>Price: ₹{price}</p>
          </div>
        )}
      </div>

      <div className="w-full bg-white p-4 border-t flex items-center justify-between">
        <span className="text-lg font-bold text-blue-600">
          ₹{selectedOption ? selectedOption.price : price || "N/A"}
        </span>
        <button
          onClick={handleAddToCart}
          className="px-4 py-2 bg-pink-500 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 flex items-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Add to cart
        </button>
      </div>
      {open ? <LoginModal open={open} setOpen={setOpen} /> : null}

    </div>
  );
};

export default IndividualCard;
