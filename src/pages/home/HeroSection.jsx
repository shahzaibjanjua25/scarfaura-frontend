import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import card1 from '../../assets/card-1.png';
import card2 from '../../assets/card-2.png';
import card3 from '../../assets/card-3.png';
import './CategoriesSection.css';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      when: "beforeChildren"
    }
  }
};

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  hover: {
    y: -8,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

// Color palette based on your requirements
const colorPalette = [
  { id: 1, name: 'Brown', hex: '#8B7355', image: card1 },
  { id: 2, name: 'Black', hex: '#1A1A1A', image: card2 },
  { id: 3, name: 'Maroon', hex: '#800000', image: card3 },
  { id: 4, name: 'Zinc', hex: '#71717A', image: card1 },
  { id: 5, name: 'Navy Blue', hex: '#1B2A4A', image: card2 },
  { id: 6, name: 'White', hex: '#F5F5F5', image: card3 },
  { id: 7, name: 'Skin', hex: '#E8C5B0', image: card1 },
  { id: 8, name: 'Burgundy', hex: '#900020', image: card2 },
  { id: 9, name: 'Purple', hex: '#6B3FA0', image: card3 },
  { id: 10, name: 'Grey', hex: '#808080', image: card1 },
  { id: 11, name: 'Plum', hex: '#8E4585', image: card2 },
];

const HeroSection = () => {
  const navigate = useNavigate();

  const handleColorClick = (colorName) => {
    navigate('/shop', {
      state: { color: colorName }
    });
  };

  return (
    <section className="color-palette-section">
      <motion.div 
        className="color-palette-container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div 
          className="color-palette-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="color-palette-eyebrow">Shop by Color</span>
          <h2 className="color-palette-title">Find Your Shade</h2>
          <p className="color-palette-subtitle">
            Explore our collection by your favorite colors
          </p>
          <div className="color-palette-divider">
            <span className="divider-line"></span>
            <span className="divider-diamond">✦</span>
            <span className="divider-line"></span>
          </div>
        </motion.div>

        {/* Color Grid */}
        <div className="color-palette-grid">
          {colorPalette.map((color, index) => (
            <motion.div
              key={color.id}
              className="color-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              onClick={() => handleColorClick(color.name)}
              style={{ cursor: 'pointer' }}
            >
              {/* Color Image */}
              <div className="color-image-wrapper">
                <motion.img
                  src={color.image}
                  alt={color.name}
                  className="color-image"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4 }}
                />
                <div className="color-overlay" />
              </div>

              {/* Color Info */}
              <div className="color-info">
                <div className="color-dot-wrapper">
                  <span 
                    className="color-dot" 
                    style={{ 
                      backgroundColor: color.hex,
                      border: color.name === 'White' ? '1px solid #E5E7EB' : 'none'
                    }}
                  />
                </div>
                <h4 className="color-name">{color.name}</h4>
                <motion.button
                  className="color-shop-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleColorClick(color.name);
                  }}
                >
                  Shop {color.name}
                  <span className="color-arrow">→</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;