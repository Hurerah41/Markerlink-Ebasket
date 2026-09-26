import { Link, NavLink } from "react-router-dom";
import { ShoppingBasket, Heart, Menu, X, UserRound, Sprout, Store, ShieldCheck, ChevronRight, ClipboardList, Sun, Moon, LogIn, Bell, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { getToken } from "../api/client";
import { useStore } from "../context/StoreContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { cartCount, favorites, currentUser, notifications, unreadNotifications, markNotificationRead, markAllNotificationsRead } = useStore();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const isAuthenticated = Boolean(getToken());
  const isCustomer = currentUser.role === "customer";
  const roleDashboardPath = currentUser.role === "farmer" ? (currentUser.accountStatus === "pending" ? "/farmer/pending" : "/farmer/dashboard") : currentUser.role === "admin" ? "/admin/dashboard" : null;
  const roleLabel = { customer: "Customer", farmer: "Farmer", admin: "Admin" };
  const navLinks = isCustomer ? [
    { to: "/products", label: "Fresh Products" },
    { to: "/farmers", label: "Our Farmers" },
    { to: "/markets", label: "Nearby Markets" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ] : [];

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-sticky">
      <nav className="navbar-main">
        <div className="container nav-content">
          <Link to="/" className="brand-logo" onClick={closeMobile}>
            <div className="logo-badge"><Sprout size={22} className="logo-leaf" /></div>
            <div className="logo-text-wrap"><div className="logo-title">Market<span>Link</span></div><span className="logo-tagline">eGreen Basket</span></div>
          </Link>

          <div className="nav-desktop-links">
            {navLinks.map((item) => <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>{item.label}</NavLink>)}
            {roleDashboardPath && <NavLink to={roleDashboardPath} className={({ isActive }) => `nav-link dashboard-nav-link ${isActive ? "active" : ""}`}><span>{currentUser.role === "admin" ? "Admin Dashboard" : currentUser.accountStatus === "pending" ? "Application Status" : "Farmer Dashboard"}</span></NavLink>}
          </div>

          <div className="nav-actions-group">
            {isAuthenticated && <div className="notification-menu-wrap">
              <button type="button" className="icon-action-btn" aria-label={`Notifications${unreadNotifications ? `, ${unreadNotifications} unread` : ""}`} onClick={() => setNotificationsOpen((open) => !open)}>
                <Bell size={20} />
                {unreadNotifications > 0 && <span className="action-badge fav-badge">{unreadNotifications}</span>}
              </button>
              {notificationsOpen && <div className="notification-popover" role="dialog" aria-label="Notifications">
                <div className="notification-popover-head"><strong>Notifications</strong><button type="button" onClick={markAllNotificationsRead}><CheckCheck size={15} /> Mark all read</button></div>
                <div className="notification-list">
                  {notifications.slice(0, 12).map((item) => <button type="button" key={item._id} className={`notification-item ${item.read ? "" : "unread"}`} onClick={() => markNotificationRead(item._id)}>
                    <strong>{item.title}</strong><span>{item.message}</span><small>{new Date(item.createdAt).toLocaleString()}</small>
                  </button>)}
                  {!notifications.length && <p className="notification-empty">No notifications yet.</p>}
                </div>
              </div>}
            </div>}
            {isCustomer && <>
              <Link to="/orders" className="icon-action-btn" aria-label="My Orders" title="My Orders"><ClipboardList size={20} /></Link>
              <Link to="/favorites" className="icon-action-btn" aria-label="Favorites" title="Favorites"><Heart size={20} />{favorites.length > 0 && <motion.span className="action-badge fav-badge" initial={{ scale: 0 }} animate={{ scale: 1 }}>{favorites.length}</motion.span>}</Link>
              <Link to="/cart" className="cart-action-btn" aria-label="Basket"><div className="cart-icon-box"><ShoppingBasket size={20} /><AnimatePresence mode="wait"><motion.span key={cartCount} className="action-badge cart-badge" initial={{ scale: 0.4, y: -4 }} animate={{ scale: 1, y: 0 }}>{cartCount}</motion.span></AnimatePresence></div><span className="cart-label-text">Basket</span></Link>
            </>}

            <Link to={isAuthenticated ? "/profile" : "/login"} className="user-profile-btn" title={isAuthenticated ? "Open profile" : "Sign in"}>
              <div className="user-avatar-mini">{isAuthenticated ? <UserRound size={16} /> : <LogIn size={16} />}</div>
              <div className="user-info-text"><span className="user-name-label">{isAuthenticated ? (currentUser.name || "Profile").split(" ")[0] : "Sign in"}</span><small className="user-role-label">{isAuthenticated ? roleLabel[currentUser.role] : "Account"}</small></div>
            </Link>
            <button className="theme-toggle-btn" onClick={toggleTheme} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} title={isDark ? "Light mode" : "Dark mode"}>{isDark ? <Sun size={18} /> : <Moon size={18} />}</button>
            <button className="mobile-toggle-btn" onClick={() => setMobileMenuOpen((open) => !open)} aria-label="Toggle navigation menu">{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && <motion.div className="mobile-drawer" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.28 }}>
          <div className="container mobile-drawer-inner">
            <div className="mobile-drawer-links">
              {navLinks.map((item) => <NavLink key={item.to} to={item.to} onClick={closeMobile} className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}><span>{item.label}</span><ChevronRight size={16} /></NavLink>)}
              {roleDashboardPath && <NavLink to={roleDashboardPath} onClick={closeMobile} className="mobile-nav-item farmer-mobile-item"><span className="flex-row-gap">{currentUser.role === "admin" ? <ShieldCheck size={18} /> : <Store size={18} />} {currentUser.role === "admin" ? "Admin Dashboard" : currentUser.accountStatus === "pending" ? "Application Status" : "Farmer Dashboard"}</span><ChevronRight size={16} /></NavLink>}
              {isCustomer && <><NavLink to="/orders" onClick={closeMobile} className="mobile-nav-item"><span>My Orders</span><ChevronRight size={16} /></NavLink><NavLink to="/favorites" onClick={closeMobile} className="mobile-nav-item"><span>My Favorites ({favorites.length})</span><ChevronRight size={16} /></NavLink><NavLink to="/cart" onClick={closeMobile} className="mobile-nav-item"><span>Basket ({cartCount})</span><ChevronRight size={16} /></NavLink></>}
              {isAuthenticated && <NavLink to="/profile" onClick={closeMobile} className="mobile-nav-item"><span>Profile & Settings</span><ChevronRight size={16} /></NavLink>}
            </div>
            <div className="mobile-drawer-footer"><span className="role-toggle-mobile">{isAuthenticated ? `Signed in as ${roleLabel[currentUser.role]}` : "Welcome to MarketLink"}</span><div className="mobile-auth-row">{isAuthenticated ? <Link to="/profile" className="btn-outline" onClick={closeMobile}>Profile</Link> : <Link to="/login" className="btn-outline" onClick={closeMobile}>Sign In</Link>}<Link to="/register" className="btn-solid" onClick={closeMobile}>Register</Link><button className="btn-outline" onClick={() => { toggleTheme(); closeMobile(); }}>{isDark ? "Light mode" : "Dark mode"}</button></div></div>
          </div>
        </motion.div>}
      </AnimatePresence>
    </header>
  );
}
