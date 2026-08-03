import React from 'react';
import { useNavigate } from 'react-router-dom';
import dealsImg1 from "../../assets/category-8.jpg";
import dealsImg2 from "../../assets/png1.jpg";
import './NewArrival.css';

const DealsGrid = () => {
  const navigate = useNavigate();

  const handleShopNow = (category) => {
    navigate('/shop', {
      state: { category },
      replace: true
    });
  };

  return (
    <div className="deals-grid__wrapper">
      
      {/* New Arrivals Heading */}
      <div className="deals-grid__header">
        <span className="deals-grid__eyebrow">The Edit</span>
        <h2 className="deals-grid__title">New Arrivals</h2>
        <p className="deals-grid__subtitle">
          Discover our latest collection — crafted for the season
        </p>
        <div className="deals-grid__divider">
          <span className="deals-grid__divider-line"></span>
          <span className="deals-grid__divider-diamond">◆</span>
          <span className="deals-grid__divider-line"></span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="deals-grid__grid">
        
        {/* First Grid Item */}
        <div className="deals-grid__card">
          <div className="deals-grid__image-wrapper">
            <img
              src={dealsImg1}
              alt="Deer Print Collection"
              className="deals-grid__image"
            />
            <div className="deals-grid__image-overlay">
              <span className="deals-grid__badge">New</span>
            </div>
          </div>
          <div className="deals-grid__content">
            <h3 className="deals-grid__title-card">Deer Print</h3>
            <p className="deals-grid__description">
              Discover our fresh designs — nature-inspired elegance
            </p>
            <div className="deals-grid__footer">
              <button
                onClick={() => handleShopNow('Deer Prints')}
                className="deals-grid__button"
              >
                <span>Shop Now</span>
                <span className="deals-grid__button-arrow">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Second Grid Item */}
        <div className="deals-grid__card">
          <div className="deals-grid__image-wrapper">
            <img
              src={dealsImg2}
              alt="Leopard Print Collection"
              className="deals-grid__image"
            />
            <div className="deals-grid__image-overlay">
              <span className="deals-grid__badge deals-grid__badge--sale">Sale</span>
            </div>
          </div>
          <div className="deals-grid__content">
            <h3 className="deals-grid__title-card">Leopard Prints</h3>
            <p className="deals-grid__description">
              Bold statements for the fearless — your signature style
            </p>
            <div className="deals-grid__footer">
              <button
                onClick={() => handleShopNow('Leopard Prints')}
                className="deals-grid__button"
              >
                <span>Shop Now</span>
                <span className="deals-grid__button-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealsGrid;