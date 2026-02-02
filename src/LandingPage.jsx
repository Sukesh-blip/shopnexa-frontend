import React from "react";
import { useNavigate } from "react-router-dom";
import "./assets/LandingPage.css";
import Logo from "./Logo";
import { Footer } from "./Footer";
import { ShieldCheck, Zap, ArrowRight, Truck, CreditCard, ShoppingBag } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page-ecommerce">
      {/* Professional Header */}
      <header className="header">
        <div className="header-content">
          <Logo />
          <div className="header-actions">
            <button className="profile-button" onClick={() => navigate("/login")}>
              Member Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-retail">
        <div className="hero-inner animate-fade-in">
          <span className="hero-tagline">Autumn Collection 2026</span>
          <h1 className="hero-main-title">Modern Shopping <br />Reimagined.</h1>
          <p className="hero-sub-text">
            Shop the latest trends in technology, fashion, and lifestyle. Premium quality,
            exclusive deals, and world-class support at your fingertips.
          </p>
          <div className="hero-cta-group">
            <button className="btn-primary-retail" onClick={() => navigate("/login")}>
              Shop Now <ArrowRight size={20} style={{ marginLeft: 8 }} />
            </button>
            <button className="btn-outline-white" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
              See Details
            </button>
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section id="features" className="features-strip">
        <div className="features-container">
          <div className="feature-box">
            <div className="feature-icon-circle"><Truck size={32} /></div>
            <h3>Free Shipping</h3>
            <p>On all orders over ₹999. Fast delivery guaranteed to your doorstep.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon-circle"><CreditCard size={32} /></div>
            <h3>Secure Payments</h3>
            <p>Integrated with Razorpay for 100% secure and encrypted transactions.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon-circle"><ShieldCheck size={32} /></div>
            <h3>Best Quality</h3>
            <p>We source our products only from verified premium manufacturers.</p>
          </div>
        </div>
      </section>

      {/* Detailed Info Section */}
      <section className="info-banner">
        <div className="info-text">
          <h2>The ShopNexa <br />Tech Stack</h2>
          <p>
            ShopNexa isn't just a store; it's a modern e-commerce platform built for scale.
            Our architecture ensures zero downtime and a smooth user interface.
          </p>
          <div className="tech-list">
            <span className="tech-chip">React 18</span>
            <span className="tech-chip">Vite JS</span>
            <span className="tech-chip">Spring Boot</span>
            <span className="tech-chip">MySQL Database</span>
            <span className="tech-chip">Razorpay SDK</span>
            <span className="tech-chip">Lucide Icons</span>
          </div>
        </div>
        <div className="info-image-placeholder">
          <ShoppingBag size={120} color="#cbd5e1" />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
