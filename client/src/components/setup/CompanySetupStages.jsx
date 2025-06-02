import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

// Stage 1: Company Identification Component
const CompanyIdentificationStep = ({ formData, updateFormData, updateNestedFormData, rwandanProvinces, industries, companySizes }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Name *
        </label>
        <input
          type="text"
          value={formData.companyInfo.name}
          onChange={(e) => updateFormData('companyInfo', 'name', e.target.value)}
          className="input-field"
          placeholder="e.g., Tech Solutions Rwanda Ltd"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          TIN Number (Rwandan Format) *
        </label>
        <input
          type="text"
          value={formData.companyInfo.tinNumber}
          onChange={(e) => updateFormData('companyInfo', 'tinNumber', e.target.value)}
          className="input-field"
          placeholder="123456789"
          maxLength="9"
          pattern="\d{9}"
          required
        />
        <p className="text-sm text-gray-500 mt-1">9-digit TIN number</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Registration Number
        </label>
        <input
          type="text"
          value={formData.companyInfo.registrationNumber}
          onChange={(e) => updateFormData('companyInfo', 'registrationNumber', e.target.value)}
          className="input-field"
          placeholder="e.g., RDB-123456789"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Industry *
        </label>
        <select
          value={formData.companyInfo.industry}
          onChange={(e) => updateFormData('companyInfo', 'industry', e.target.value)}
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
          value={formData.companyInfo.size}
          onChange={(e) => updateFormData('companyInfo', 'size', e.target.value)}
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
          Founded Year
        </label>
        <input
          type="number"
          value={formData.companyInfo.founded}
          onChange={(e) => updateFormData('companyInfo', 'founded', parseInt(e.target.value) || '')}
          className="input-field"
          placeholder="e.g., 2020"
          min="1900"
          max={new Date().getFullYear()}
        />
      </div>
    </div>

    <div className="border-t pt-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Headquarters Location *</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Province *
          </label>
          <select
            value={formData.companyInfo.headquarters.province}
            onChange={(e) => updateNestedFormData('companyInfo', 'headquarters', 'province', e.target.value)}
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
            value={formData.companyInfo.headquarters.district}
            onChange={(e) => updateNestedFormData('companyInfo', 'headquarters', 'district', e.target.value)}
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
            value={formData.companyInfo.headquarters.sector}
            onChange={(e) => updateNestedFormData('companyInfo', 'headquarters', 'sector', e.target.value)}
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
            value={formData.companyInfo.headquarters.cell}
            onChange={(e) => updateNestedFormData('companyInfo', 'headquarters', 'cell', e.target.value)}
            className="input-field"
            placeholder="e.g., Kibagabaga"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street Address
          </label>
          <input
            type="text"
            value={formData.companyInfo.headquarters.address}
            onChange={(e) => updateNestedFormData('companyInfo', 'headquarters', 'address', e.target.value)}
            className="input-field"
            placeholder="e.g., KG 123 St, Building Name"
          />
        </div>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Company Bio *
      </label>
      <textarea
        value={formData.bio}
        onChange={(e) => updateFormData(null, 'bio', e.target.value)}
        rows="3"
        className="input-field"
        placeholder="Brief overview of your company..."
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Company Description *
      </label>
      <textarea
        value={formData.companyInfo.description}
        onChange={(e) => updateFormData('companyInfo', 'description', e.target.value)}
        rows="4"
        className="input-field"
        placeholder="Detailed description of your company's mission, values, and what you do..."
        required
      />
    </div>

    <div className="border-t pt-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Location *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => updateFormData(null, 'location', e.target.value)}
            className="input-field"
            placeholder="e.g., Kigali, Rwanda"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => updateFormData(null, 'website', e.target.value)}
            className="input-field"
            placeholder="e.g., https://www.company.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn
          </label>
          <input
            type="url"
            value={formData.socialMedia.linkedin}
            onChange={(e) => updateFormData('socialMedia', 'linkedin', e.target.value)}
            className="input-field"
            placeholder="e.g., https://linkedin.com/company/yourcompany"
          />
        </div>
      </div>
    </div>
  </div>
);

