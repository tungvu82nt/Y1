import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  const renderAuthHook = () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    
    return renderHook(() => useAuth(), { wrapper });
  };

  it('should initialize with no user', () => {
    const { result } = renderAuthHook();
    
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(typeof result.current.register).toBe('function');
  });

  it('should load user from localStorage on mount', () => {
    const mockUser = { id: 'user-1', name: 'Test User', token: 'test-token' };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));
    
    const { result } = renderAuthHook();
    
    expect(result.current.user).toEqual(mockUser);
  });

  it('should handle login successfully', async () => {
    const mockUser = { id: 'user-1', name: 'Test User', token: 'test-token' };
    
    const { result } = renderAuthHook();
    
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    
    expect(result.current.user).toEqual(mockUser);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('yapee_user', JSON.stringify(mockUser));
  });

  it('should handle logout', () => {
    const mockUser = { id: 'user-1', name: 'Test User', token: 'test-token' };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));
    
    const { result } = renderAuthHook();
    
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.user).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('yapee_user');
  });

  it('should handle registration', async () => {
    const newUser = { name: 'New User', email: 'new@example.com' };
    
    const { result } = renderAuthHook();
    
    await act(async () => {
      await result.current.register('New User', 'new@example.com', 'password');
    });
    
    // Should not be logged in immediately after registration
    expect(result.current.user).toBeNull();
  });

  it('should update user profile', () => {
    const mockUser = { id: 'user-1', name: 'Test User', token: 'test-token' };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));
    
    const { result } = renderAuthHook();
    
    act(() => {
      result.current.updateUser({ name: 'Updated Name' });
    });
    
    expect(result.current.user?.name).toBe('Updated Name');
  });

  it('should throw error when useAuth is used outside provider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
  });
});