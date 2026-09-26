import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, ArrowUpDown, Filter, Sparkles } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import ProductCard from "../components/ProductCard";
import { categories } from "../data";
import { useStore } from "../context/StoreContext";

export default function Products() {
  const { products, markets } = useStore();
  const [params, setParams] = useSearchParams();
  const initialCategory = params.get("category") || "all";

  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(600);
  const [sortBy, setSortBy] = useState("featured"); // 'featured', 'price-low', 'price-high', 'rating'
  const [marketId, setMarketId] = useState(params.get("market") || "");
  const [marketDay, setMarketDay] = useState(params.get("day") || "");

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchesCategory = category === "all" || p.category === category;
      const matchesPrice = p.price <= maxPrice;
      const matchesMarket = !marketId || p.marketId === marketId;
      const matchesDay = !marketDay || (p.marketObject?.marketDays || []).includes(marketDay);
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.farmer.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesPrice && matchesMarket && matchesDay && matchesSearch;
    });

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, category, search, maxPrice, marketId, marketDay, sortBy]);

  const handleCategoryChange = (catName) => {
    setCategory(catName);
    if (catName === "all") {
      params.delete("category");
    } else {
      params.set("category", catName);
    }
    setParams(params);
  };

  return (
    <AnimatedPage>
      {/* Banner */}
      <section className="page-hero-banner">
        <div className="container">
          <span className="eyebrow">Local Marketplace</span>
          <h1 className="hero-page-title">Fresh Farm Harvest</h1>
          <p className="hero-page-desc">
            Directly from local fields and orchards. Pre-order fresh produce per kg or bunch and pick up at your community market stall.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          {/* Filter Bar */}
          <div className="filters-container-bar">
            {/* Search Box */}
            <div className="search-filter-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tomatoes, potatoes, apples, milk, or farmer name..."
              />
              {search && (
                <button className="clear-search-btn" onClick={() => setSearch("")}>
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="sort-filter-box">
              <ArrowUpDown size={16} />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="featured">Sort: Recommended</option>
                <option value="rating">Sort: Highest Rated ⭐</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
            <div className="sort-filter-box">
              <select aria-label="Filter by market" value={marketId} onChange={(e) => setMarketId(e.target.value)}>
                <option value="">All markets</option>
                {markets.map((market) => <option key={market.id} value={market.id}>{market.name}</option>)}
              </select>
            </div>
            <div className="sort-filter-box">
              <select aria-label="Filter by market day" value={marketDay} onChange={(e) => setMarketDay(e.target.value)}>
                <option value="">Any market day</option>
                {["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].map((day) => <option value={day} key={day}>{day[0].toUpperCase() + day.slice(1)}</option>)}
              </select>
            </div>

            {/* Price Slider */}
            <div className="price-slider-box">
              <div className="price-label-row">
                <span>Max Price:</span>
                <strong>Rs. {maxPrice}</strong>
              </div>
              <input
                type="range"
                min="100"
                max="600"
                step="20"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="range-slider"
              />
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="category-chips-scroll">
            <button
              className={`chip-button ${category === "all" ? "active" : ""}`}
              onClick={() => handleCategoryChange("all")}
            >
              All Items ({products.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.name}
                className={`chip-button ${category === c.slug ? "active" : ""}`}
                onClick={() => handleCategoryChange(c.slug)}
              >
                <span>{c.icon}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>

          {/* Results Summary */}
          <div className="results-summary-row">
            <span>
              Showing <strong>{filteredProducts.length}</strong> fresh products available for market pickup
            </span>
            {(category !== "all" || search || maxPrice < 600 || marketId || marketDay) && (
              <button
                className="reset-filters-btn"
                onClick={() => {
                  setCategory("all");
                  setSearch("");
                  setMaxPrice(600);
                  setMarketId("");
                  setMarketDay("");
                  params.delete("category");
                  setParams(params);
                }}
              >
                Reset All Filters
              </button>
            )}
          </div>

          {/* Product Grid */}
          <div className="products-responsive-grid">
            {filteredProducts.map((prod) => (
              <ProductCard product={prod} key={prod.id} />
            ))}
          </div>

          {/* Empty state */}
          {filteredProducts.length === 0 && (
            <div className="empty-cart-card">
              <div className="empty-cart-icon">🥬</div>
              <h2>No Matching Products Found</h2>
              <p>We couldn't find any produce matching your current filter criteria.</p>
              <button
                className="btn-primary"
                onClick={() => {
                  setCategory("all");
                  setSearch("");
                  setMaxPrice(600);
                  setMarketId("");
                  setMarketDay("");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </AnimatedPage>
  );
}