// Stage 2: Branch Locations Component
const BranchLocationsStep = ({ formData, updateFormData, rwandanProvinces }) => {
  const addBranch = () => {
    const newBranch = {
      name: '',
      location: {
        province: '',
        district: '',
        sector: '',
        cell: '',
        address: ''
      },
      isHeadquarters: false,
      employeeCount: 0
    };

    updateFormData(null, 'branches', [...formData.branches, newBranch]);
  };

  const removeBranch = (index) => {
    const updatedBranches = formData.branches.filter((_, i) => i !== index);
    updateFormData(null, 'branches', updatedBranches);
  };

  const updateBranch = (index, field, value) => {
    const updatedBranches = [...formData.branches];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updatedBranches[index][parent][child] = value;
    } else {
      updatedBranches[index][field] = value;
    }
    updateFormData(null, 'branches', updatedBranches);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.hasBranches}
            onChange={(e) => updateFormData(null, 'hasBranches', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Our company has multiple branch locations</span>
        </label>
      </div>

      {formData.hasBranches && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">Branch Locations</h3>
            <button
              type="button"
              onClick={addBranch}
              className="btn-secondary px-4 py-2"
            >
              Add Branch
            </button>
          </div>

          {formData.branches.map((branch, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-700">Branch {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeBranch(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    value={branch.name}
                    onChange={(e) => updateBranch(index, 'name', e.target.value)}
                    className="input-field"
                    placeholder="e.g., Kigali Branch"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Count
                  </label>
                  <input
                    type="number"
                    value={branch.employeeCount}
                    onChange={(e) => updateBranch(index, 'employeeCount', parseInt(e.target.value) || 0)}
                    className="input-field"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Province
                  </label>
                  <select
                    value={branch.location.province}
                    onChange={(e) => updateBranch(index, 'location.province', e.target.value)}
                    className="input-field"
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
                    value={branch.location.district}
                    onChange={(e) => updateBranch(index, 'location.district', e.target.value)}
                    className="input-field"
                    placeholder="e.g., Gasabo"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={branch.location.address}
                    onChange={(e) => updateBranch(index, 'location.address', e.target.value)}
                    className="input-field"
                    placeholder="Full address"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={branch.isHeadquarters}
                      onChange={(e) => updateBranch(index, 'isHeadquarters', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">This is our headquarters</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!formData.hasBranches && (
        <div className="text-center py-8 text-gray-500">
          <p>Single location company? No problem! You can add branch locations later as your company grows.</p>
        </div>
      )}
    </div>
  );
};

// Stage 3: HR Needs Component
const HRNeedsStep = ({ formData, updateFormData }) => {
  const addSkill = () => {
    const newSkill = {
      skill: '',
      level: '',
      priority: ''
    };

    const updatedSkills = [...formData.hrNeeds.skillsNeeded, newSkill];
    updateFormData('hrNeeds', 'skillsNeeded', updatedSkills);
  };

  const removeSkill = (index) => {
    const updatedSkills = formData.hrNeeds.skillsNeeded.filter((_, i) => i !== index);
    updateFormData('hrNeeds', 'skillsNeeded', updatedSkills);
  };

  const updateSkill = (index, field, value) => {
    const updatedSkills = [...formData.hrNeeds.skillsNeeded];
    updatedSkills[index][field] = value;
    updateFormData('hrNeeds', 'skillsNeeded', updatedSkills);
  };

  const addDepartment = () => {
    const newDepartment = {
      department: '',
      positionsNeeded: 0,
      skills: [],
      urgency: ''
    };

    const updatedDepartments = [...formData.hrNeeds.departmentNeeds, newDepartment];
    updateFormData('hrNeeds', 'departmentNeeds', updatedDepartments);
  };

  const removeDepartment = (index) => {
    const updatedDepartments = formData.hrNeeds.departmentNeeds.filter((_, i) => i !== index);
    updateFormData('hrNeeds', 'departmentNeeds', updatedDepartments);
  };

  const updateDepartment = (index, field, value) => {
    const updatedDepartments = [...formData.hrNeeds.departmentNeeds];
    if (field === 'skills') {
      updatedDepartments[index][field] = value.split(',').map(skill => skill.trim()).filter(skill => skill);
    } else {
      updatedDepartments[index][field] = value;
    }
    updateFormData('hrNeeds', 'departmentNeeds', updatedDepartments);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Positions Needed
          </label>
          <input
            type="number"
            value={formData.hrNeeds.totalPositionsNeeded}
            onChange={(e) => updateFormData('hrNeeds', 'totalPositionsNeeded', parseInt(e.target.value) || 0)}
            className="input-field"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Urgent Positions
          </label>
          <input
            type="number"
            value={formData.hrNeeds.urgentPositions}
            onChange={(e) => updateFormData('hrNeeds', 'urgentPositions', parseInt(e.target.value) || 0)}
            className="input-field"
            min="0"
          />
        </div>
      </div>

      {/* Skills Needed Section */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">Skills Needed</h3>
          <button
            type="button"
            onClick={addSkill}
            className="btn-secondary px-4 py-2"
          >
            Add Skill
          </button>
        </div>

        {formData.hrNeeds.skillsNeeded.map((skill, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium text-gray-700">Skill {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill Name
                </label>
                <input
                  type="text"
                  value={skill.skill}
                  onChange={(e) => updateSkill(index, 'skill', e.target.value)}
                  className="input-field"
                  placeholder="e.g., JavaScript, Project Management"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level Required
                </label>
                <select
                  value={skill.level}
                  onChange={(e) => updateSkill(index, 'level', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={skill.priority}
                  onChange={(e) => updateSkill(index, 'priority', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Department Needs Section */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">Department Needs</h3>
          <button
            type="button"
            onClick={addDepartment}
            className="btn-secondary px-4 py-2"
          >
            Add Department
          </button>
        </div>

        {formData.hrNeeds.departmentNeeds.map((dept, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium text-gray-700">Department {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeDepartment(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name
                </label>
                <input
                  type="text"
                  value={dept.department}
                  onChange={(e) => updateDepartment(index, 'department', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Engineering, Marketing"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Positions Needed
                </label>
                <input
                  type="number"
                  value={dept.positionsNeeded}
                  onChange={(e) => updateDepartment(index, 'positionsNeeded', parseInt(e.target.value) || 0)}
                  className="input-field"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={dept.skills.join(', ')}
                  onChange={(e) => updateDepartment(index, 'skills', e.target.value)}
                  className="input-field"
                  placeholder="e.g., React, Node.js, Leadership"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency
                </label>
                <select
                  value={dept.urgency}
                  onChange={(e) => updateDepartment(index, 'urgency', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Urgency</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Immediate">Immediate</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CompanySetupStages = () => {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form data for all steps
  const [formData, setFormData] = useState({
    // Step 1: Company Identification
    companyInfo: {
      name: '',
      tinNumber: '',
      registrationNumber: '',
      industry: '',
      size: '',
      founded: '',
      headquarters: {
        province: '',
        district: '',
        sector: '',
        cell: '',
        address: ''
      },
      description: ''
    },
    // Step 2: Branch Locations
    branches: [],
    hasBranches: false,
    // Step 3: HR Needs
    hrNeeds: {
      totalPositionsNeeded: 0,
      urgentPositions: 0,
      skillsNeeded: [],
      departmentNeeds: []
    },
    // Contact and social media
    bio: '',
    location: '',
    phone: '',
    website: '',
    socialMedia: {
      linkedin: '',
      twitter: '',
      facebook: ''
    }
  });

  // Constants
  const rwandanProvinces = [
    'Kigali City',
    'Eastern Province',
    'Northern Province',
    'Southern Province',
    'Western Province'
  ];

  const industries = [
    'Technology',
    'Healthcare',
    'Finance & Banking',
    'Education',
    'Manufacturing',
    'Agriculture',
    'Tourism & Hospitality',
    'Construction',
    'Retail & Trade',
    'Transportation',
    'Energy & Utilities',
    'Telecommunications',
    'Mining',
    'Government',
    'Non-profit',
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

  const totalSteps = 3;

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

  const validateStep = (step) => {
    switch (step) {
      case 1:
        const { name, tinNumber, industry, size, headquarters, description } = formData.companyInfo;
        return name && tinNumber && industry && size && headquarters.province && description &&
               formData.bio && formData.location;
      case 2:
        return true; // Branches are optional
      case 3:
        return true; // HR needs are optional but recommended
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
    if (!validateStep(currentStep)) {
      setAlert('Please complete all required fields', 'error');
      return;
    }

    setLoading(true);

    try {
      const profileData = {
        bio: formData.bio,
        location: formData.location,
        phone: formData.phone,
        website: formData.website,
        company: {
          name: formData.companyInfo.name,
          tinNumber: formData.companyInfo.tinNumber,
          registrationNumber: formData.companyInfo.registrationNumber,
          industry: formData.companyInfo.industry,
          size: formData.companyInfo.size,
          founded: formData.companyInfo.founded,
          headquarters: formData.companyInfo.headquarters,
          description: formData.companyInfo.description,
          branches: formData.branches,
          hrNeeds: formData.hrNeeds,
          socialMedia: formData.socialMedia
        }
      };

      console.log('Submitting company profile data:', JSON.stringify(profileData, null, 2));
      console.log('Company size being sent:', profileData.company.size);
      const response = await axios.post('/api/profiles', profileData);

      setAlert('Company profile created successfully! Welcome to EOC!', 'success');

      // Small delay to show success message, then redirect
      setTimeout(() => {
        navigate('/company');
      }, 1500);
    } catch (err) {
      console.error('Company profile creation error:', err);
      console.error('Error response:', err.response);

      let errorMessage = 'Error creating company profile';

      if (err.response?.data) {
        const { data } = err.response;

        if (data.errors && Array.isArray(data.errors)) {
          errorMessage = data.errors.map(error => error.msg || error.message).join(', ');
        } else if (data.msg) {
          errorMessage = data.msg;
        } else if (data.message && data.message.includes('validation failed')) {
          const validationErrors = data.message.split(': ')[1];
          errorMessage = `Validation failed: ${validationErrors}`;
        } else if (data.error) {
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
      case 1: return 'Company Identification';
      case 2: return 'Branch Locations';
      case 3: return 'Human Resources Needs';
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
              Let's set up your complete company profile to start finding the perfect candidates.
            </p>
          </div>

          <ProgressBar />

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {getStepTitle()}
            </h2>
          </div>

          {/* Step content */}
          <div className="min-h-[400px]">
            {currentStep === 1 && (
              <CompanyIdentificationStep
                formData={formData}
                updateFormData={updateFormData}
                updateNestedFormData={updateNestedFormData}
                rwandanProvinces={rwandanProvinces}
                industries={industries}
                companySizes={companySizes}
              />
            )}
            {currentStep === 2 && (
              <BranchLocationsStep
                formData={formData}
                updateFormData={updateFormData}
                rwandanProvinces={rwandanProvinces}
              />
            )}
            {currentStep === 3 && (
              <HRNeedsStep
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

export default CompanySetupStages;
