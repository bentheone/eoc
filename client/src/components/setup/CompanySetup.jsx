import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

const CompanySetup = () => {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    website: '',
    phone: '',
    companyName: '',
    industry: '',
    companySize: '',
    description: '',
    benefits: ''
  });

  const [loading, setLoading] = useState(false);

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Consulting',
    'Marketing',
    'Real Estate',
    'Non-profit',
    'Government',
    'Other'
  ];

  const companySizes = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '501-1000', label: '501-1000 employees' },
    { value: '1000+', label: '1000+ employees' }
  ];

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profileData = {
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        phone: formData.phone,
        company: {
          companyName: formData.companyName,
          industry: formData.industry,
          companySize: formData.companySize,
          description: formData.description,
          benefits: formData.benefits.split(',').map(benefit => benefit.trim()).filter(benefit => benefit)
        }
      };

      await axios.post('/api/profiles', profileData);

      setAlert('Company profile created successfully! Welcome to EOC!', 'success');
      navigate('/company');
    } catch (err) {
      console.error('Company profile creation error:', err);
      console.error('Error response:', err.response);

      // Handle different types of validation errors
      let errorMessage = 'Error creating company profile';

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
        // Handle MongoDB validation errors
        else if (data.message && data.message.includes('validation failed')) {
          const validationErrors = data.message.split(': ')[1];
          errorMessage = `Validation failed: ${validationErrors}`;
        }
        // Handle other error formats
        else if (data.error) {
          errorMessage = data.error;
        }
      }

      setAlert(errorMessage, 'error');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to EOC, {user?.name}!
            </h1>
            <p className="text-gray-600">
              Let's set up your company profile to start finding the perfect candidates for your job openings.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Company Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Company Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={onChange}
                    className="input-field"
                    placeholder="e.g., Tech Solutions Inc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry *
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={onChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select Industry</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size *
                  </label>
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={onChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select Company Size</option>
                    {companySizes.map(size => (
                      <option key={size.value} value={size.value}>{size.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={onChange}
                    className="input-field"
                    placeholder="e.g., New York, NY"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={onChange}
                    className="input-field"
                    placeholder="e.g., https://www.company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={onChange}
                    className="input-field"
                    placeholder="e.g., (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Company Details</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Bio *
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={onChange}
                  rows="3"
                  className="input-field"
                  placeholder="Brief overview of your company..."
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={onChange}
                  rows="4"
                  className="input-field"
                  placeholder="Detailed description of your company, mission, values, and culture..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Benefits (comma-separated)
                </label>
                <input
                  type="text"
                  name="benefits"
                  value={formData.benefits}
                  onChange={onChange}
                  className="input-field"
                  placeholder="e.g., Health Insurance, 401k, Remote Work, Flexible Hours"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter benefits separated by commas
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-8 py-3 text-lg"
              >
                {loading ? 'Creating Profile...' : 'Complete Setup & Get Started'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanySetup;
