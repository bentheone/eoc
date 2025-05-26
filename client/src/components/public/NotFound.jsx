import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-9xl font-bold text-green-800 mb-4">404</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <div className="space-x-4">
          <Link
            to="/"
            className="bg-green-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-block"
          >
            Go Home
          </Link>
          <Link
            to="/login"
            className="border-2 border-green-800 text-green-800 px-6 py-3 rounded-lg font-semibold hover:bg-green-800 hover:text-white transition-colors inline-block"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
