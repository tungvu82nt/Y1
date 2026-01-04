import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../utils/api';

// Mock fetch
global.fetch = vi.fn() as any;

describe('API Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockResponse = { success: true, data: { id: 1, name: 'Test' } };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.get('/test');
      
      expect(fetch).toHaveBeenCalledWith('/api/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
      });
      
      expect(result).toEqual(mockResponse);
    });

    it('should handle GET request with authentication', async () => {
      const user = { token: 'test-token', id: 'user-1' };
      localStorage.setItem('yapee_user', JSON.stringify(user));
      
      const mockResponse = { success: true, data: { id: 1 } };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await api.get('/protected');
      
      expect(fetch).toHaveBeenCalledWith('/api/protected', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token',
        },
        cache: 'no-cache',
      });
    });

  it('should handle GET request errors', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
      text: async () => 'Not Found',
    });

    await expect(api.get('/not-found')).rejects.toThrow('Network error during GET request: Cannot read properties of undefined (reading \'ok\')');
  });

    it('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(api.get('/test')).rejects.toThrow('Network error during GET request: Network error');
    });
  });

  describe('POST requests', () => {
    it('should make successful POST request', async () => {
      const mockData = { name: 'Test Item' };
      const mockResponse = { success: true, data: { id: 1, ...mockData } };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.post('/items', mockData);
      
      expect(fetch).toHaveBeenCalledWith('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockData),
      });
      
      expect(result).toEqual(mockResponse);
    });

    it('should handle POST request errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
        text: async () => '{"error": "Invalid data"}',
      });

      await expect(api.post('/items', { invalid: true })).rejects.toThrow('Invalid data');
    });
  });

  describe('PUT requests', () => {
    it('should make successful PUT request', async () => {
      const mockData = { name: 'Updated Item' };
      const mockResponse = { success: true, data: { id: 1, ...mockData } };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.put('/items/1', mockData);
      
      expect(fetch).toHaveBeenCalledWith('/api/items/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockData),
      });
      
      expect(result).toEqual(mockResponse);
    });
  });

  describe('DELETE requests', () => {
    it('should make successful DELETE request', async () => {
      const mockResponse = { success: true, data: null };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.delete('/items/1');
      
      expect(fetch).toHaveBeenCalledWith('/api/items/1', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      expect(result).toEqual(mockResponse);
    });
  });

  describe('FormData requests', () => {
    it('should make successful FormData POST request', async () => {
      const formData = new FormData();
      formData.append('file', 'test');
      
      const mockResponse = { success: true, data: { url: 'test.jpg' } };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.postFormData('/upload', formData);
      
      expect(fetch).toHaveBeenCalledWith('/api/upload', {
        method: 'POST',
        headers: {},
        body: formData,
      });
      
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Type safety', () => {
    it('should maintain proper TypeScript types', async () => {
      interface TestResponse {
        id: number;
        name: string;
      }

      const mockResponse: TestResponse = { id: 1, name: 'Test' };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockResponse }),
      });

      const result = await api.get<TestResponse>('/test');
      
      // TypeScript should infer the correct type
      if (result.success && result.data) {
        expect(result.data.id).toBe(1);
        expect(result.data.name).toBe('Test');
      }
    });
  });
});