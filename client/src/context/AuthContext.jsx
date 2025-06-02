import { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Create context
export const AuthContext = createContext();

// Initial state
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  user: null,
  error: null
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'REGISTER_FAIL':
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token
  const setAuthToken = token => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Load user
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      console.log('Loading user with token:', localStorage.token);
      console.log('Axios base URL:', axios.defaults.baseURL);
      const res = await axios.get('/api/auth/me');

      dispatch({
        type: 'USER_LOADED',
        payload: res.data
      });
    } catch (err) {
      console.error('Load user error:', err);
      console.error('Error response:', err.response);
      dispatch({
        type: 'AUTH_ERROR',
        payload: err.response?.data?.error || 'Authentication error'
      });
    }
  };

  // Register user
  const register = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      console.log('Attempting registration with base URL:', axios.defaults.baseURL);
      const res = await axios.post('/api/auth/register', formData, config);
      console.log('Registration successful, token received:', res.data.token);

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data
      });

      // Set the token in axios headers immediately
      setAuthToken(res.data.token);
      console.log('Token set in axios headers');

      // Load user data
      loadUser();
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Registration error response:', err.response);

      // Handle different types of registration errors
      let errorMessage = 'Registration failed';

      if (err.response?.data) {
        const { data } = err.response;

        // Handle validation errors array
        if (data.errors && Array.isArray(data.errors)) {
          errorMessage = data.errors.map(error => error.msg || error.message).join(', ');
        }
        // Handle single error message
        else if (data.msg) {
          errorMessage = data.msg;
        }
        // Handle other error formats
        else if (data.error) {
          errorMessage = data.error;
        }
      }

      dispatch({
        type: 'REGISTER_FAIL',
        payload: errorMessage
      });
    }
  };

  // Login user
  const login = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      console.log('Attempting login with base URL:', axios.defaults.baseURL);
      const res = await axios.post('/api/auth/login', formData, config);
      console.log('Login successful, token received:', res.data.token);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });

      // Set the token in axios headers immediately
      setAuthToken(res.data.token);
      console.log('Token set in axios headers');

      // Load user data
      loadUser();
    } catch (err) {
      console.error('Login error:', err);
      console.error('Login error response:', err.response);
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.errors?.[0]?.msg || 'Login failed'
      });
    }
  };

  // Logout
  const logout = () => dispatch({ type: 'LOGOUT' });

  // Clear errors
  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  // Set token on initial load
  useEffect(() => {
    setAuthToken(localStorage.token);
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        loadUser,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
