import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoriesSection.css';

// Import your category images
import category1 from "../../assets/category-1.jpg";
import category2 from "../../assets/category-2.jpg";
import category3 from "../../assets/category-3.jpg";
import category7 from "../../assets/category-7.jpg";
// import category4 from "../../assets/category-4.png";
// import category5 from "../../assets/category-4.png";
// import category6 from "../../assets/category-4.png";
// import category8 from "../../assets/category-4.png";
// import category9 from "../../assets/category-4.png";
// import category10 from "../../assets/category-4.png";
// import category11 from "../../assets/category-4.png";
// import category12 from "../../assets/category-4.png";

const categories = [

  {
    id: 3,
    title: "Modal Hijabs",
    discount: "Up to 25% off",
    image: category3,
    description: "Breathable modal that holds its shape from morning to night.",
    slug: "modal-hijabs"
  }, {
    id: 1,
    title: "Printed Hijabs",
    discount: "Up to 20% off",
    image: category1,
    description: "Painterly florals and quiet geometrics, cut for everyday wear.",
    slug: "printed-hijabs"
  },
  {
    id: 4,
    title: "Jersey Hijabs",
    discount: "Up to 35% off",
    image: category7,
    description: "Gentle stretch that stays where you place it, no pins needed.",
    slug: "jersey-hijabs"
  },
  {
    id: 2,
    title: "Chiffon Hijabs",
    discount: "Up to 15% off",
    image: category2,
    description: "Featherlight drape with a soft sheen — made for warm days.",
    slug: "chiffon-hijabs"
  }

  
];

const CategoriesSection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryTitle) => {
    navigate('/shop', { state: { category: categoryTitle } });
  };

  return (
    <section className="categories__section" aria-labelledby="categories-title">
      <header className="categories__header">
        <span className="categories__eyebrow">The Collection</span>
        <h2 className="section__title" id="categories-title">Shop by category</h2>
        <p className="categories__intro">
          Four fabrics, each chosen for how it falls and how it wears.
        </p>
      </header>

      <div className="categories__grid">
        {categories.map((category) => (
          <div
            className="category__card"
            key={category.id}
            onClick={() => handleCategoryClick(category.title)}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCategoryClick(category.title);
              }
            }}
          >
            <div className="category__image">
              <img
                src={category.image}
                alt={`${category.title} from ScarfAura`}
                loading="lazy"
              />
              <span className="category__tag">{category.discount}</span>
              <div className="category__overlay" aria-hidden="true" />
            </div>

            <div className="category__content">
              <h4>{category.title}</h4>
              <p>{category.description}</p>
              <button
                type="button"
                className="shop-now-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategoryClick(category.title);
                }}
              >
                <span>Shop {category.title.split(' ')[0].toLowerCase()}</span>
                <span className="shop-now-btn__arrow" aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;