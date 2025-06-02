import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

// Step 1: Personal Information Component
const PersonalInfoStep = ({ formData, updateFormData, updateNestedFormData, rwandanProvinces, genderOptions, maritalStatusOptions }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          National ID Card (16 digits) *
        </label>
        <input
          type="text"
          value={formData.personalInfo.nationalId}
          onChange={(e) => updateFormData('personalInfo', 'nationalId', e.target.value)}
          className="input-field"
          placeholder="1234567890123456"
          maxLength="16"
          pattern="\d{16}"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date of Birth *
        </label>
        <input
          type="date"
          value={formData.personalInfo.dateOfBirth}
          onChange={(e) => updateFormData('personalInfo', 'dateOfBirth', e.target.value)}
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gender *
        </label>
        <select
          value={formData.personalInfo.gender}
          onChange={(e) => updateFormData('personalInfo', 'gender', e.target.value)}
          className="input-field"
          required
        >
          <option value="">Select Gender</option>
          {genderOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Marital Status
        </label>
        <select
          value={formData.personalInfo.maritalStatus}
          onChange={(e) => updateFormData('personalInfo', 'maritalStatus', e.target.value)}
          className="input-field"
        >
          <option value="">Select Status</option>
          {maritalStatusOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>

    <div className="border-t pt-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Home Location *</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Province *
          </label>
          <select
            value={formData.personalInfo.homeLocation.province}
            onChange={(e) => updateNestedFormData('personalInfo', 'homeLocation', 'province', e.target.value)}
            className="input-field"
            required
          >
            <option value="">Select Province</option>
            {rwandanProvinces.map(province => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            District
          </label>
          <input
            type="text"
            value={formData.personalInfo.homeLocation.district}
            onChange={(e) => updateNestedFormData('personalInfo', 'homeLocation', 'district', e.target.value)}
            className="input-field"
            placeholder="e.g., Gasabo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sector
          </label>
          <input
            type="text"
            value={formData.personalInfo.homeLocation.sector}
            onChange={(e) => updateNestedFormData('personalInfo', 'homeLocation', 'sector', e.target.value)}
            className="input-field"
            placeholder="e.g., Kimironko"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cell
          </label>
          <input
            type="text"
            value={formData.personalInfo.homeLocation.cell}
            onChange={(e) => updateNestedFormData('personalInfo', 'homeLocation', 'cell', e.target.value)}
            className="input-field"
            placeholder="e.g., Kibagabaga"
          />
        </div>
      </div>
    </div>
  </div>
);

// Step 2: Education Component
const EducationStep = ({ formData, updateFormData, handleFileChange, educationLevels }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Latest Education Level *
        </label>
        <select
          value={formData.latestEducation.level}
          onChange={(e) => updateFormData('latestEducation', 'level', e.target.value)}
          className="input-field"
          required
        >
          <option value="">Select Education Level</option>
          {educationLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          School/Institution Name *
        </label>
        <input
          type="text"
          value={formData.latestEducation.school}
          onChange={(e) => updateFormData('latestEducation', 'school', e.target.value)}
          className="input-field"
          placeholder="e.g., University of Rwanda"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Field of Study *
        </label>
        <input
          type="text"
          value={formData.latestEducation.fieldOfStudy}
          onChange={(e) => updateFormData('latestEducation', 'fieldOfStudy', e.target.value)}
          className="input-field"
          placeholder="e.g., Computer Science"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Start Date *
        </label>
        <input
          type="date"
          value={formData.latestEducation.from}
          onChange={(e) => updateFormData('latestEducation', 'from', e.target.value)}
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          End Date
        </label>
        <input
          type="date"
          value={formData.latestEducation.to}
          onChange={(e) => updateFormData('latestEducation', 'to', e.target.value)}
          className="input-field"
          disabled={formData.latestEducation.current}
        />
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.latestEducation.current}
            onChange={(e) => {
              updateFormData('latestEducation', 'current', e.target.checked);
              if (e.target.checked) {
                updateFormData('latestEducation', 'to', '');
              }
            }}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Currently studying here</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Education Document (Optional)
        </label>
        <input
          type="file"
          onChange={(e) => handleFileChange('latestEducation', 'documentPath', e.target.files[0])}
          className="input-field"
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <p className="text-sm text-gray-500 mt-1">
          Upload your certificate/diploma (PDF, JPG, PNG)
        </p>
      </div>
    </div>
  </div>
);

// Step 3: Work Experience Component
const ExperienceStep = ({ formData, updateFormData, handleFileChange }) => (
  <div className="space-y-6">
    <div className="mb-6">
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={formData.hasWorkExperience}
          onChange={(e) => updateFormData(null, 'hasWorkExperience', e.target.checked)}
          className="mr-2"
        />
        <span className="text-sm font-medium text-gray-700">I have work experience</span>
      </label>
    </div>

    {formData.hasWorkExperience && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Latest Company Name *
          </label>
          <input
            type="text"
            value={formData.latestWorkExperience.company}
            onChange={(e) => updateFormData('latestWorkExperience', 'company', e.target.value)}
            className="input-field"
            placeholder="e.g., Tech Solutions Ltd"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title *
          </label>
          <input
            type="text"
            value={formData.latestWorkExperience.title}
            onChange={(e) => updateFormData('latestWorkExperience', 'title', e.target.value)}
            className="input-field"
            placeholder="e.g., Software Developer"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience *
          </label>
          <input
            type="number"
            value={formData.latestWorkExperience.yearsOfExperience}
            onChange={(e) => updateFormData('latestWorkExperience', 'yearsOfExperience', parseInt(e.target.value) || 0)}
            className="input-field"
            min="0"
            max="50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employment Document
          </label>
          <input
            type="file"
            onChange={(e) => handleFileChange('latestWorkExperience', 'documentPath', e.target.files[0])}
            className="input-field"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload employment letter/certificate (Optional)
          </p>
        </div>
      </div>
    )}

    {!formData.hasWorkExperience && (
      <div className="text-center py-8 text-gray-500">
        <p>No work experience? No problem! You can skip this step and add experience later.</p>
      </div>
    )}
  </div>
);

// Step 4: Professional Details Component
const ProfessionalStep = ({ formData, updateFormData }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Professional Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateFormData(null, 'title', e.target.value)}
          className="input-field"
          placeholder="e.g., Software Developer"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => updateFormData(null, 'phone', e.target.value)}
          className="input-field"
          placeholder="e.g., +250 788 123 456"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Professional Bio *
      </label>
      <textarea
        value={formData.bio}
        onChange={(e) => updateFormData(null, 'bio', e.target.value)}
        rows="4"
        className="input-field"
        placeholder="Tell us about your professional background and career goals..."
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Skills * (comma-separated)
      </label>
      <input
        type="text"
        value={formData.skills}
        onChange={(e) => updateFormData(null, 'skills', e.target.value)}
        className="input-field"
        placeholder="e.g., JavaScript, React, Node.js, Project Management"
        required
      />
    </div>
  </div>
);

// Step 5: Privacy Consent Component
const ConsentStep = ({ formData, updateFormData }) => (
  <div className="space-y-6">
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Privacy Policy & Terms of Service</h3>

      <div className="space-y-4 mb-6">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms"
            checked={formData.privacyConsent.agreedToTerms}
            onChange={(e) => updateFormData('privacyConsent', 'agreedToTerms', e.target.checked)}
            className="mt-1 mr-3"
            required
          />
          <label htmlFor="terms" className="text-sm text-gray-700">
            I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and understand that my information will be used to match me with relevant job opportunities.
          </label>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="privacy"
            checked={formData.privacyConsent.agreedToPrivacyPolicy}
            onChange={(e) => updateFormData('privacyConsent', 'agreedToPrivacyPolicy', e.target.checked)}
            className="mt-1 mr-3"
            required
          />
          <label htmlFor="privacy" className="text-sm text-gray-700">
            I agree to the <a href="#" className="text-primary hover:underline">Privacy Policy</a> and consent to the processing of my personal data as described.
          </label>
        </div>
      </div>

      <div className="text-sm text-gray-600 bg-white p-4 rounded border">
        <p className="mb-2"><strong>Data Usage:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Your profile information will be used to match you with relevant job opportunities</li>
          <li>Employers will only see your profile if there's a mutual match</li>
          <li>Your personal documents are securely stored and only accessible to verified employers</li>
          <li>You can update or delete your profile at any time</li>
        </ul>
      </div>
    </div>
  </div>
);

const JobSeekerSetupStages = () => {
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
      documentPath: ''
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
      documentPath: ''
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

  const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Freelance',
    'Internship',
    'Remote'
  ];

  const genderOptions = ['Male', 'Female', 'Other'];
  const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];

  const totalSteps = 5;

  // Helper functions
  const updateFormData = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const updateNestedFormData = (section, subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const handleFileChange = async (section, field, file) => {
    if (!file) {
      // Clear the field if no file is selected
      updateFormData(section, field, '');
      return;
    }

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('document', file);

      const response = await axios.post('/api/profiles/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Store the file path in the form data
      updateFormData(section, field, response.data.path);
      setAlert('Document uploaded successfully!', 'success');
    } catch (error) {
      console.error('File upload error:', error);
      setAlert('Error uploading document. Please try again.', 'error');
      // Clear the field on error
      updateFormData(section, field, '');
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        const { nationalId, dateOfBirth, homeLocation, gender } = formData.personalInfo;
        return nationalId && dateOfBirth && homeLocation.province && gender;
      case 2:
        const { level, school, fieldOfStudy, from } = formData.latestEducation;
        return level && school && fieldOfStudy && from;
      case 3:
        if (!formData.hasWorkExperience) return true;
        const { company, title, yearsOfExperience } = formData.latestWorkExperience;
        return company && title && yearsOfExperience >= 0;
      case 4:
        return formData.bio && formData.title && formData.skills;
      case 5:
        return formData.privacyConsent.agreedToTerms && formData.privacyConsent.agreedToPrivacyPolicy;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      setAlert('Please fill in all required fields', 'error');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = async () => {
    if (!validateStep(5)) {
      setAlert('Please complete all required fields and agree to terms', 'error');
      return;
    }

    setLoading(true);

    try {
      // Prepare form data for submission
      const profileData = {
        bio: formData.bio,
        location: formData.location,
        phone: formData.phone,
        personalInfo: formData.personalInfo,
        jobSeeker: {
          title: formData.title,
          skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
          preferredJobTypes: formData.preferredJobTypes,
          preferredLocations: formData.preferredLocations.split(',').map(loc => loc.trim()).filter(loc => loc),
          expectedSalary: formData.expectedSalary,
          // Add education data
          education: [{
            school: formData.latestEducation.school,
            level: formData.latestEducation.level,
            fieldOfStudy: formData.latestEducation.fieldOfStudy,
            from: formData.latestEducation.from,
            to: formData.latestEducation.to || null,
            current: formData.latestEducation.current,
            documentPath: formData.latestEducation.documentPath || '',
            verified: false
          }],
          // Add experience data if exists
          experience: formData.hasWorkExperience ? [{
            title: formData.latestWorkExperience.title,
            company: formData.latestWorkExperience.company,
            from: formData.latestWorkExperience.from,
            to: formData.latestWorkExperience.to || null,
            current: formData.latestWorkExperience.current,
            documentPath: formData.latestWorkExperience.documentPath || '',
            verified: false
          }] : [],
          // Latest education and experience for quick reference
          latestEducation: {
            level: formData.latestEducation.level,
            documentPath: formData.latestEducation.documentPath || '',
            verified: false
          },
          latestWorkExperience: formData.hasWorkExperience ? {
            company: formData.latestWorkExperience.company,
            yearsOfExperience: formData.latestWorkExperience.yearsOfExperience,
            documentPath: formData.latestWorkExperience.documentPath || '',
            verified: false
          } : null
        },
        privacyConsent: {
          ...formData.privacyConsent,
          consentDate: new Date()
        },
        profileCompletion: {
          personalInfoCompleted: true,
          educationCompleted: true,
          experienceCompleted: true,
          consentCompleted: true,
          overallCompleted: true
        }
      };

      console.log('Submitting profile data:', profileData);
      const response = await axios.post('/api/profiles', profileData);

      setAlert('Profile created successfully! Welcome to EOC!', 'success');

      // Small delay to show success message, then redirect
      setTimeout(() => {
        navigate('/jobseeker');
      }, 1500);
    } catch (err) {
      console.error('Profile creation error:', err);
      console.error('Error response:', err.response);

      // Handle different types of validation errors
      let errorMessage = 'Error creating profile';

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

  // Progress bar component
  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
        <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  // Step titles
  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Personal Information';
      case 2: return 'Education Background';
      case 3: return 'Work Experience';
      case 4: return 'Professional Details';
      case 5: return 'Privacy & Terms';
      default: return '';
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to EOC, {user?.name}!
            </h1>
            <p className="text-gray-600">
              Let's set up your complete profile to get you started with finding the perfect job matches.
            </p>
          </div>

          <ProgressBar />

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {getStepTitle()}
            </h2>
          </div>

          {/* Step content will be rendered here */}
          <div className="min-h-[400px]">
            {currentStep === 1 && (
              <PersonalInfoStep
                formData={formData}
                updateFormData={updateFormData}
                updateNestedFormData={updateNestedFormData}
                rwandanProvinces={rwandanProvinces}
                genderOptions={genderOptions}
                maritalStatusOptions={maritalStatusOptions}
              />
            )}
            {currentStep === 2 && (
              <EducationStep
                formData={formData}
                updateFormData={updateFormData}
                handleFileChange={handleFileChange}
                educationLevels={educationLevels}
              />
            )}
            {currentStep === 3 && (
              <ExperienceStep
                formData={formData}
                updateFormData={updateFormData}
                handleFileChange={handleFileChange}
              />
            )}
            {currentStep === 4 && (
              <ProfessionalStep
                formData={formData}
                updateFormData={updateFormData}
              />
            )}
            {currentStep === 5 && (
              <ConsentStep
                formData={formData}
                updateFormData={updateFormData}
              />
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium ${
                currentStep === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary px-6 py-2"
              >
                Next Step
              </button>
            ) : (
              <button
                type="button"
                onClick={onSubmit}
                disabled={loading}
                className="btn-primary px-6 py-2"
              >
                {loading ? 'Creating Profile...' : 'Complete Setup'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerSetupStages;
