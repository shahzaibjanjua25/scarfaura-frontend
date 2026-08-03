import React, { useState, useEffect } from "react";
import ProductCards from "./ProductCards";
import { useGetSortedProductsQuery } from "../../redux/features/products/productsApi";

const TrendingProducts = () => {
  const [visibleCount, setVisibleCount] = useState(8);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const { data, isLoading, error } = useGetSortedProductsQuery({
    sortBy: "rating", // Keep this as rating for now
    order: "desc",
    limit: 100, // Fetch more than needed to ensure we have enough after filtering
  });

  useEffect(() => {
    if (data?.products) {
      const filtered = data.products
        .filter(product => {
          // Show product if it has reviews OR has a rating > 0
          return (product.reviews?.length > 0) || (product.rating > 0);
        })
        .sort((a, b) => {
          // First sort by review count, then by rating
          const aReviews = a.reviews?.length || 0;
          const bReviews = b.reviews?.length || 0;
          return bReviews - aReviews || b.rating - a.rating;
        })
        .slice(0, visibleCount);
      
      setFilteredProducts(filtered);
    }
  }, [data, visibleCount]);

  const loadMoreProducts = () => {
    setVisibleCount(prev => prev + 4);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading trending products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        Failed to load trending products. Try again later.
      </div>
    );
  }

  return (
    <section className="section__container product__container">
      <h2 className="section__header">Trending Products</h2>
      <p className="section__subheader mb-12">
        Our most popular products based on customer engagement
      </p>

      {filteredProducts.length > 0 ? (
        <>
          <ProductCards products={filteredProducts} />
          {data.products.length > filteredProducts.length && (
            <div className="product__btn">
              <button className="btn" onClick={loadMoreProducts}>
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No trending products found. Check back later!
        </div>
      )}
    </section>
  );
};

export default TrendingProducts;