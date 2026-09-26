import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, CheckCircle2, Clock3, MapPin, Store, ArrowLeft, ArrowRight, ShieldCheck, User, Phone, FileText } from "lucide-react";
import AnimatedPage from "../components/AnimatedPage";
import { useStore } from "../context/StoreContext";

export default function Checkout() {
  const { cart, subtotal, markets, placeOrder, currentUser, notify } = useStore();
  const navigate = useNavigate();

  const cartMarket = markets.find((market) => market.id === cart[0]?.marketId);
  const farmer = cart[0]?.farmerObject || {};
  const farmerDays = (farmer.operatingDays || []).map((day) => day.toLowerCase());
  const marketDays = (cartMarket?.marketDays || []).map((day) => day.toLowerCase());
  const validDays = farmerDays.length && marketDays.length ? farmerDays.filter((day) => marketDays.includes(day)) : (farmerDays.length ? farmerDays : marketDays);
  const nextPickupDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    for (let i = 0; i < 14; i += 1) {
      const weekday = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
      if (!validDays.length || validDays.includes(weekday)) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      }
      date.setDate(date.getDate() + 1);
    }
    return "";
  }, [validDays.join(",")]);
  const pickupSlots = useMemo(() => {
    const start = farmer.pickupStartTime || cartMarket?.openingTime;
    const end = farmer.pickupEndTime || cartMarket?.closingTime;
    if (!start || !end) return [];
    const toMinutes = (value) => { const [h, m] = value.split(":").map(Number); return h * 60 + m; };
    const format = (minutes) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
    const size = Number(farmer.pickupSlotMinutes || 60);
    const slots = [];
    for (let cursor = toMinutes(start); cursor + size <= toMinutes(end); cursor += size) {
      slots.push(`${format(cursor)} - ${format(cursor + size)}`);
    }
    return slots;
  }, [farmer.pickupStartTime, farmer.pickupEndTime, farmer.pickupSlotMinutes, cartMarket?.openingTime, cartMarket?.closingTime]);
  const [pickupDate, setPickupDate] = useState(nextPickupDate);
  const [pickupTime, setPickupTime] = useState(pickupSlots[0] || "");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!cart.length) {
    return (
      <AnimatedPage>
        <div className="container section-padding">
          <div className="empty-cart-card">
            <h2>Your Pre-Order Basket is Empty</h2>
            <p>Please select some fresh produce before setting up your market pickup slot.</p>
            <Link className="btn-primary-large" to="/products">
              Browse Fresh Harvest <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  const cartMarketName = cart[0]?.market || "";
  const chosenMarketObj = cartMarket || { name: cartMarketName || "Selected market", address: "", timing: "", landmark: "" };

  const handleSubmitPreOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await placeOrder({ pickupDate, pickupSlot: pickupTime, notes });
      navigate("/orders");
    } catch (requestError) {
      setError(requestError.message || "Unable to place this order");
      notify("Checkout could not be completed", requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedPage>
      <section className="section-padding">
        <div className="container narrow-container">
          <Link to="/cart" className="back-nav-link">
            <ArrowLeft size={16} /> Return to Basket
          </Link>

          <div className="checkout-title-wrap">
            <span className="eyebrow">SRS Pre-Order Reservation</span>
            <h1 className="page-title">Select Your Market Pickup</h1>
            <p className="page-subtitle">
              Farmers will harvest and pack your order for easy pickup. Payment is settled in person upon collection.
            </p>
          </div>

          <div className="checkout-grid-layout">
            {/* Form */}
            <form onSubmit={handleSubmitPreOrder} className="checkout-form-card">
              {error && <div className="form-error-message" role="alert">{error}</div>}
              <h3 className="form-subheading">1. Confirm Pickup Market Hub</h3>

              <div className="form-field-group">
                <label>
                  <MapPin size={15} /> Pickup Farmers Market
                </label>
                <input value={chosenMarketObj.name} readOnly aria-readonly="true" />
                <small>The market is determined by the products in your basket.</small>
              </div>

              {/* Market Location Details Box */}
              <div className="market-highlight-box">
                <div className="m-icon">📍</div>
                <div className="m-text">
                  <strong>{chosenMarketObj.name}</strong>
                  <p>{chosenMarketObj.address} • {chosenMarketObj.timing || `${chosenMarketObj.openingTime || "08:00"} – ${chosenMarketObj.closingTime || "14:00"}`}</p>
                  <small className="m-landmark">Landmark: {chosenMarketObj.landmark || "See map for directions"}</small>
                </div>
              </div>

              <h3 className="form-subheading">2. Date & Convenient Time Slot</h3>

              <div className="form-two-cols">
                <div className="form-field-group">
                  <label>
                    <CalendarDays size={15} /> Pickup Date
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={nextPickupDate}
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label>
                    <Clock3 size={15} /> Preferred Time Window
                  </label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="custom-select"
                    required
                  >
                    {!pickupSlots.length && <option value="">No pickup slots configured</option>}
                    {pickupSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                  </select>
                </div>
              </div>

              <h3 className="form-subheading">3. Customer Information</h3>

              <div className="form-two-cols">
                <div className="form-field-group">
                  <label>
                    <User size={15} /> Full Name
                  </label>
                  <input
                    type="text"
                    value={currentUser.name || ""}
                    placeholder="Your Name"
                    readOnly
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label>
                    <Phone size={15} /> Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={currentUser.phone || ""}
                    placeholder="+92 300 0000000"
                    readOnly
                    required
                  />
                </div>
              </div>
              {!currentUser.phone && <p className="form-error-message">Add a contact phone number in your profile before checkout.</p>}

              <div className="form-field-group">
                <label>
                  <FileText size={15} /> Packing Instructions / Requests (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please select slightly greener tomatoes for mid-week use..."
                />
              </div>

              <div className="checkout-order-summary-box">
                <div className="summary-row-mini">
                  <span>Reserved Items ({cart.length})</span>
                  <span>{cart.map((i) => i.name).join(", ")}</span>
                </div>
                <div className="summary-row-mini total-highlight">
                  <span>Total Due At Pickup</span>
                  <strong className="grand-total-large">Rs. {subtotal}</strong>
                </div>
              </div>

              <button
                type="submit"
                className="btn-confirm-order"
                disabled={isSubmitting || !pickupSlots.length || !currentUser.phone}
              >
                {isSubmitting ? (
                  <span>Reserving Your Basket...</span>
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    <span>Confirm Pre-Order (Pay Rs. {subtotal} at Pickup)</span>
                  </>
                )}
              </button>

              <div className="srs-guarantee-row">
                <span><ShieldCheck size={14} /> Zero upfront card fees</span>
                <span><CheckCircle2 size={14} /> SMS / Token confirmation</span>
                <span><Store size={14} /> Inspected before payment</span>
              </div>
            </form>
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
}