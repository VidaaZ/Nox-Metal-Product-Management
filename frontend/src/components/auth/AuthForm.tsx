import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { LoginCredentials, RegisterCredentials } from '../../types';
import styles from './AuthForm.module.css';

type AuthMode = 'login' | 'register';

const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isLoading, error } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin'
  });

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        const loginData: LoginCredentials = {
          email: credentials.email,
          password: credentials.password
        };
        await login(loginData);
      } else {
        const registerData: RegisterCredentials = {
          email: credentials.email,
          password: credentials.password,
          role: credentials.role
        };
        await register(registerData);
      }
      navigate(from, { replace: true });
    } catch (error) {
      // Error handled by context
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    // Clear any existing errors when switching modes
    setCredentials({
      email: '',
      password: '',
      role: 'user'
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        {/* Form Card */}
        <div className={styles.formCard}>
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className={styles.subtitle}>
              {mode === 'login' ? 'Sign in to your account' : 'Join our community'}
            </p>
          </div>

          {error && (
            <div className={styles.error}>
              <svg className={styles.errorIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
          
          <div className={styles.formContent}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={styles.input}
                  placeholder="Enter your email"
                  value={credentials.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              
              <div className={styles.inputGroup}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className={styles.input}
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  minLength={6}
                />
              </div>

              {mode === 'login' && (
                <div className={styles.checkboxGroup}>
                  <input
                    id="showPassword"
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <label htmlFor="showPassword" className={styles.checkboxLabel}>
                    Show Password
                  </label>
                </div>
              )}

              {mode === 'register' && (
                <div className={styles.inputGroup}>
                  <select
                    id="role"
                    name="role"
                    value={credentials.role}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={styles.select}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={styles.submitButton}
              >
                {isLoading ? (
                  <span className={styles.loadingSpinner}>
                    <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                  </span>
                ) : (
                  mode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>
          </div>

          {/* Bottom Links */}
          <div className={styles.bottomLinks}>
            {mode === 'login' && (
              <div className={styles.forgotLinks}>
                <span>Forgot</span>
                <a href="#" className={styles.forgotLink}>Username</a>
                <span>/</span>
                <a href="#" className={styles.forgotLink}>Password</a>
                <span>?</span>
              </div>
            )}
            <div className={styles.switchMode}>
              <span>
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                type="button"
                onClick={toggleMode}
                className={styles.switchButton}
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm; 