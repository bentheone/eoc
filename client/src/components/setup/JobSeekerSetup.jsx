import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

const JobSeekerSetup = () => {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form data for all steps
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    personalInfo: {
      nationalId: '',
      dateOfBirth: '',
      homeLocation: {
        province: '',
        district: '',
        sector: '',
        cell: ''
      },
      gender: '',
      maritalStatus: ''
    },
    // Step 2: Education
    latestEducation: {
      level: '',
      school: '',
      fieldOfStudy: '',
      from: '',
      to: '',
      current: false,
      documentFile: null
    },
    // Step 3: Work Experience (optional)
    hasWorkExperience: false,
    latestWorkExperience: {
      company: '',
      title: '',
      yearsOfExperience: 0,
      from: '',
      to: '',
      current: false,
      documentFile: null
    },
    // Step 4: Professional Details
    bio: '',
    location: '',
    phone: '',
    title: '',
    skills: '',
    preferredJobTypes: [],
    preferredLocations: '',
    expectedSalary: '',
    // Step 5: Privacy Consent
    privacyConsent: {
      agreedToTerms: false,
      agreedToPrivacyPolicy: false
    }
  });

  // Constants
  const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Freelance',
    'Internship',
    'Remote'
  ];

  const educationLevels = [
    'Primary Education (P1-P6)',
    'Lower Secondary (S1-S3)',
    'Upper Secondary (S4-S6)',
    'Technical and Vocational Education (TVET)',
    'Certificate',
    'Diploma',
    'Advanced Diploma',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'Doctorate (PhD)'
  ];

  const rwandanProvinces = [
    'Kigali City',
    'Eastern Province',
    'Northern Province',
    'Southern Province',
    'Western Province'
  ];

  const genderOptions = ['Male', 'Female', 'Other'];
  const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];

  const totalSteps = 5;

  const onChange = (e) => {
    if (e.target.name === 'preferredJobTypes') {
      const value = e.target.value;
      const checked = e.target.checked;

      if (checked) {
        setFormData({
          ...formData,
          preferredJobTypes: [...formData.preferredJobTypes, value]
        });
      } else {
        setFormData({
          ...formData,
          preferredJobTypes: formData.preferredJobTypes.filter(type => type !== value)
        });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profileData = {
        bio: formData.bio,
        location: formData.location,
        phone: formData.phone,
        jobSeeker: {
          title: formData.title,
          skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
          preferredJobTypes: formData.preferredJobTypes,
          preferredLocations: formData.preferredLocations.split(',').map(loc => loc.trim()).filter(loc => loc),
          expectedSalary: formData.expectedSalary
        }
      };

      await axios.post('/api/profiles', profileData);

      setAlert('Profile created successfully! Welcome to EOC!', 'success');
      navigate('/jobseeker');
    } catch (err) {
      console.error(err);
      setAlert(err.response?.data?.msg || 'Error creating profile', 'error');
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
              Let's set up your job seeker profile to get you started with finding the perfect job matches.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={onChange}
                    className="input-field"
                    placeholder="e.g., Software Developer, Marketing Manager"
                    required
                  />
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Salary
                  </label>
                  <input
                    type="text"
                    name="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={onChange}
                    className="input-field"
                    placeholder="e.g., $60,000 - $80,000"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Bio *
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={onChange}
                  rows="4"
                  className="input-field"
                  placeholder="Tell us about your professional background, experience, and career goals..."
                  required
                />
              </div>
            </div>

            {/* Skills and Preferences */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills & Preferences</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills * (comma-separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={onChange}
                  className="input-field"
                  placeholder="e.g., JavaScript, React, Node.js, Project Management"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter your key skills separated by commas
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Job Types *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {jobTypes.map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        name="preferredJobTypes"
                        value={type}
                        checked={formData.preferredJobTypes.includes(type)}
                        onChange={onChange}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Locations (comma-separated)
                </label>
                <input
                  type="text"
                  name="preferredLocations"
                  value={formData.preferredLocations}
                  onChange={onChange}
                  className="input-field"
                  placeholder="e.g., New York, San Francisco, Remote"
                />
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

export default JobSeekerSetup;
