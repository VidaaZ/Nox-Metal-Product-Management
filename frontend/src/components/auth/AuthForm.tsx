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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [credentials, setCredentials] = useState({
    email: '',
    full_name: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'user' | 'admin'
  });

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous password error
    setPasswordError('');
    
    // Validate password confirmation for registration
    if (mode === 'register' && credentials.password !== credentials.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
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
          full_name: credentials.full_name,
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
    
    // Clear password error when user starts typing
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    // Clear any existing errors when switching modes
    setPasswordError('');
    setCredentials({
      email: '',
      full_name: '',
      password: '',
      confirmPassword: '',
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

          {passwordError && (
            <div className={styles.error}>
              <svg className={styles.errorIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {passwordError}
            </div>
          )}
          
          <div className={styles.formContent}>
            <form className={styles.form} onSubmit={handleSubmit}>
              {mode === 'register' && (
                <div className={styles.inputGroup}>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    className={styles.input}
                    placeholder="Enter your full name"
                    value={credentials.full_name}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              )}

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
                <div className={styles.passwordContainer}>
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
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <svg className={styles.eyeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className={styles.eyeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {mode === 'register' && (
                <div className={styles.inputGroup}>
                  <div className={styles.passwordContainer}>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      className={styles.input}
                      placeholder="Confirm your password"
                      value={credentials.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                      minLength={6}
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <svg className={styles.eyeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className={styles.eyeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}

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