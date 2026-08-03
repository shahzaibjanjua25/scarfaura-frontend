import React from 'react';
import bannerImg from "../../assets/header.png"
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <header className="section__container header__container">
      <div className="header__content z-30">
        <h4>UP TO 20% DISCOUNT ON</h4>
        <h1>Welcome to Scarfura</h1>
        <p>
          A collection of premium scarves designed to move with you through every moment. Soft fabrics, timeless silhouettes, and understated elegance come together to create pieces you'll reach for every day.
        </p>
        <button className="btn"><Link to="/shop">Shop NOW</Link></button>
      </div>
      <div className="header__image">
        <img src={bannerImg} alt="header" />
      </div>
    </header>
  );
};

export default Banner;
