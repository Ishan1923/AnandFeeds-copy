"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  Share2,
  Star,
  Truck,
} from "lucide-react";

import ReviewForm from "./ReviewForm";
import { useCart } from "@/context/cart-context";
import useCartIndividual from "../hooks/useAddCart";
import useFetchReviews from "../hooks/useFetchReviews";

const ProductPage = ({ product }) => {
  const {
    name,
    description,
    price,
    quantity,
    usage,
    isHotProduct,
    image,
    isVariableQuantity,
    category,
    price_options = [],
  } = product;
  const { refreshCart } = useCart();

  const BASE_URL = process.env.NEXT_PUBLIC_STRAPI;

  const { reviews, loading, error, fetchReviews } = useFetchReviews(
    product?.id
  );

  const averageRating =
    reviews && reviews.length > 0
      ? (
          reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  const productDescription =
    description?.description || "No description available.";
  const features = description?.features || [];

  const images = Array.isArray(image) ? image : image ? [image] : [];

  const getImageUrl = (imgObj) => {
    const imageUrl = imgObj.formats?.small?.url || imgObj.url || "";
    return imageUrl.startsWith("http") ? imageUrl : `${BASE_URL}${imageUrl}`;
  };

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedPriceOption, setSelectedPriceOption] = useState(
    price_options.length > 0 ? price_options[0].id : null
  );
  const { addToCart } = useCartIndividual();

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectedOption = price_options.find(
    (opt) => opt.id === selectedPriceOption
  );

  const displayPrice =
    price_options.length > 0
      ? `₹${selectedOption?.price}`
      : price !== null
      ? `₹${price}`
      : "Price not available";

  const handleAddToCart = () => {
    try {
      const selectedPrice = selectedOption ? selectedOption.price : price;
      const selectedQuantity = selectedOption
        ? selectedOption.quantity
        : quantity;

      console.log(selectedPrice);
      console.log(selectedQuantity);

      addToCart(
        product.id,
        selectedQuantity,
        selectedPrice,
        images[0]?.url || ""
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
      // alert("Failed to add product to cart. Please try again.");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 mt-16">
        Home / {category?.name || "Products"} / {name}
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="relative bg-white rounded-xl overflow-hidden shadow-md aspect-square">
              {isHotProduct && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                    HOT
                  </span>
                </div>
              )}

              {images.length > 0 ? (
                <>
                  <img
                    src={
                      getImageUrl(images[selectedImageIndex]) ||
                      "/placeholder.svg"
                    }
                    alt={images[selectedImageIndex]?.name || "Product image"}
                    className="w-full h-full object-contain p-4"
                  />

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-700" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  No image available
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`flex-shrink-0 border-2 rounded-md overflow-hidden ${
                      selectedImageIndex === idx
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={getImageUrl(img) || "/placeholder.svg"}
                      alt={img.name || `Thumbnail ${idx + 1}`}
                      className="h-16 w-16 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {name}
              </h1>

              <div className="mt-2 flex items-center">
                <div className="mt-2 flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5"
                        fill={
                          i < Math.round(averageRating)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                  </div>
                  {averageRating && (
                    <span className="ml-2 text-sm text-gray-500">
                      {averageRating} / 5 • {reviews.length} review
                      {reviews.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <span className="ml-2 text-sm text-gray-500"></span>
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-b py-4">
              <div className="flex items-baseline">
                <span className="text-2xl md:text-3xl font-bold text-gray-900">
                  {displayPrice}
                </span>
                {price_options.length === 0 && price && (
                  <span className="ml-2 text-lg text-gray-500 line-through">
                    ₹{Math.round(price * 1.2)}
                  </span>
                )}
              </div>

              {/* Price options */}
              {price_options.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Package Size
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {price_options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedPriceOption(opt.id)}
                        className={`border rounded-lg py-2 px-3 text-sm ${
                          selectedPriceOption === opt.id
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {opt.quantity}kg — ₹{opt.price}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
            </div>

            {/* Delivery */}
            <div className="flex items-center text-sm text-gray-500 border-t pt-4">
              <Truck className="h-5 w-5 mr-2 text-gray-400" />
              Free delivery available
            </div>

            {/* Product Details */}
            <div className="border-t pt-6 space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Product Details
                </h3>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {usage && (
                    <div className="flex justify-between py-2 border-b space-x-4">
                      <span className="font-medium text-gray-500">Usage</span>
                      <span className="text-gray-900">{usage}</span>
                    </div>
                  )}
                  {(quantity || isVariableQuantity) && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium text-gray-500">
                        Quantity
                      </span>
                      <span className="text-gray-900">
                        {isVariableQuantity ? "Varies" : quantity}
                      </span>
                    </div>
                  )}
                  {category?.name && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium text-gray-500">
                        Category
                      </span>
                      <span className="text-gray-900">{category.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Post reviews and view them */}
      <ReviewForm product={product} />
    </div>
  );
};

export default ProductPage;
