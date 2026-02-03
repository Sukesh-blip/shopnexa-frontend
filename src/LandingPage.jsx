import React from "react";
import { useNavigate } from "react-router-dom";
import "./assets/LandingPage.css";
import Logo from "./Logo";
import { Footer } from "./Footer";
import { ShieldCheck, Zap, ArrowRight, Truck, CreditCard, ShoppingBag, Globe, Sparkles } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page-ecommerce">
      {/* Premium Navigation */}
      <header className="header glass-panel">
        <div className="header-content">
          <Logo />
          <div className="header-actions">
            <button className="profile-button" onClick={() => navigate("/login")}>
              Sign In
            </button>
            <button className="add-to-cart-btn primary-gradient" onClick={() => navigate("/register")} style={{ padding: '8px 20px', borderRadius: '30px' }}>
              Join ShopNexa
            </button>
          </div>
        </div>
      </header>

      {/* Futuristic Hero Section */}
      <section className="hero-retail">
        <div className="hero-visual-bg">
          <div className="orbit orbit-1"></div>
          <div className="orbit orbit-2"></div>
        </div>

        <div className="hero-inner">
          <div className="hero-badge animate-fade-in">
            <Sparkles size={14} style={{ marginRight: 8 }} />
            <span>Next-Gen Commerce Platform</span>
          </div>

          <h1 className="hero-main-title text-gradient">
            E-Commerce <br />
            <span style={{ color: 'var(--primary)' }}>Redefined.</span>
          </h1>

          <p className="hero-sub-text">
            Experience the future of retail with ShopNexa. Ultra-fast performance,
            premium curated collections, and a seamless checkout experience powered by
            cutting-edge technology.
          </p>

          <div className="hero-cta-group">
            <button className="btn-primary-retail primary-gradient" onClick={() => navigate("/login")}>
              Explore Collections <ArrowRight size={20} style={{ marginLeft: 8 }} />
            </button>
            <div className="trust-badges">
              <div className="badge-item">
                <ShieldCheck size={16} /> Verified Store
              </div>
              <div className="badge-item">
                <Globe size={16} /> Global Delivery
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Features Grid */}
      <section id="features" className="features-strip">
        <div className="features-container">
          <div className="feature-box glass-card">
            <div className="feature-icon-circle primary-gradient"><Truck size={28} /></div>
            <h3>Express Delivery</h3>
            <p>Proprietary logistics network ensuring your orders reach you in record time.</p>
          </div>

          <div className="feature-box glass-card">
            <div className="feature-icon-circle primary-gradient" style={{ filter: 'hue-rotate(45deg)' }}><CreditCard size={28} /></div>
            <h3>Encryption 2.0</h3>
            <p>Enterprise-grade security for every transaction via our global payment mesh.</p>
          </div>

          <div className="feature-box glass-card">
            <div className="feature-icon-circle primary-gradient" style={{ filter: 'hue-rotate(90deg)' }}><Zap size={28} /></div>
            <h3>Pro Support</h3>
            <p>A dedicated team of experts available 24/7 to assist with your shopping journey.</p>
          </div>
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section className="info-banner glass-panel">
        <div className="info-text">
          <h2 className="text-gradient">Engineered for Performance</h2>
          <p>
            ShopNexa utilizes a world-class architecture to provide a lightning-fast shopping experience.
            Zero lag, 100% uptime, and an interface that feels alive.
          </p>
          <div className="tech-list">
            <span className="tech-chip">React 18 Architecture</span>
            <span className="tech-chip">Spring Boot Backend</span>
            <span className="tech-chip">Razorpay Enterprise</span>
            <span className="tech-chip">AES-256 Encryption</span>
          </div>
        </div>
        <div className="info-visual">
          <ShoppingBag size={160} className="floating-icon" />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
