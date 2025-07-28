import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { auditAPI } from '../lib/api';
import type { AuditLog, AuditLogsResponse } from '../types';
import styles from './AuditLogs.module.css';

const AuditLogs: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  const isAdmin = user?.role === 'admin';

  const loadLogs = async () => {
    if (!isAdmin) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await auditAPI.getLogs(currentPage, 20);
      setLogs(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalLogs(response.pagination.total);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [currentPage, isAdmin]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionIconClass = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return styles.create;
      case 'update':
        return styles.update;
      case 'delete':
        return styles.delete;
      case 'restore':
        return styles.restore;
      default:
        return styles.default;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'update':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'delete':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        );
      case 'restore':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      default:
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  if (!isAdmin) {
    return (
      <div className={styles.accessDenied}>
        <div className={styles.accessDeniedWrapper}>
          <div className={styles.accessDeniedContent}>
            <h1 className={styles.accessDeniedTitle}>Access Denied</h1>
            <p className={styles.accessDeniedText}>You need admin privileges to view audit logs.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Audit Logs</h1>
          <p className={styles.subtitle}>
            Track all product-related activities and system changes.
          </p>
        </div>

        {error && (
          <div className={styles.error}>
            <div className={styles.errorText}>{error}</div>
          </div>
        )}

        {/* Stats */}
        <div className={styles.statsCard}>
          <div className={styles.statsContent}>
            <div className={styles.statsHeader}>
              <div className={styles.statsIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className={styles.statsInfo}>
                <div className={styles.statsLabel}>Total Audit Entries</div>
                <div className={styles.statsValue}>{totalLogs}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Logs */}
        <div className={styles.auditContainer}>
          <div className={styles.auditHeader}>
            <h3 className={styles.auditTitle}>Recent Activity</h3>
            <button
              onClick={loadLogs}
              disabled={loading}
              className={styles.refreshButton}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          <div className={styles.auditContent}>
            {loading ? (
              <div className={styles.loadingContainer}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={styles.loadingItem}>
                    <div className={styles.loadingBar1}></div>
                    <div className={styles.loadingBar2}></div>
                    <div className={styles.loadingBar3}></div>
                  </div>
                ))}
              </div>
            ) : logs.length === 0 ? (
              <div className={styles.emptyContainer}>
                <svg className={styles.emptyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className={styles.emptyTitle}>No audit logs found</h3>
                <p className={styles.emptyText}>
                  Audit logs will appear here as users perform actions.
                </p>
              </div>
            ) : (
              <>
                <div className={styles.timeline}>
                  <ul className={styles.timelineList}>
                    {logs.map((log, logIdx) => (
                      <li key={log.id} className={styles.timelineItem}>
                        <div className={styles.timelineContent}>
                          <div className={`${styles.timelineIcon} ${getActionIconClass(log.action)}`}>
                            {getActionIcon(log.action)}
                          </div>
                          <div className={styles.timelineDetails}>
                            <p className={styles.timelineText}>
                              <strong>{log.user_email}</strong>{' '}
                              <span className="lowercase">{log.action}</span>{' '}
                              {log.product_name && (
                                <>
                                  product <strong>"{log.product_name}"</strong>
                                </>
                              )}
                              {log.product_id && (
                                <span className={styles.timelineDetailsText}> (ID: {log.product_id})</span>
                              )}
                            </p>
                            {log.details && (
                              <p className={styles.timelineDetailsText}>
                                {log.details}
                              </p>
                            )}
                          </div>
                          <div className={styles.timelineTimestamp}>
                            {formatDate(log.timestamp)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <div className={styles.paginationMobile}>
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={styles.paginationButton}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={styles.paginationButton}
                      >
                        Next
                      </button>
                    </div>
                    <div className={styles.paginationDesktop}>
                      <div className={styles.paginationInfo}>
                        Page <strong>{currentPage}</strong> of{' '}
                        <strong>{totalPages}</strong>
                      </div>
                      <div className={styles.paginationNav}>
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={`${styles.paginationButton} ${styles.roundedLeft}`}
                        >
                          Previous
                        </button>
                        
                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`${styles.paginationButton} ${
                                page === currentPage ? styles.active : ''
                              } ${i === 0 ? styles.roundedLeft : ''} ${
                                i === Math.min(4, totalPages - 1) ? styles.roundedRight : ''
                              } ${i > 0 && i < Math.min(4, totalPages - 1) ? styles.middle : ''}`}
                            >
                              {page}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className={`${styles.paginationButton} ${styles.roundedRight}`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs; 