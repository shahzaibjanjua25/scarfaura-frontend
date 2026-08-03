import React from 'react';
import { motion } from 'framer-motion';
import Banner from './Banner';
import Categories from './Categories';
import NewArrival from './NewArrival';
import SocialMediaLinks from './SocialMediaLinks';
import HeroSection from './HeroSection';
import TrendingProducts from '../shop/TrendingProducts';
import DealsSection from './DealsSection';
import PromoBanner from './PromoBanner';
import Blogs from '../blogs/Blogs';

const Home = () => {
  return (
    <div>
      {/* Banner - First element, no animation needed */}
      <Banner />
      
      {/* Categories - Slides in from left */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Categories />
      </motion.div>
      
      {/* NewArrival - Slides in from right */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <NewArrival />
      </motion.div>
      
      {/* HeroSection - Slides up from bottom */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <HeroSection />
      </motion.div>
      
      {/* Blogs - Bounces up from bottom */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ 
          opacity: 1, 
          y: 0,
          transition: { 
            type: "spring",
            damping: 10,
            stiffness: 100
          }
        }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <SocialMediaLinks />
      </motion.div>
      {/* TrendingProducts - Fades in with scale */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <TrendingProducts />
      </motion.div>
      
      {/* DealsSection - Rotates in slightly
      <motion.div
        initial={{ opacity: 0, rotate: -5 }}
        whileInView={{ opacity: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <DealsSection /> */}
      {/* </motion.div> */}
      
      {/* PromoBanner - Slides down from top */}
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <PromoBanner />
      </motion.div>
      
    </div>
  );
};

export default Home;