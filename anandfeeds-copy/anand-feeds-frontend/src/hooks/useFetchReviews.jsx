import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useFetchReviews = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    if (!productId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/products?filters[id][$eq]=${productId}&populate[reviews][populate]=user`
      );

      const fetchedReviews = res.data?.data?.[0]?.reviews || [];
      setReviews(fetchedReviews);
      console.log("fetched reviews: ", fetchedReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, loading, error, fetchReviews };
};

export default useFetchReviews;
