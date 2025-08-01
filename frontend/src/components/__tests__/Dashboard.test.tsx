import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Dashboard from '../Dashboard';

// Mock the auth context
const mockUser = {
  id: 1,
  email: 'test@example.com',
  full_name: 'Test User',
  role: 'user' as const
};

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    logout: vi.fn(),
    isLoading: false,
    error: null,
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dashboard with user information', () => {
    renderWithRouter(<Dashboard />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Welcome, Test User!')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('should display admin role correctly', () => {
    const adminUser = {
      ...mockUser,
      role: 'admin' as const
    };

    vi.mocked(useAuth).mockReturnValue({
      user: adminUser,
      logout: vi.fn(),
      isLoading: false,
      error: null,
    });

    renderWithRouter(<Dashboard />);

    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    renderWithRouter(<Dashboard />);

    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Audit Logs')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      logout: vi.fn(),
      isLoading: true,
      error: null,
    });

    renderWithRouter(<Dashboard />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show error state', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      logout: vi.fn(),
      isLoading: false,
      error: 'Something went wrong',
    });

    renderWithRouter(<Dashboard />);

    expect(screen.getByText('Error: Something went wrong')).toBeInTheDocument();
  });

  it('should handle missing user gracefully', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      logout: vi.fn(),
      isLoading: false,
      error: null,
    });

    renderWithRouter(<Dashboard />);

    expect(screen.getByText('Welcome, Guest!')).toBeInTheDocument();
    expect(screen.getByText('No user information available')).toBeInTheDocument();
  });
}); 