import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Search, ShieldCheck, Clock3, Leaf, Sprout, ShoppingBag, CheckCircle2, ChevronRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedPage from "../components/AnimatedPage";
import ProductCard from "../components/ProductCard";
import SectionHeading from "../components/SectionHeading";
import { categories } from "../data";
import { useStore } from "../context/StoreContext";

export default function Home() {
  const { products, farmers } = useStore();
  const popularProducts = products.slice(0, 8);
  const featuredFarmers = farmers.slice(0, 3);

  return (
    <AnimatedPage>
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />

        <div className="container hero-container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <div className="hero-badge">
              <Sprout size={16} className="hero-leaf-icon" />
              <span>eGreen Basket • 100% Local Produce</span>
            </div>

            <h1 className="hero-headline">
              Fresh From Local Farmers,{" "}
              <span className="hero-highlight">Straight To Your Basket</span>
            </h1>

            <p className="hero-subtext">
              Discover fresh vegetables, fruits & local products from nearby farmers.
              Pre-order online and pick up fresh produce directly from farm stalls at your local community market.
            </p>

            <div className="hero-cta-group">
              <Link className="btn-primary-large" to="/products">
                <span>Explore Products</span>
                <ArrowRight size={18} />
              </Link>
              <Link className="btn-secondary-large" to="/markets">
                <MapPin size={18} />
                <span>Find Nearby Markets</span>
              </Link>
            </div>

            <div className="hero-trust-metrics">
              <div className="trust-item">
                <ShieldCheck size={18} className="trust-icon" />
                <div>
                  <strong>Direct From Farm</strong>
                  <span>Zero middlemen markups</span>
                </div>
              </div>
              <div className="trust-item">
                <Clock3 size={18} className="trust-icon" />
                <div>
                  <strong>Pre-Order Pickup</strong>
                  <span>Guaranteed fresh reservation</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hero Visual Imagery + Floating Cards */}
          <motion.div
            className="hero-visual-wrapper"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.15 }}
          >
            <div className="hero-main-card">
              <img
                src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=85"
                alt="Fresh local vegetables and farm products"
                className="hero-main-img"
              />
              <div className="hero-img-overlay" />

              <div className="hero-overlay-tag">
                <span className="live-dot" />
                <span>Weekly Morning Bazaar Now Open</span>
              </div>
            </div>

            {/* Subtle Floating Animation Badges */}
            <motion.div
              className="floating-badge float-card-1"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            >
              <div className="float-icon-box">🍅</div>
              <div className="float-text">
                <strong>Fresh Tomatoes</strong>
                <small>Harvested 6:00 AM today</small>
              </div>
            </motion.div>

            <motion.div
              className="floating-badge float-card-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 5.2, ease: "easeInOut", delay: 0.5 }}
            >
              <div className="float-icon-box">🧺</div>
              <div className="float-text">
                <strong>eGreen Basket</strong>
                <small>Reserve & Pay at Pickup</small>
              </div>
            </motion.div>

            <motion.div
              className="floating-badge float-card-3"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut", delay: 1 }}
            >
              <div className="float-icon-box">⭐</div>
              <div className="float-text">
                <strong>4.9 / 5 Rating</strong>
                <small>From 1,200+ local buyers</small>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="section-padding bg-cream">
        <div className="container">
          <SectionHeading
            eyebrow="Browse Harvest Categories"
            title="Fresh Categories For Your Daily Basket"
            text="Everything grown by verified local producers, carefully graded and bundled for you."
          />

          <div className="category-cards-grid">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Link
                  to={`/products?category=${encodeURIComponent(cat.slug)}`}
                  className="modern-category-card"
                >
                  <div className="category-icon-bubble">{cat.icon}</div>
                  <div className="category-meta">
                    <h3 className="category-name">{cat.name}</h3>
                    <span className="category-count">{cat.count} available</span>
                  </div>
                  <div className="category-arrow-btn">
                    <ChevronRight size={18} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR PRODUCTS SECTION */}
      <section className="section-padding">
        <div className="container">
          <SectionHeading
            eyebrow="Direct From The Farm"
            title="Popular Products In Season"
            text="Add your favorites to your basket with a single tap. Guaranteed fresh stock for this week's market."
            action={
              <Link className="view-all-link" to="/products">
                <span>View Full Market Catalogue</span>
                <ArrowRight size={16} />
              </Link>
            }
          />

          <div className="products-responsive-grid">
            {popularProducts.map((prod) => (
              <ProductCard product={prod} key={prod.id} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW PRE-ORDER WORKS */}
      <section className="section-padding bg-cream">
        <div className="container">
          <SectionHeading
            eyebrow="Simple 3-Step Process"
            title="How MarketLink Pre-Order Works"
            text="Avoid crowded lines and sold-out items. Reserve your items from home and collect them when convenient."
          />

          <div className="workflow-steps-grid">
            <div className="workflow-card">
              <div className="step-num">01</div>
              <div className="step-icon-wrap">🔍</div>
              <h3>Explore Local Stalls</h3>
              <p>Browse live farm inventories, transparent prices per kg/bunch, and see operating days of your nearby community market.</p>
            </div>

            <div className="workflow-card">
              <div className="step-num">02</div>
              <div className="step-icon-wrap">🧺</div>
              <h3>Reserve Your Basket</h3>
              <p>Add fresh tomatoes, veggies, and milk to your basket. Select your pickup time slot and submit your pre-order with zero upfront payment.</p>
            </div>

            <div className="workflow-card">
              <div className="step-num">03</div>
              <div className="step-icon-wrap">🤝</div>
              <h3>Collect & Pay in Person</h3>
              <p>Arrive at the farmer's stall at the market, show your pickup order token, inspect your fresh harvest, and settle payment directly with the farmer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED FARMERS SPOTLIGHT */}
      <section className="section-padding">
        <div className="container">
          <SectionHeading
            eyebrow="Meet The Growers"
            title="Featured Local Farmers"
            text="Support passionate agro-growers and dairy families from your area."
            action={
              <Link className="view-all-link" to="/farmers">
                <span>Meet All Farmers</span>
                <ArrowRight size={16} />
              </Link>
            }
          />

          <div className="farmers-spotlight-grid">
            {featuredFarmers.map((farmer) => (
              <div className="spotlight-farmer-card" key={farmer.id}>
                <div className="farmer-img-container">
                  <img src={farmer.image} alt={farmer.name} />
                  <span className="farmer-badge-pill">{farmer.badge}</span>
                </div>
                <div className="farmer-content">
                  <div className="farmer-rating-row">
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    {farmer.reviewsCount ? <><strong>{farmer.rating.toFixed(1)}</strong><span>({farmer.reviewsCount} reviews)</span></> : <span>No ratings yet</span>}
                  </div>
                  <h3>{farmer.name}</h3>
                  <p className="farmer-stall-location">
                    <MapPin size={14} /> {farmer.location}
                  </p>
                  <p className="farmer-bio-short">{farmer.bio}</p>

                  <div className="farmer-card-footer">
                    <span className="operating-days">🕒 {farmer.days}</span>
                    <Link to="/farmers" className="farmer-profile-btn">
                      View Profile <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKETS MAP PREVIEW BANNER */}
      <section className="section-padding bg-green-accent">
        <div className="container">
          <div className="markets-cta-banner">
            <div className="banner-left">
              <span className="eyebrow light">Interactive Map & Schedules</span>
              <h2>Find Your Nearest Community Farmers Market</h2>
              <p>
                Check market locations across Karachi, see opening hours, explore attending farmers, and reserve pickup slots for this weekend.
              </p>
              <div className="banner-btn-group">
                <Link to="/markets" className="btn-white-primary">
                  <MapPin size={18} /> Open Interactive Map
                </Link>
                <Link to="/products" className="btn-outline-white">
                  Shop Products Now
                </Link>
              </div>
            </div>

            <div className="banner-stats-right">
              <div className="stat-box">
                <span className="stat-number">4+</span>
                <span className="stat-label">Active Markets in City</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">25+</span>
                <span className="stat-label">Local Verified Farmers</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">100%</span>
                <span className="stat-label">Farm Fresh Quality</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">Rs. 0</span>
                <span className="stat-label">Pre-Order Booking Fee</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
}