import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-green-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Find Your Perfect Career Match
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Connect with top employers and discover opportunities that match your skills, 
            experience, and career goals through our intelligent matching system.
          </p>
          <div className="space-x-4">
            <Link
              to="/register"
              className="bg-white text-green-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-800 transition-colors inline-block"
            >
              Sign In
            </Link>
          </div>
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
              Our platform uses advanced algorithms to match job seekers with the right opportunities
              and help companies find the perfect candidates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Smart Matching</h3>
              <p className="text-gray-600">
                Our AI-powered system analyzes skills, experience, and preferences to find the perfect matches.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Fast & Easy</h3>
              <p className="text-gray-600">
                Simple registration process and intuitive interface make job searching and hiring effortless.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Secure & Verified</h3>
              <p className="text-gray-600">
                All profiles and job postings are verified by our admin team to ensure quality and authenticity.
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Job Seekers */}
            <div>
              <h3 className="text-2xl font-bold text-green-800 mb-6">For Job Seekers</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Create Your Profile</h4>
                    <p className="text-gray-600">Upload your resume and complete your professional profile.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Get Matched</h4>
                    <p className="text-gray-600">Our system finds jobs that match your skills and preferences.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Apply & Connect</h4>
                    <p className="text-gray-600">Apply to matched positions and connect with employers.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Employers */}
            <div>
              <h3 className="text-2xl font-bold text-green-800 mb-6">For Employers</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Post Your Jobs</h4>
                    <p className="text-gray-600">Create detailed job postings with requirements and benefits.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Review Matches</h4>
                    <p className="text-gray-600">Get matched with qualified candidates based on your criteria.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Hire the Best</h4>
                    <p className="text-gray-600">Interview and hire the perfect candidates for your team.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers and employers who have found success through our platform.
          </p>
          <Link
            to="/register"
            className="bg-white text-green-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Join Now - It's Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
