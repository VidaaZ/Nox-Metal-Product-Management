import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { productsAPI } from '../lib/api';
import styles from './Dashboard.module.css';

interface DashboardStats {
  totalProducts: number;
  deletedProducts: number;
  recentActions: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    deletedProducts: 0,
    recentActions: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Fetch total products
        const productsResponse = await productsAPI.getProducts({ 
          page: 1, 
          limit: 1,
          includeDeleted: user?.role === 'admin' ? false : undefined 
        });
        
        let deletedCount = 0;
        if (user?.role === 'admin') {
          // Fetch deleted products count for admin
          const deletedResponse = await productsAPI.getProducts({ 
            page: 1, 
            limit: 1,
            includeDeleted: true 
          });
          deletedCount = Math.max(0, deletedResponse.pagination.total - productsResponse.pagination.total);
        }

        setStats({
          totalProducts: productsResponse.pagination.total,
          deletedProducts: deletedCount,
          recentActions: 0 // Could be implemented with audit logs API
        });
      } catch (err: any) {
        setError('Failed to load dashboard stats');
        console.error('Dashboard stats error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user?.role]);

  const isAdmin = user?.role === 'admin';

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingWrapper}>
          <div className={styles.loadingTitle}></div>
          <div className={styles.loadingGrid}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.loadingCard}>
                <div className={styles.loadingLabel}></div>
                <div className={styles.loadingValue}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Welcome back, {user?.email}!
          </h1>
          <p className={styles.subtitle}>
            Here's what's happening with your product management system.
          </p>
        </div>

        {error && (
          <div className={styles.error}>
            <div className={styles.errorText}>{error}</div>
          </div>
        )}

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statHeader}>
                <div className={`${styles.statIcon} ${styles.blue}`}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
                  </svg>
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statLabel}>Total Products</div>
                  <div className={styles.statValue}>{stats.totalProducts}</div>
                </div>
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statHeader}>
                  <div className={`${styles.statIcon} ${styles.red}`}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div className={styles.statInfo}>
                    <div className={styles.statLabel}>Deleted Products</div>
                    <div className={styles.statValue}>{stats.deletedProducts}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statHeader}>
                <div className={`${styles.statIcon} ${styles.green}`}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statLabel}>Your Role</div>
                  <div className={styles.statValue}>{user?.role}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <div className={styles.quickActionsHeader}>
            <h3 className={styles.quickActionsTitle}>Quick Actions</h3>
          </div>
          <div className={styles.quickActionsContent}>
            <div className={styles.quickActionsGrid}>
              <Link to="/products" className={styles.actionCard}>
                <div className={`${styles.actionIcon} ${styles.blue}`}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className={styles.actionTitle}>View Products</h3>
                  <p className={styles.actionDescription}>
                    Browse and search through all products in the system.
                  </p>
                </div>
              </Link>

              {isAdmin && (
                <>
                  <Link to="/products?action=create" className={styles.actionCard}>
                    <div className={`${styles.actionIcon} ${styles.green}`}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className={styles.actionTitle}>Add Product</h3>
                      <p className={styles.actionDescription}>
                        Create a new product in the system.
                      </p>
                    </div>
                  </Link>

                  <Link to="/audit-logs" className={styles.actionCard}>
                    <div className={`${styles.actionIcon} ${styles.purple}`}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className={styles.actionTitle}>Audit Logs</h3>
                      <p className={styles.actionDescription}>
                        View system activity and audit trail.
                      </p>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className={styles.featuresOverview}>
          <div className={styles.featuresHeader}>
            <h3 className={styles.featuresTitle}>System Features</h3>
          </div>
          <div className={styles.featuresContent}>
            <div className={styles.featuresGrid}>
              <div className={styles.featureSection}>
                <h4 className={`${styles.featureSectionTitle} ${styles.implemented}`}>
                  ✅ Implemented Features
                </h4>
                <ul className={`${styles.featureList} ${styles.implemented}`}>
                  <li className={styles.featureItem}>JWT Authentication & Authorization</li>
                  <li className={styles.featureItem}>Role-based Access Control</li>
                  <li className={styles.featureItem}>Product CRUD Operations</li>
                  <li className={styles.featureItem}>Search, Pagination & Sorting</li>
                  <li className={styles.featureItem}>Soft Delete Functionality</li>
                  <li className={styles.featureItem}>Comprehensive Audit Logging</li>
                  <li className={styles.featureItem}>Responsive Product Management UI</li>
                  <li className={styles.featureItem}>Admin Dashboard & Controls</li>
                </ul>
              </div>
              <div className={styles.featureSection}>
                <h4 className={`${styles.featureSectionTitle} ${styles.permissions}`}>
                  📋 Your Permissions
                </h4>
                <ul className={`${styles.featureList} ${styles.permissions}`}>
                  <li className={styles.featureItem}>View all products</li>
                  <li className={styles.featureItem}>Search and filter products</li>
                  {isAdmin ? (
                    <>
                      <li className={styles.featureItem}>Create new products</li>
                      <li className={styles.featureItem}>Edit existing products</li>
                      <li className={styles.featureItem}>Delete/restore products</li>
                      <li className={styles.featureItem}>View deleted products</li>
                      <li className={styles.featureItem}>Access audit logs</li>
                      <li className={styles.featureItem}>Manage all product data</li>
                    </>
                  ) : (
                    <li className={styles.featureItem}>Read-only access to products</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 