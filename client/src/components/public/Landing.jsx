import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Landing = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Find Your Perfect Job Match
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Employment Opportunity Company connects job seekers with employers through
            our sophisticated AI-powered matching system. Discover opportunities that
            align with your skills and career goals.
          </p>

          {!isAuthenticated ? (
            <div className="space-x-4">
              <Link
                to="/register"
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 inline-block"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition duration-300 inline-block"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                to={user.role === 'jobseeker' ? '/jobseeker' : user.role === 'company' ? '/company' : '/admin'}
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 inline-block"
              >
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose EOC?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform offers unique features designed to make job searching
              and hiring more efficient and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-primary text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                AI-Powered Matching
              </h3>
              <p className="text-gray-600">
                Our advanced algorithm analyzes skills, experience, and preferences
                to find the perfect job matches for both candidates and employers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-primary text-5xl mb-4">📋</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Comprehensive Profiles
              </h3>
              <p className="text-gray-600">
                Create detailed profiles with skills, experience, education, and
                upload documents to showcase your qualifications effectively.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-primary text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Secure & Verified
              </h3>
              <p className="text-gray-600">
                All users and job postings are verified by our admin team to ensure
                quality and security throughout the platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started is simple. Follow these easy steps to begin your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* For Job Seekers */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                For Job Seekers
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Create Your Profile</h4>
                    <p className="text-gray-600">Sign up and build a comprehensive profile with your skills, experience, and career preferences.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Get Matched</h4>
                    <p className="text-gray-600">Our AI algorithm finds job opportunities that match your skills and preferences.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Apply & Connect</h4>
                    <p className="text-gray-600">Review matches and apply to positions that interest you directly through our platform.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Employers */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                For Employers
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Post Your Jobs</h4>
                    <p className="text-gray-600">Create detailed job postings with requirements, responsibilities, and company information.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Receive Matches</h4>
                    <p className="text-gray-600">Get matched with qualified candidates who meet your job requirements.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Hire the Best</h4>
                    <p className="text-gray-600">Review candidate profiles and documents to make informed hiring decisions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers and employers who have found success through our platform.
          </p>

          {!isAuthenticated && (
            <div className="space-x-4">
              <Link
                to="/register"
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 inline-block"
              >
                Join as Job Seeker
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition duration-300 inline-block"
              >
                Join as Employer
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Landing;
