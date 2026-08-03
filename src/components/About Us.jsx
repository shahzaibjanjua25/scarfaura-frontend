import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css'; // We'll create this CSS file next

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <section className="about-hero">
        <div className="hero-content">
          <h1>About Scarfaura </h1>
          <p>Where comfort meets style for your little ones!</p>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-intro">
            <h2>Welcome to Our Story</h2>
            <p>
              At Scarfaura, we specialize in high-quality, affordable clothing for children of all ages. 
              From everyday Printed Hijabs to formal wear and festive outfits, our handpicked collections are 
              designed to keep your kids looking stylish and feeling comfortable — all year round.
            </p>
          </div>

          <div className="why-choose-us">
            <h2>Why Choose Us?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon quality-icon"></div>
                <h3>Quality & Comfort</h3>
                <p>We use soft, child-friendly fabrics that are gentle on the skin and made to last.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon trendy-icon"></div>
                <h3>Trendy & Traditional</h3>
                <p>Whether you're looking for modern fashion or cultural elegance, our range blends classic charm with current trends.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon affordable-icon"></div>
                <h3>Affordable Fashion</h3>
                <p>Great style shouldn't come with a high price tag. We offer fashionable kids' wear that fits your budget.</p>
              </div>
            </div>
          </div>

          <div className="visit-us">
            <h2>Visit Us</h2>
            <div className="contact-info">
              <p><span className="icon location-icon"></span> Dheri Hassanabad, Rawalpindi</p>
              <p><span className="icon phone-icon"></span> Call or WhatsApp: +9231302677570</p>
              <p><span className="icon email-icon"></span> Email: sch19435@gmail.com</p>
            </div>
          </div>

          <div className="closing-message">
            <p>
              Thank you for choosing Scarfaura — where every child's outfit tells a story of love, care, and color.
            </p>
            <Link to="/shop" className="cta-button">Explore Our Collection</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;