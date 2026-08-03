import React from 'react';
import bannerImg from "../../assets/header.png"
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <header className="section__container header__container">
      <div className="header__content z-30">
        <h4>UP TO 20% DISCOUNT ON</h4>
        <h1>Girl's Fashion</h1>
        <p>
          Discover the latest trends and express your unique style with our Kids's Fashion website. Explore a curated collection of clothing, Tops and tees, and footwear that caters to every taste and occasion.
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
