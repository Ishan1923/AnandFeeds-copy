import { notFound } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";
// import ProductReviewForm from "@/components/product-review-form";

async function getProduct(id) {
  try {
    const res = await fetch(
      `https://admin.anandfeeds.com/api/products?filters[id][$eq]=${id}&populate=*`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch product");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductPage({ params }) {
  const productData = await getProduct(params.id);

  if (!productData || productData.data.length === 0) {
    notFound();
  }

  const product = productData.data[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-[2fr_1fr]">
        <ProductDetails key={product.id} product={product} />
        <div className="space-y-8">
          {/* <ProductReviewForm productId={product.id} /> */}
        </div>
      </div>
    </div>
  );
}
