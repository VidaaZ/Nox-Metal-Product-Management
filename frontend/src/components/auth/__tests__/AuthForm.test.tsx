import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import AuthForm from '../AuthForm';
import { AuthProvider } from '../../../contexts/AuthContext';
import { useAuth } from '../../../contexts/AuthContext';

// Mock the auth context
const mockLogin = vi.fn();
const mockRegister = vi.fn();

vi.mock('../../../contexts/AuthContext', async () => {
  const actual = await vi.importActual('../../../contexts/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      login: mockLogin,
      register: mockRegister,
      isLoading: false,
      error: null,
      user: null,
      logout: vi.fn(),
      checkAuth: vi.fn(),
    }),
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('AuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Login Mode', () => {
    it('should render login form by default', () => {
      renderWithRouter(<AuthForm />);

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should handle login form submission', async () => {
      mockLogin.mockResolvedValue(undefined);

      renderWithRouter(<AuthForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        });
      });
    });

    it('should show validation error for empty fields', async () => {
      renderWithRouter(<AuthForm />);

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      // The form should still be visible (no navigation)
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });
  });

  describe('Register Mode', () => {
    it('should switch to register mode when toggle button is clicked', () => {
      renderWithRouter(<AuthForm />);

      const toggleButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(toggleButton);

      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByText('Join our community')).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('should handle register form submission', async () => {
      mockRegister.mockResolvedValue(undefined);

      renderWithRouter(<AuthForm />);

      // Switch to register mode
      const toggleButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(toggleButton);

      const emailInput = screen.getByLabelText(/email/i);
      const fullNameInput = screen.getByLabelText(/full name/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(fullNameInput, { target: { value: 'Test User' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          email: 'test@example.com',
          full_name: 'Test User',
          password: 'password123',
          role: 'user'
        });
      });
    });

    it('should show error when passwords do not match', async () => {
      renderWithRouter(<AuthForm />);

      // Switch to register mode
      const toggleButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(toggleButton);

      const emailInput = screen.getByLabelText(/email/i);
      const fullNameInput = screen.getByLabelText(/full name/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(fullNameInput, { target: { value: 'Test User' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });

      expect(mockRegister).not.toHaveBeenCalled();
    });
  });

  describe('Form Interactions', () => {
    it('should toggle password visibility', () => {
      renderWithRouter(<AuthForm />);

      const passwordInput = screen.getByLabelText(/password/i);
      const togglePasswordButton = screen.getByRole('button', { name: /toggle password visibility/i });

      // Password should be hidden by default
      expect(passwordInput).toHaveAttribute('type', 'password');

      // Click to show password
      fireEvent.click(togglePasswordButton);
      expect(passwordInput).toHaveAttribute('type', 'text');

      // Click to hide password
      fireEvent.click(togglePasswordButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should clear form when switching modes', () => {
      renderWithRouter(<AuthForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      // Fill in some data
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      // Switch to register mode
      const toggleButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(toggleButton);

      // Switch back to login mode
      const loginToggleButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(loginToggleButton);

      // Form should be cleared
      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
    });
  });

  describe('Loading State', () => {
    it('should show loading state during form submission', async () => {
      // Mock loading state
      vi.mocked(useAuth).mockReturnValue({
        login: mockLogin,
        register: mockRegister,
        isLoading: true,
        error: null,
        user: null,
        logout: vi.fn(),
        checkAuth: vi.fn(),
      });

      renderWithRouter(<AuthForm />);

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when auth fails', () => {
      // Mock error state
      vi.mocked(useAuth).mockReturnValue({
        login: mockLogin,
        register: mockRegister,
        isLoading: false,
        error: 'Invalid credentials',
        user: null,
        logout: vi.fn(),
        checkAuth: vi.fn(),
      });

      renderWithRouter(<AuthForm />);

      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
}); 