"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ReviewModal from "./ReviewModal";

export default function ReviewForm({ product }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleOpenModal = () => {};

  const fetchReviews = async () => {
    if (!product?.id) return;

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/products?filters[id][$eq]=${product.id}&populate[reviews][populate]=user`
      );

      const fetchedReviews = res.data?.data?.[0]?.reviews || [];
      setReviews(fetchedReviews);
      console.log("fetched reviews: ", fetchedReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product?.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-lg font-medium text-gray-900">Customer Reviews</h2>

      {loading ? (
        <p className="mt-2 text-sm text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="mt-2 text-sm text-gray-500">No reviews yet.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border p-4 rounded-md shadow-sm bg-white"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-800">{review.title}</h3>
                <span className="text-yellow-500">★ {review.rating}/5</span>
              </div>
              <p className="text-gray-700 text-sm">{review.review_text}</p>
              <p className="text-xs text-gray-500 mt-2">
                by {"Anonymous" || review.users_permissions_users[0]?.username}
              </p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6">
        <ReviewModal product_id={product.id} fetchReviews={fetchReviews} />
      </div>
    </div>
  );
}
