import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import card1 from '../../assets/card-1.png';
import card2 from '../../assets/card-2.png';
import card3 from '../../assets/card-3.png';
import card4 from '../../assets/white.png';
import card5 from '../../assets/maroon.png';
import card6 from '../../assets/sage green.png';
import card7 from '../../assets/black.png';
import card8 from '../../assets/beige.png';
import card9 from '../../assets/brown.png';
import card10 from '../../assets/zinc.png';
import card11 from '../../assets/navy blue.png';
import card12 from '../../assets/skin.png';
import card13 from '../../assets/plum.png';
import card14 from '../../assets/grey.jpg';
import card15 from '../../assets/purple.jpg';
import './hero.css';

// ✅ Helper function to get hex color for the dot
const getColorHex = (colorValue) => {
  const colorMap = {
    'brown': '#8B7355',
    'black': '#1A1A1A',
    'maroon': '#800000',
    'zinc': '#71717A',
    'navy blue': '#1B2A4A',
    'white': '#F5F5F5',
    'skin': '#E8C5B0',
    'burgundy': '#900020',
    'purple': '#6B3FA0',
    'grey': '#808080',
    'plum': '#8E4585',
    'red': '#DC2626',
    'gold': '#D4AF37',
    'blue': '#2563EB',
    'silver': '#C0C0C0',
    'beige': '#F5F5DC',
    'green': '#16A34A',
    'sagegreen': '#9CAF88',
    'pink': '#f107de'
  };
  return colorMap[colorValue] || '#CCCCCC';
};

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

// ✅ Check if images are loading
// console.log('🟢 card1:', card1);
// console.log('🟢 card2:', card2);
// console.log('🟢 card3:', card3);
// console.log('🟢 card4:', card4);
// console.log('🟢 card5:', card5);
// console.log('🟢 card6:', card6);
// console.log('🟢 card7:', card7);
// console.log('🟢 card8:', card8);
// console.log('🟢 card9:', card9);
// console.log('🟢 card10:', card10);
// console.log('🟢 card11:', card11);
// console.log('🟢 card12:', card12);
// console.log('🟢 card13:', card13);

// Colors from your filters with their respective images
const colorCards = [
  { id: 1, name: 'Brown', value: 'brown', image: card9 },
  { id: 2, name: 'Black', value: 'black', image: card7 },
  { id: 3, name: 'Maroon', value: 'maroon', image: card5 },
  { id: 4, name: 'Zinc', value: 'zinc', image: card10 },
  { id: 5, name: 'Navy Blue', value: 'navy blue', image: card11 },
  { id: 6, name: 'White', value: 'white', image: card4 },
  { id: 7, name: 'Skin', value: 'skin', image: card12 },
  // { id: 8, name: 'Burgundy', value: 'burgundy', image: card2 },
  { id: 9, name: 'Purple', value: 'purple', image: card15 },
  { id: 10, name: 'Grey', value: 'grey', image: card14 },
  { id: 11, name: 'Plum', value: 'plum', image: card13 },
  // { id: 12, name: 'Red', value: 'red', image: card3 },
  // { id: 13, name: 'Gold', value: 'gold', image: card1 },
  // { id: 14, name: 'Blue', value: 'blue', image: card2 },
  // { id: 15, name: 'Silver', value: 'silver', image: card3 },
  { id: 16, name: 'Beige', value: 'beige', image: card8 },
  // { id: 17, name: 'Green', value: 'green', image: card2 },
  { id: 18, name: 'Sage Green', value: 'sagegreen', image: card6 },
];

// ✅ Display only unique colors
const uniqueColors = [];
const seen = new Set();
colorCards.forEach(color => {
  if (!seen.has(color.value)) {
    seen.add(color.value);
    uniqueColors.push(color);
  }
});

// console.log('🟢 uniqueColors:', uniqueColors);
// console.log('🟢 uniqueColors length:', uniqueColors.length);

const HeroSection = () => {
  const navigate = useNavigate();

  const handleColorClick = (colorValue) => {
    navigate('/shop', {
      state: { color: colorValue }
    });
  };

  // ✅ If no colors, show a message
  if (uniqueColors.length === 0) {
    return (
      <section className="color-palette-section">
        <div className="color-palette-container">
          <p>No colors available</p>
        </div>
      </section>
    );
  }

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
          {uniqueColors.map((color, index) => (
            <motion.div
              key={color.id || index}
              className="color-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              onClick={() => handleColorClick(color.value)}
              style={{ cursor: 'pointer' }}
            >
              {/* Color Image */}
              <div className="color-image-wrapper">
                {color.image ? (
                  <motion.img
                    src={color.image}
                    alt={color.name}
                    className="color-image"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.4 }}
                    onError={(e) => {
                      console.error('❌ Image failed to load:', color.image);
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="color-image-placeholder">No Image</div>
                )}
                <div className="color-overlay" />
              </div>

              {/* Color Info */}
              <div className="color-info">
                <div className="color-dot-wrapper">
                  <span 
                    className="color-dot" 
                    style={{ 
                      backgroundColor: getColorHex(color.value),
                      border: color.value === 'white' ? '1px solid #E5E7EB' : 'none'
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
                    handleColorClick(color.value);
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