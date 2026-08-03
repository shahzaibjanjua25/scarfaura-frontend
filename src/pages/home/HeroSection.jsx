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
      staggerChildren: 0.2,
      when: "beforeChildren"
    }
  }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    y: -10,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.3
    }
  }
};

// Data for cards
const cards = [
  {
    id: 1,
    image: card1,
    trend: '2025 Trend',
    title: 'Kids Shirts', // Match exact category name from your filters
    filter: 'Kids Shirts' // Added filter property
  },
  {
    id: 2,
    image: card2,
    trend: '2025 Trend',
    title: 'Sweatshirts and hoodies',
    filter: 'Sweatshirts and hoodies'
  },
  {
    id: 3,
    image: card3,
    trend: '2025 Trend',
    title: 'Kids Casuals',
    filter: 'kids Casuals' // Note: matches the exact case from your filters
  },
];

const HeroSection = () => {
  const navigate = useNavigate();

  const handleCardClick = (filter) => {
    navigate('/shop', {
      state: { category: filter }
    });
  };

  return (
    <motion.section 
      className="section__container hero__container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {cards.map((card) => (
        <motion.div 
          key={card.id} 
          className="hero__card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          onClick={() => handleCardClick(card.filter)}
          style={{ cursor: 'pointer' }}
        >
          <motion.img 
            src={card.image} 
            alt={card.title} 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div 
            className="hero__content"
            variants={contentVariants}
          >
            <p>{card.trend}</p>
            <h4>{card.title}</h4>
            <motion.button 
              className="discover-more-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick(card.filter);
              }}
              whileHover={{ 
                scale: 1.05,
                color: "#ff6b6b" // Change to your preferred hover color
              }}
              transition={{ duration: 0.2 }}
            >
              Discover More +
            </motion.button>
          </motion.div>
        </motion.div>
      ))}
    </motion.section>
  );
};

export default HeroSection;