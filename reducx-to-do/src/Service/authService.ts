// API Configuration
const API_BASE_URL = 'http://110.34.2.30:5013';

// TypeScript interfaces for type safety
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  message: string;
  // Decoded user info from JWT (we'll extract this)
  user?: {
    email: string;
    nameid: string;
    unique_name: string;
    role: string;
  };
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Custom error class for API errors
export class AuthError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
    this.errors = errors;
  }
}

// Helper function to handle API responses
const handleApiResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new AuthError(
      data.message || 'An error occurred',
      response.status,
      data.errors
    );
  }
  
  return data;
};

// Helper function to decode JWT token (simple base64 decode for payload)
const decodeJWT = (token: string) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Login function
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
      },
      body: JSON.stringify(credentials),
    });

    const data = await handleApiResponse(response);
    
    // Store tokens and user info if login is successful
    if (data.success && data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      // Decode JWT to extract user information
      const decodedToken = decodeJWT(data.accessToken);
      if (decodedToken) {
        const userInfo = {
          email: decodedToken.email,
          nameid: decodedToken.nameid,
          unique_name: decodedToken.unique_name,
          role: decodedToken.role,
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
        data.user = userInfo; // Add user info to response
      }
    }
    
    return data;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    
    // Handle network errors or other unexpected errors
    throw new AuthError('Network error or server unavailable', 500);
  }
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// Get stored access token
export const getToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Get stored refresh token
export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

// Get stored user
export const getStoredUser = (): {
  email: string;
  nameid: string;
  unique_name: string;
  role: string;
} | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token;
};

// Generic API call helper with authentication
export const authenticatedApiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<unknown> => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return handleApiResponse(response);
};