import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <section className="about-hero">
        <div className="hero-content">
          <h1>About Scarfaura</h1>
          <p>Where comfort meets style for your little ones!</p>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-intro">
            <h2>Welcome to Scarfaura</h2>
            <p>
              Rooted in elegance and minimalist design, Scarfaura is built on the belief that true style is effortless and refined. 
              Every piece is curated to offer understated luxury and a quiet confidence that elevates your everyday wardrobe.
            </p>
            <p>
              Thank you for being part of our beginning. Explore our collection and let Scarfaura become a part of your story.
            </p>
          </div>

          <div className="why-choose-us">
            <h2>Why Choose Scarfaura?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon elegance-icon"></div>
                <h3>Understated Elegance</h3>
                <p>
                  Our pieces are thoughtfully designed with a minimalist aesthetic, offering a refined and 
                  sophisticated look for any wardrobe.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon versatility-icon"></div>
                <h3>Effortless Versatility</h3>
                <p>
                  We curate styles that seamlessly transition from everyday wear to special moments, ensuring 
                  you always feel polished and put-together.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon quality-icon"></div>
                <h3>Quality &amp; Intention</h3>
                <p>
                  Every item is crafted with a focus on premium detail, durability, and timeless appeal 
                  rather than fleeting trends.
                </p>
              </div>
              {/* <div className="feature-card">
                <div className="feature-icon personal-icon"></div>
                <h3>A Personal Touch</h3>
                <p>
                  As a brand built on passion and individual expression, we are dedicated to helping you 
                  find pieces that feel uniquely yours.
                </p>
              </div> */}
            </div>
          </div>

          <div className="visit-us">
            <h2>Contact Us</h2>
            <div className="contact-info">
              <p><span className="icon location-icon"></span> Rawalpindi, Pakistan</p>
              <p><span className="icon phone-icon"></span> Call or WhatsApp: +923165972409</p>
              <p><span className="icon email-icon"></span> Email: sch19435@gmail.com</p>
            </div>
          </div>

          <div className="closing-message">
            <Link to="/shop" className="cta-button">Explore Our Collection</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;