import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync, clearError, logout, selectAuthLoading, selectAuthError, selectIsAuthenticated, selectUser } from '../features/auth/authSlice';
import type { AppDispatch } from '../app/store';

const Login = () => {
  const [input, setInput] = useState({ email: '', password: '' });
  const [showForm, setShowForm] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  // Clear error when component mounts or form is toggled
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [showForm, dispatch, error]);

  // Hide form when user successfully logs in
  useEffect(() => {
    if (isAuthenticated) {
      setShowForm(false);
      setInput({ email: '', password: '' });
    }
  }, [isAuthenticated]);

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.email.trim() || !input.password.trim()) {
      return;
    }

    try {
      await dispatch(loginAsync(input)).unwrap();
      // Login successful - the useEffect above will handle UI updates
    } catch (err) {
      // Error is handled by the rejected case in authSlice
      console.error('Login failed:', err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (error) {
      dispatch(clearError());
    }
  };

  if (isAuthenticated) {
    return (
      <div className="mt-8 p-6 bg-green-800 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-200 text-lg">✅ Welcome back!</p>
            {user?.unique_name && (
              <p className="text-green-300 text-sm mt-1">Name: {user.unique_name}</p>
            )}
            {user?.email && (
              <p className="text-green-300 text-sm">Email: {user.email}</p>
            )}
            {user?.role && (
              <p className="text-green-300 text-sm">Role: {user.role}</p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <button
        onClick={toggleForm}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        {showForm ? 'Hide Login Form' : 'Show Login Form'}
      </button>

      {showForm && (
        <div className="mt-4 p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Login</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg">
              <p className="text-red-200">❌ {error}</p>
            </div>
          )}

          <form onSubmit={loginHandler} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={input.email}
                onChange={(e) => setInput({ ...input, email: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={input.password}
                onChange={(e) => setInput({ ...input, password: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !input.email.trim() || !input.password.trim()}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                loading || !input.email.trim() || !input.password.trim()
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              <strong>API Endpoint:</strong> http://110.34.2.30:5013/auth/login
            </p>
            <p className="text-sm text-gray-400 mt-1">
              <strong>Method:</strong> POST
            </p>
            <p className="text-sm text-gray-400 mt-1">
              <strong>Request Body:</strong> {`{ email: "string", password: "string" }`}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              <strong>Expected Response:</strong> {`{ success: true, accessToken: "...", refreshToken: "...", message: "..." }`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
