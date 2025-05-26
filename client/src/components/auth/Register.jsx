import { useState, useContext, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

const Register = () => {
  const { register, isAuthenticated, error, user, clearError } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'jobseeker'
  });

  const { name, email, password, password2, role } = formData;

  useEffect(() => {
    if (error) {
      setAlert(error, 'error');
      clearError();
    }
  }, [error, setAlert, clearError]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'error');
    } else {
      register({
        name,
        email,
        password,
        role
      });
    }
  };

  // Redirect if logged in
  if (isAuthenticated) {
    if (user.role === 'jobseeker') {
      return <Navigate to="/jobseeker" />;
    } else if (user.role === 'company') {
      return <Navigate to="/company" />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin" />;
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 py-8">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Your Account
        </h1>

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              className="input-field"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              className="input-field"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              className="input-field"
              placeholder="Enter your password"
              required
              minLength="6"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password2" className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="password2"
              name="password2"
              value={password2}
              onChange={onChange}
              className="input-field"
              placeholder="Confirm your password"
              required
              minLength="6"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Account Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="jobseeker"
                  checked={role === 'jobseeker'}
                  onChange={onChange}
                  className="mr-2"
                />
                <span>Job Seeker</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="company"
                  checked={role === 'company'}
                  onChange={onChange}
                  className="mr-2"
                />
                <span>Company</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full mb-4"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-green-800 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
