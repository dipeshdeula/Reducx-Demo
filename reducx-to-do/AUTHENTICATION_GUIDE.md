# Authentication Testing Guide

## How to Test the Login Functionality

### 1. **Start the Development Server**
```bash
npm run dev
```

### 2. **Open the Application**
- Navigate to `http://localhost:5173` (or your Vite dev server URL)
- You should see the To-Do List application with a "Show Login Form" button

### 3. **Test the Login Process**

#### Step 1: Show Login Form
- Click the "Show Login Form" button
- The form will expand showing email and password fields

#### Step 2: Enter Credentials
- Enter any email (e.g., `test@example.com`)
- Enter any password (e.g., `password123`)

#### Step 3: Submit Login
- Click the "Login" button
- You'll see a loading spinner while the request is being made

#### Step 4: Observe Results
- **Success**: If login is successful, you'll see a green success message with the user's email
- **Error**: If login fails, you'll see a red error message with the error details

## API Integration Details

### **Endpoint Configuration**
- **URL**: `http://110.34.2.30:5013/auth/login`
- **Method**: POST
- **Content-Type**: application/json

### **Request Format**
```json
{
  "email": "string",
  "password": "string"
}
```

### **Expected Response Format**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 0,
  "message": "Login successful."
}
```

### **JWT Token Contains:**
The accessToken is a JWT that contains user information:
- `email`: User's email address
- `nameid`: User's ID
- `unique_name`: User's display name
- `role`: User's role (e.g., "SuperAdmin")
- `exp`: Token expiration time
- `iss`: Token issuer
- `aud`: Token audience

## Redux State Management

### **Auth State Structure**
```typescript
{
  auth: {
    user: {
      email: string,
      nameid: string,
      unique_name: string,
      role: string
    } | null,
    accessToken: string | null,
    refreshToken: string | null,
    isAuthenticated: boolean,
    loading: boolean,
    error: string | null,
    loginMessage: string | null
  }
}
```

### **Available Actions**
- `loginAsync(credentials)` - Async login with API call
- `logout()` - Clear user session
- `clearError()` - Clear error messages
- `setLoading(boolean)` - Manual loading state control

### **Available Selectors**
- `selectAuth(state)` - Get entire auth state
- `selectUser(state)` - Get user object
- `selectIsAuthenticated(state)` - Get authentication status
- `selectAuthLoading(state)` - Get loading state
- `selectAuthError(state)` - Get error message

## Persistence

The authentication system includes automatic persistence:

- **Access Token Storage**: JWT access token is stored in localStorage as 'accessToken'
- **Refresh Token Storage**: JWT refresh token is stored in localStorage as 'refreshToken'
- **User Storage**: Decoded user data from JWT is stored in localStorage as 'user'
- **Session Persistence**: User stays logged in on page refresh
- **Auto Logout**: localStorage is cleared on logout

### **JWT Token Decoding**
The system automatically decodes the JWT access token to extract user information:
- Email address
- User ID (nameid)
- Display name (unique_name)
- User role
- Token expiration

## Error Handling

The system handles various error scenarios:

1. **Network Errors**: Server unavailable, connection issues
2. **API Errors**: Invalid credentials, server errors
3. **Validation Errors**: Missing email/password
4. **Authentication Errors**: Invalid token, expired session

## Testing Different Scenarios

### **Valid Login Test**
- Use credentials that your API accepts
- Should see success message and user info

### **Invalid Credentials Test**
- Use wrong email/password
- Should see error message from API

### **Network Error Test**
- Disconnect internet or use wrong URL
- Should see network error message

### **Loading State Test**
- Submit form and observe loading spinner
- Button should be disabled during loading

### **Persistence Test**
- Login successfully
- Refresh the page
- Should remain logged in

### **Logout Test**
- After logging in, click logout
- Should clear session and show login form again

## Debugging Tips

1. **Check Browser Network Tab**: See actual API requests/responses
2. **Check Redux DevTools**: Monitor state changes
3. **Check Console**: Look for error messages
4. **Check localStorage**: Verify token/user storage
5. **Check Component State**: Use React DevTools

## Common Issues and Solutions

### **CORS Errors**
If you see CORS errors, the API server needs to allow requests from your domain.

### **Network Timeout**
If requests hang, check if the API server is running and accessible.

### **Token Format Issues**
Ensure the API returns the expected token format in the response.

### **State Not Updating**
Check Redux DevTools to see if actions are being dispatched correctly.

## Next Steps

Once login is working, you can:

1. **Protect Routes**: Only show todos for authenticated users
2. **Add Registration**: Create account functionality
3. **Add Password Reset**: Forgot password feature
4. **Add Profile Management**: Edit user profile
5. **Add Token Refresh**: Automatic token renewal
6. **Add Role-Based Access**: Different user permissions
