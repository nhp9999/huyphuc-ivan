import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Layout from '../Layout';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { NavigationProvider } from '../../contexts/NavigationContext';
import { AuthProvider } from '../../../modules/auth/contexts/AuthContext';

// Mock the contexts and components
vi.mock('../../contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() })
}));

vi.mock('../../contexts/NavigationContext', () => ({
  NavigationProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useNavigation: () => ({ currentPage: 'dashboard', setCurrentPage: vi.fn() })
}));

vi.mock('../../../modules/auth/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: () => ({ user: { name: 'Test User', email: 'test@example.com' }, logout: vi.fn() })
}));

vi.mock('../SidebarOptimized', () => ({
  default: ({ isOpen, toggleSidebar, isMobile, onClose }: any) => (
    <div 
      data-testid="sidebar"
      data-open={isOpen}
      data-mobile={isMobile}
    >
      <button onClick={toggleSidebar} data-testid="sidebar-toggle">
        Toggle
      </button>
      <button onClick={onClose} data-testid="sidebar-close">
        Close
      </button>
    </div>
  )
}));

vi.mock('../Header', () => ({
  default: ({ toggleSidebar, isMobile }: any) => (
    <div data-testid="header" data-mobile={isMobile}>
      <button onClick={toggleSidebar} data-testid="header-menu">
        Menu
      </button>
    </div>
  )
}));

// Mock window.innerWidth
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

// Mock window.addEventListener and removeEventListener
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();
Object.defineProperty(window, 'addEventListener', {
  writable: true,
  configurable: true,
  value: mockAddEventListener,
});
Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  configurable: true,
  value: mockRemoveEventListener,
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <NavigationProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </NavigationProvider>
  </ThemeProvider>
);

describe('Responsive Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window width to desktop
    window.innerWidth = 1024;
  });

  afterEach(() => {
    // Clean up body classes
    document.body.classList.remove('sidebar-open');
    document.body.style.overflow = '';
  });

  it('should render sidebar and header', () => {
    render(
      <TestWrapper>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </TestWrapper>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should detect mobile mode when window width is less than 1024px', async () => {
    // Set mobile width
    window.innerWidth = 768;
    
    render(
      <TestWrapper>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </TestWrapper>
    );

    // Trigger resize event
    const resizeHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'resize'
    )?.[1];
    
    if (resizeHandler) {
      resizeHandler();
    }

    await waitFor(() => {
      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveAttribute('data-mobile', 'true');
    });
  });

  it('should detect desktop mode when window width is 1024px or more', async () => {
    // Set desktop width
    window.innerWidth = 1200;
    
    render(
      <TestWrapper>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </TestWrapper>
    );

    // Trigger resize event
    const resizeHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'resize'
    )?.[1];
    
    if (resizeHandler) {
      resizeHandler();
    }

    await waitFor(() => {
      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveAttribute('data-mobile', 'false');
    });
  });

  it('should toggle sidebar when toggle button is clicked', () => {
    render(
      <TestWrapper>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </TestWrapper>
    );

    const toggleButton = screen.getByTestId('sidebar-toggle');
    const sidebar = screen.getByTestId('sidebar');

    // Initially open on desktop
    expect(sidebar).toHaveAttribute('data-open', 'true');

    // Click to close
    fireEvent.click(toggleButton);
    expect(sidebar).toHaveAttribute('data-open', 'false');

    // Click to open
    fireEvent.click(toggleButton);
    expect(sidebar).toHaveAttribute('data-open', 'true');
  });

  it('should close sidebar with ESC key on mobile', async () => {
    // Set mobile width
    window.innerWidth = 768;
    
    render(
      <TestWrapper>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </TestWrapper>
    );

    // Trigger resize to set mobile mode
    const resizeHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'resize'
    )?.[1];
    
    if (resizeHandler) {
      resizeHandler();
    }

    // Open sidebar first
    const toggleButton = screen.getByTestId('sidebar-toggle');
    fireEvent.click(toggleButton);

    // Find keydown event listener
    const keydownHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'keydown'
    )?.[1];

    if (keydownHandler) {
      // Simulate ESC key press
      keydownHandler({ key: 'Escape' });
    }

    await waitFor(() => {
      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveAttribute('data-open', 'false');
    });
  });

  it('should prevent body scroll when mobile sidebar is open', async () => {
    // Set mobile width
    window.innerWidth = 768;
    
    render(
      <TestWrapper>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </TestWrapper>
    );

    // Trigger resize to set mobile mode
    const resizeHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'resize'
    )?.[1];
    
    if (resizeHandler) {
      resizeHandler();
    }

    // Open sidebar
    const toggleButton = screen.getByTestId('sidebar-toggle');
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(document.body.classList.contains('sidebar-open')).toBe(true);
      expect(document.body.style.overflow).toBe('hidden');
    });

    // Close sidebar
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(document.body.classList.contains('sidebar-open')).toBe(false);
      expect(document.body.style.overflow).toBe('');
    });
  });

  it('should clean up event listeners on unmount', () => {
    const { unmount } = render(
      <TestWrapper>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </TestWrapper>
    );

    // Verify event listeners were added
    expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(mockAddEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));

    // Unmount component
    unmount();

    // Verify event listeners were removed
    expect(mockRemoveEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(mockRemoveEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});
