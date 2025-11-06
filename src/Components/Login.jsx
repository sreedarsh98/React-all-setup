import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/Authcontext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { email, password, phoneNumber, firstName, lastName } = formData;

    if (!email || !password || !phoneNumber || !firstName || !lastName) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      setLoading(false);
      return;
    }

    const result = register(email, password, phoneNumber, firstName, lastName);

    if (result.success) {
      // Auto-login after registration
      const loginResult = login(email, password);
      if (loginResult.success) {
        // Don't set loading to false - let useEffect handle navigation
        // The useEffect will trigger when user state updates
      } else {
        setError('Registration successful but login failed. Please try logging in.');
        setIsSignUp(false);
        setLoading(false);
      }
    } else {
      setError(result.error || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { email, password } = formData;
    const emailOrPhone = email; // User can enter email or phone in email field

    if (!emailOrPhone || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = login(emailOrPhone, password);

    if (result.success) {
      // Don't set loading to false - let useEffect handle navigation
      // The useEffect will trigger when user state updates
    } else {
      setError(result.error || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <p>{isSignUp ? 'Sign up to get started' : 'Sign in to continue to your dashboard'}</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="login-form">
          {isSignUp && (
            <>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  disabled={loading}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">{isSignUp ? 'Email' : 'Email or Phone'}</label>
            <input
              type={isSignUp ? 'email' : 'text'}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={isSignUp ? 'Enter your email' : 'Enter your email or phone number'}
              disabled={loading}
              required
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your 10-digit phone number"
                disabled={loading}
                maxLength="10"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (isSignUp ? 'Creating Account...' : 'Signing in...') : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              className="link-button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setFormData({
                  email: '',
                  password: '',
                  phoneNumber: '',
                  firstName: '',
                  lastName: '',
                });
              }}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;