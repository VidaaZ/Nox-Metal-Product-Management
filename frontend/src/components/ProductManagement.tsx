import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { productsAPI } from '../lib/api';
import type { Product, ProductInput, ProductQuery } from '../types';
import styles from './ProductManagement.module.css';

interface ProductsResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const ProductManagement: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'created_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showDeleted, setShowDeleted] = useState(false);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductInput>({
    name: '',
    price: 0,
    description: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  const isAdmin = user?.role === 'admin';

  // Check URL params for actions
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'create' && isAdmin) {
      setShowForm(true);
      setEditingProduct(null);
      setFormData({ name: '', price: 0, description: '' });
    }
  }, [searchParams, isAdmin]);

  // Load products
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const query: ProductQuery = {
        page: currentPage,
        limit: 10,
        search: search || undefined,
        sortBy,
        sortOrder,
        includeDeleted: isAdmin ? showDeleted : undefined
      };

      const response = await productsAPI.getProducts(query);
      console.log('Products response:', response);
      setProducts(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalProducts(response.pagination.total);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [currentPage, search, sortBy, sortOrder, showDeleted]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    try {
      setFormLoading(true);
      
      if (editingProduct) {
        await productsAPI.updateProduct(editingProduct.id, formData);
      } else {
        await productsAPI.createProduct(formData);
      }
      
      setShowForm(false);
      setEditingProduct(null);
      setFormData({ name: '', price: 0, description: '' });
      searchParams.delete('action');
      setSearchParams(searchParams);
      await loadProducts();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save product');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle product deletion
  const handleDelete = async (product: Product) => {
    if (!isAdmin) return;
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    try {
      await productsAPI.deleteProduct(product.id);
      await loadProducts();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete product');
    }
  };

  // Handle product restoration
  const handleRestore = async (product: Product) => {
    if (!isAdmin) return;
    if (!confirm(`Are you sure you want to restore "${product.name}"?`)) return;

    try {
      await productsAPI.restoreProduct(product.id);
      await loadProducts();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to restore product');
    }
  };

  // Handle edit
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || ''
    });
    setShowForm(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Toronto'
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Product Management</h1>
          <p className={styles.subtitle}>
            {isAdmin ? 'Manage your product catalog' : 'Browse product catalog'}
          </p>
        </div>

        {error && (
          <div className={styles.error}>
            <div className={styles.errorText}>{error}</div>
          </div>
        )}

        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.controlsRow}>
            {/* Search */}
            <div className={styles.searchContainer}>
              <label className={styles.searchLabel}>Search</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className={styles.searchInput}
              />
            </div>

            {/* Sort By */}
            <div className={styles.sortContainer}>
              <label className={styles.sortLabel}>Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'created_at')}
                className={styles.sortSelect}
              >
                <option value="created_at">Date Created</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className={styles.orderContainer}>
              <label className={styles.sortLabel}>Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className={styles.sortSelect}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            {/* Show Deleted (Admin only) */}
            {isAdmin && (
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="showDeleted"
                  checked={showDeleted}
                  onChange={(e) => setShowDeleted(e.target.checked)}
                  className={styles.checkbox}
                />
                <label htmlFor="showDeleted" className={styles.checkboxLabel}>
                  Show deleted
                </label>
              </div>
            )}

            {/* Add Product Button */}
            {isAdmin && (
              <button
                                  onClick={() => {
                    setShowForm(true);
                    setEditingProduct(null);
                                          setFormData({ name: '', price: 0, description: '' });
                  }}
                className={styles.addButton}
              >
                <svg className={styles.addIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Product</span>
              </button>
            )}
          </div>
        </div>

        {/* Product Form Modal */}
        {showForm && isAdmin && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3 className={styles.modalTitle}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className={styles.formTextarea}
                  />
                </div>



                <div className={styles.formButtons}>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className={styles.submitButton}
                  >
                    {formLoading ? 'Saving...' : editingProduct ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingProduct(null);
                      searchParams.delete('action');
                      setSearchParams(searchParams);
                    }}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className={styles.productsContainer}>
          <div className={styles.productsHeader}>
            <h3 className={styles.productsTitle}>
              Products ({totalProducts})
            </h3>
          </div>

          <div className={styles.productsContent}>
            {loading ? (
              <div className={styles.loadingContainer}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className={styles.loadingItem}>
                    <div className={styles.loadingBar1}></div>
                    <div className={styles.loadingBar2}></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className={styles.emptyContainer}>
                <div className={styles.emptyIcon}>📦</div>
                <h3 className={styles.emptyTitle}>No products found</h3>
                <p className={styles.emptyText}>
                  {search ? 'Try adjusting your search criteria.' : 'Get started by creating a new product.'}
                </p>
                {isAdmin && !search && (
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setEditingProduct(null);
                      setFormData({ name: '', price: 0, description: '' });
                    }}
                    className={styles.createFirstButton}
                  >
                    Create First Product
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className={styles.productsList}>
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className={`${styles.productCard} ${product.is_deleted ? styles.deleted : ''}`}
                    >
                      <div className={styles.productContent}>
                        <div className={styles.productInfo}>
                          <div className={styles.productHeader}>
                            <h4 className={styles.productName}>
                              {product.name}
                            </h4>
                            {product.is_deleted && (
                              <span className={styles.deletedBadge}>
                                Deleted
                              </span>
                            )}
                          </div>
                          
                          <p className={styles.productPrice}>
                            {formatPrice(product.price)}
                          </p>
                          
                          {product.description && (
                            <p className={styles.productDescription}>
                              {product.description}
                            </p>
                          )}
                          
                          <div className={styles.productMeta}>
                            <span>Created: {formatDate(product.created_at)}</span>
                            {product.updated_at !== product.created_at && (
                              <span>Updated: {formatDate(product.updated_at)}</span>
                            )}
                            {product.created_by_email && (
                              <span>By: {product.created_by_email}</span>
                            )}
                          </div>
                        </div>

                                                 <div className={styles.productActions}>
                          {isAdmin && (
                            <div className={styles.actionButtons}>
                              {!product.is_deleted ? (
                                <>
                                  <button
                                    onClick={() => handleEdit(product)}
                                    className={`${styles.actionButton} ${styles.editButton}`}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(product)}
                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                  >
                                    Delete
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleRestore(product)}
                                  className={`${styles.actionButton} ${styles.restoreButton}`}
                                >
                                  Restore
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <div className={styles.paginationInfo}>
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className={styles.paginationButtons}>
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

export default ProductManagement; 