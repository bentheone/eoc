import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const NotFound = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  const getHomeLink = () => {
    if (!isAuthenticated) {
      return '/';
    }
    
    switch (user.role) {
      case 'jobseeker':
        return '/jobseeker';
      case 'company':
        return '/company';
      case 'admin':
        return '/admin';
      default:
        return '/';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 px-4">
      <div className="text-center">
        {/* 404 Number */}
        <div className="text-9xl font-bold text-primary mb-4">
          404
        </div>
        
        {/* Error Message */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        
        {/* Action Buttons */}
        <div className="space-x-4">
          <Link
            to={getHomeLink()}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition duration-300 inline-block"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Go Home'}
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition duration-300"
          >
            Go Back
          </button>
        </div>
        
        {/* Additional Help */}
        <div className="mt-12 text-gray-500">
          <p className="mb-4">Need help? Try these links:</p>
          <div className="space-x-6">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-primary hover:underline">
                  Login
                </Link>
                <Link to="/register" className="text-primary hover:underline">
                  Register
                </Link>
              </>
            ) : (
              <>
                {user.role === 'jobseeker' && (
                  <>
                    <Link to="/jobseeker/profile" className="text-primary hover:underline">
                      My Profile
                    </Link>
                    <Link to="/jobseeker/matches" className="text-primary hover:underline">
                      Job Matches
                    </Link>
                  </>
                )}
                {user.role === 'company' && (
                  <>
                    <Link to="/company/profile" className="text-primary hover:underline">
                      Company Profile
                    </Link>
                    <Link to="/company/jobs" className="text-primary hover:underline">
                      My Jobs
                    </Link>
                  </>
                )}
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin/users" className="text-primary hover:underline">
                      Manage Users
                    </Link>
                    <Link to="/admin/jobs" className="text-primary hover:underline">
                      Manage Jobs
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
