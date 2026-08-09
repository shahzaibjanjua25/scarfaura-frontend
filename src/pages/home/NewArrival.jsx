import React from 'react';
import { useNavigate } from 'react-router-dom';
import dealsImg1 from "../../assets/category-8.jpg";
import dealsImg2 from "../../assets/png1.jpg";
import dealsImg3 from "../../assets/Chiffon.jpg";
import './NewArrival.css';

const DealsGrid = () => {
  const navigate = useNavigate();

  const handleShopNow = (category) => {
    navigate('/shop', {
      state: { category },
      replace: true
    });
  };

  // Category data for cleaner code
  const categories = [
    {
      id: 1,
      title: 'Deer Print',
      description: 'Discover our fresh designs — nature-inspired elegance',
      image: dealsImg1,
      badge: 'New',
      badgeType: 'new',
      category: 'Deer Prints'
    },
    {
      id: 2,
      title: 'Leopard Prints',
      description: 'Bold statements for the fearless — your signature style',
      image: dealsImg2,
      badge: 'Sale',
      badgeType: 'sale',
      category: 'Leopard Prints'
    },
    {
      id: 3,
      title: 'Georgette Chiffon Hijabs',
      description: 'Discover our fresh designs — nature-inspired elegance',
      image: dealsImg3,
      badge: 'New',
      badgeType: 'new',
      category: 'Georgette Hijabs'
    }
  ];

  return (
    <div className="deals-grid__wrapper">

      {/* New Arrivals or Categories Heading */}
      <div className="deals-grid__header">
        <span className="deals-grid__eyebrow">The Edit</span>
        <h2 className="deals-grid__title">Our Categories</h2>
        <p className="deals-grid__subtitle">
          Discover our latest collection — crafted for the season
        </p>
        <div className="deals-grid__divider">
          <span className="deals-grid__divider-line"></span>
          <span className="deals-grid__divider-diamond">◆</span>
          <span className="deals-grid__divider-line"></span>
        </div>
      </div>

      {/* Grid Container - 3 cards in a single line on laptop */}
      <div className="deals-grid__grid">
        {categories.map((item) => (
          <div
            key={item.id}
            className="deals-grid__card"
            onClick={() => handleShopNow(item.category)}
            style={{ cursor: 'pointer' }}
          >
            <div className="deals-grid__image-wrapper">
              <img
                src={item.image}
                alt={`${item.title} Collection`}
                className="deals-grid__image"
              />
              <div className="deals-grid__image-overlay">
                <span className={`deals-grid__badge ${item.badgeType === 'sale' ? 'deals-grid__badge--sale' : ''}`}>
                  {item.badge}
                </span>
              </div>
            </div>
            <div className="deals-grid__content">
              <h3 className="deals-grid__title-card">{item.title}</h3>
              <p className="deals-grid__description">
                {item.description}
              </p>
              <div className="deals-grid__footer">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent double trigger
                    handleShopNow(item.category);
                  }}
                  className="deals-grid__button"
                >
                  <span>Shop Now</span>
                  <span className="deals-grid__button-arrow">→</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealsGrid;