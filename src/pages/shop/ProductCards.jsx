import React from 'react';
import RatingStars from '../../components/RatingStars';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { toast } from 'react-toastify';

const ProductCards = ({ products }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`🛒 ${product.name} added to cart!`, {
      position: 'bottom-right',
      autoClose: 2800,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light',
    });
  };

  return (
    <div className="pc-grid">
      <style>{`
        .pc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.75rem 1.5rem;
        }
        @media (min-width: 640px) {
          .pc-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 900px) {
          .pc-grid { grid-template-columns: repeat(3, 1fr); gap: 2rem 1.75rem; }
        }
        @media (min-width: 1200px) {
          .pc-grid { grid-template-columns: repeat(4, 1fr); }
        }

        .pc-card {
          background: #fff;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(36,28,30,0.04), 0 8px 24px rgba(36,28,30,0.04);
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease;
          position: relative;
        }
        .pc-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 40px rgba(36,28,30,0.1), 0 4px 12px rgba(90,26,43,0.06);
        }

        .pc-media {
          position: relative;
          overflow: hidden;
          aspect-ratio: 3 / 4;
          background: #F2ECE8;
        }
        .pc-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.55s cubic-bezier(0.22,1,0.36,1);
        }
        .pc-card:hover .pc-media img {
          transform: scale(1.06);
        }

        .pc-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: linear-gradient(135deg, #5A1A2B 0%, #7A2A3B 100%);
          color: #fff;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          padding: 0.35rem 0.65rem;
          border-radius: 999px;
          box-shadow: 0 2px 8px rgba(90,26,43,0.35);
          z-index: 2;
        }

        .pc-cart-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(8px);
          border: none;
          display: grid;
          place-items: center;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(36,28,30,0.12);
          opacity: 0;
          transform: translateY(6px) scale(0.92);
          transition: all 0.28s cubic-bezier(0.22,1,0.36,1);
          z-index: 2;
        }
        .pc-card:hover .pc-cart-btn {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .pc-cart-btn:hover {
          background: #5A1A2B;
          color: #fff;
        }
        .pc-cart-btn i {
          font-size: 1rem;
          color: #241C1E;
          transition: color 0.2s;
        }
        .pc-cart-btn:hover i { color: #fff; }

        .pc-body {
          padding: 1.1rem 1.15rem 1.25rem;
        }
        .pc-name {
          font-family: 'Karla', system-ui, sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: #241C1E;
          line-height: 1.35;
          margin: 0 0 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.2s;
        }
        .pc-name a { color: inherit; text-decoration: none; }
        .pc-card:hover .pc-name { color: #5A1A2B; }

        .pc-price-row {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.4rem;
        }
        .pc-price {
          font-size: 1.1rem;
          font-weight: 700;
          color: #5A1A2B;
          letter-spacing: -0.01em;
        }
        .pc-old {
          font-size: 0.8rem;
          color: #8A7F7B;
          text-decoration: line-through;
        }

        .pc-rating {
          margin-top: 0.15rem;
        }
      `}</style>

      {products.map((product, index) => (
        <article key={product._id || index} className="pc-card">
          <div className="pc-media">
            <Link to={`/shop/${product._id}`}>
              <img
                src={product.image || product.images?.[0] || ''}
                alt={product.name}
                loading="lazy"
              />
            </Link>

            {product.oldPrice && product.oldPrice > product.price && (
              <span className="pc-badge">
                −{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
              </span>
            )}

            <button
              type="button"
              className="pc-cart-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart(product);
              }}
              aria-label={`Add ${product.name} to cart`}
            >
              <i className="ri-shopping-bag-3-line" />
            </button>
          </div>

          <div className="pc-body">
            <h3 className="pc-name">
              <Link to={`/shop/${product._id}`}>{product.name}</Link>
            </h3>
            <div className="pc-price-row">
              <span className="pc-price">PKR {product.price?.toLocaleString()}</span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="pc-old">PKR {product.oldPrice.toLocaleString()}</span>
              )}
            </div>
            <div className="pc-rating">
              <RatingStars rating={product.rating || 0} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default ProductCards;
