import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Navigation.module.css';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.navContent}>
          <div className={styles.leftSection}>
            <Link to="/dashboard" className={styles.brand}>
              <h1 className={styles.brandTitle}>
                Nox Metal
              </h1>
            </Link>
            
            <div className={styles.navLinks}>
              <Link
                to="/dashboard"
                className={`${styles.navLink} ${isActive('/dashboard') ? styles.active : ''}`}
              >
                Dashboard
              </Link>
              
              <Link
                to="/products"
                className={`${styles.navLink} ${isActive('/products') ? styles.active : ''}`}
              >
                Products
              </Link>
              
              {user?.role === 'admin' && (
                <Link
                  to="/audit-logs"
                  className={`${styles.navLink} ${isActive('/audit-logs') ? styles.active : ''}`}
                >
                  Audit Logs
                </Link>
              )}
            </div>
          </div>

          <div className={styles.rightSection}>
            <div className={styles.userInfo}>
              <span className={styles.userEmail}>
                {user?.email}
              </span>
              <span className={`${styles.userRole} ${user?.role === 'admin' ? styles.admin : styles.user}`}>
                {user?.role}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.mobileMenuContent}>
          <Link
            to="/dashboard"
            className={`${styles.mobileNavLink} ${isActive('/dashboard') ? styles.active : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          
          <Link
            to="/products"
            className={`${styles.mobileNavLink} ${isActive('/products') ? styles.active : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Products
          </Link>
          
          {user?.role === 'admin' && (
            <Link
              to="/audit-logs"
              className={`${styles.mobileNavLink} ${isActive('/audit-logs') ? styles.active : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Audit Logs
            </Link>
          )}
        </div>
        
        <div className={styles.mobileUserInfo}>
          <div className={styles.mobileUserDetails}>
            <span className={styles.userEmail}>
              {user?.email}
            </span>
            <span className={`${styles.userRole} ${user?.role === 'admin' ? styles.admin : styles.user}`}>
              {user?.role}
            </span>
          </div>
          
          <button
            onClick={handleLogout}
            className={styles.mobileLogoutButton}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 