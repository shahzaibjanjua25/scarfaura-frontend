import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoriesSection.css';

// Import your category images
import category1 from "../../assets/category-1.jpg";
import category2 from "../../assets/category-2.jpg";
import category3 from "../../assets/category-3.jpg";
import category7 from "../../assets/category-7.jpg";

const CategoriesSection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryTitle) => {
    navigate('/shop', {
      state: { category: categoryTitle }
    });
  };
const categories = [
  {
    id: 1,
    title: "Printed Hijabs",
    discount: "Up to 20% Off",
    image: category1,
    description: "Discover our latest collection of kids' fashion"
  },
  {
    id: 2,
    title: "Chiffon Hijabs",
    discount: "Up to 15% Off",
    image: category2,
    description: "Lightweight and comfortable summer outfits"
  },
  {
    id: 3,
    title: "Modal Hijabs",
    discount: "Up to 25% Off",
    image: category3,
    description: "Keep your kids warm with our cozy winter collection"
  },
  {
    id: 4,
    title: "Jersey Hijabs",
    discount: "Up to 35% Off",
    image: category7,
    description: "Keep your kids warm with our cozy winter collection"
  }
  // {
  //   id: 5,
  //   title: "Sweatshirts and hoodies",
  //   discount: "Up to 30% Off",
  //   image: category5,
  //   description: "Comfortable and durable shoes for all occasions"
  // }
];


  return (
    <section className="categories__section">
      <h2 className="section__title">Shop by Category</h2>
      <div className="categories__grid">
        {categories.map((category) => (
          <div 
            className="category__card" 
            key={category.id}
            onClick={() => handleCategoryClick(category.title)}
          >
            <div className="category__image">
              <img src={category.image} alt={category.title} />
              <div className="category__overlay">
                <button 
                  className="shop-now-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategoryClick(category.title);
                  }}
                >
                  Shop Now
                </button>
              </div>
            </div>
            <div className="category__content">
              <h5>{category.discount}</h5>
              <h4>{category.title}</h4>
              <p>{category.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;