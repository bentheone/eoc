import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const authLinks = (
    <>
      {user && user.role === 'jobseeker' && (
        <>
          <li>
            <Link to="/jobseeker" className="block py-2 px-4 hover:bg-green-800/10" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/jobseeker/profile" className="block py-2 px-4 hover:bg-green-800/10" onClick={() => setIsMenuOpen(false)}>
              Profile
            </Link>
          </li>
          <li>
            <Link to="/jobseeker/matches" className="block py-2 px-4 hover:bg-green-800/10" onClick={() => setIsMenuOpen(false)}>
              Matches
            </Link>
          </li>
          <li>
            <Link to="/jobseeker/documents" className="block py-2 px-4 hover:bg-green-800/10" onClick={() => setIsMenuOpen(false)}>
              Documents
            </Link>
          </li>
        </>
      )}

      {user && user.role === 'company' && (
        <>
          <li>
            <Link to="/company" className="block py-2 px-4 hover:bg-green-800/10" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/company/profile" className="block py-2 px-4 hover:bg-green-800/10" onClick={() => setIsMenuOpen(false)}>
              Profile
            </Link>
          </li>
          <li>
            <Link to="/company/jobs" className="block py-2 px-4 hover:bg-green-800/10" onClick={() => setIsMenuOpen(false)}>
              Jobs
            </Link>
          </li>
          <li>
            <Link to="/company/matches" className="block py-2 px-4 hover:bg-green-800/10" onClick={() => setIsMenuOpen(false)}>
              Matches
            </Link>
          </li>
        </>
      )}

      {user && user.role === 'admin' && (
        <>
          <li>
            <Link to="/admin" className="block py-2 px-4 hover:bg-green-800/10" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className="block py-2 px-4 hover:bg-green-800/10" onClick={() => setIsMenuOpen(false)}>
              Users
            </Link>
          </li>
          <li>
            <Link to="/admin/jobs" className="block py-2 px-4 hover:bg-green-800/10" onClick={() => setIsMenuOpen(false)}>
              Jobs
            </Link>
          </li>
          <li>
            <Link to="/admin/matches" className="block py-2 px-4 hover:bg-green-800/10" onClick={() => setIsMenuOpen(false)}>
              Matches
            </Link>
          </li>
          <li>
            <Link to="/admin/documents" className="block py-2 px-4 hover:bg-green-800/10" onClick={() => setIsMenuOpen(false)}>
              Documents
            </Link>
          </li>
        </>
      )}

      <li>
        <button onClick={handleLogout} className="block w-full text-left py-2 px-4 hover:bg-green-800/10">
          Logout
        </button>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li>
        <Link to="/login" className="block py-2 px-4 hover:bg-green-800/10" onClick={() => setIsMenuOpen(false)}>
          Login
        </Link>
      </li>
      <li>
        <Link to="/register" className="block py-2 px-4 hover:bg-green-800/10" onClick={() => setIsMenuOpen(false)}>
          Register
        </Link>
      </li>
    </>
  );

  return (
    <nav className="bg-green-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">
            EOC
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <ul className="flex space-x-6">
              {isAuthenticated ? (
                <>
                  {user && user.role === 'jobseeker' && (
                    <>
                      <li>
                        <Link to="/jobseeker" className="hover:text-gray-200">
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link to="/jobseeker/matches" className="hover:text-gray-200">
                          Matches
                        </Link>
                      </li>
                    </>
                  )}

                  {user && user.role === 'company' && (
                    <>
                      <li>
                        <Link to="/company" className="hover:text-gray-200">
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link to="/company/jobs" className="hover:text-gray-200">
                          Jobs
                        </Link>
                      </li>
                    </>
                  )}

                  {user && user.role === 'admin' && (
                    <>
                      <li>
                        <Link to="/admin" className="hover:text-gray-200">
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/matches" className="hover:text-gray-200">
                          Matches
                        </Link>
                      </li>
                    </>
                  )}

                  <li>
                    <button onClick={logout} className="hover:text-gray-200">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="hover:text-gray-200">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="hover:text-gray-200">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <ul className="bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden">
              {isAuthenticated ? authLinks : guestLinks}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
