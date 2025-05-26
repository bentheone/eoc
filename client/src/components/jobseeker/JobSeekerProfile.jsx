import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

const JobSeekerProfile = () => {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  
  const [profile, setProfile] = useState({
    bio: '',
    location: '',
    website: '',
    phone: '',
    title: '',
    skills: '',
    preferredJobTypes: [],
    preferredLocations: '',
    expectedSalary: '',
    experience: [],
    education: []
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/profiles/me');
        const profileData = res.data;
        
        setProfile({
          bio: profileData.bio || '',
          location: profileData.location || '',
          website: profileData.website || '',
          phone: profileData.phone || '',
          title: profileData.jobSeeker?.title || '',
          skills: profileData.jobSeeker?.skills?.join(', ') || '',
          preferredJobTypes: profileData.jobSeeker?.preferredJobTypes || [],
          preferredLocations: profileData.jobSeeker?.preferredLocations?.join(', ') || '',
          expectedSalary: profileData.jobSeeker?.expectedSalary || '',
          experience: profileData.jobSeeker?.experience || [],
          education: profileData.jobSeeker?.education || []
        });
        
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 400) {
          // No profile exists yet
          setLoading(false);
        } else {
          console.error(err);
          setAlert('Error fetching profile', 'error');
          setLoading(false);
        }
      }
    };
    
    fetchProfile();
  }, [setAlert]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (checked) {
        setProfile(prev => ({
          ...prev,
          preferredJobTypes: [...prev.preferredJobTypes, value]
        }));
      } else {
        setProfile(prev => ({
          ...prev,
          preferredJobTypes: prev.preferredJobTypes.filter(type => type !== value)
        }));
      }
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const profileData = {
        bio: profile.bio,
        location: profile.location,
        website: profile.website,
        phone: profile.phone,
        title: profile.title,
        skills: profile.skills,
        preferredJobTypes: profile.preferredJobTypes,
        preferredLocations: profile.preferredLocations,
        expectedSalary: profile.expectedSalary,
        experience: profile.experience,
        education: profile.education
      };
      
      await axios.post('/api/profiles', profileData);
      setAlert('Profile updated successfully', 'success');
    } catch (err) {
      console.error(err);
      setAlert('Error updating profile', 'error');
    }
    
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Job Seeker Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={onSubmit}>
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bio" className="block text-gray-700 text-sm font-bold mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={onChange}
                  className="input-field"
                  rows="4"
                  placeholder="Tell us about yourself..."
                  required
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={profile.location}
                  onChange={onChange}
                  className="input-field"
                  placeholder="City, Country"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profile.phone}
                  onChange={onChange}
                  className="input-field"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <label htmlFor="website" className="block text-gray-700 text-sm font-bold mb-2">
                  Website/Portfolio
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={profile.website}
                  onChange={onChange}
                  className="input-field"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
          
          {/* Professional Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Professional Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                  Professional Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={profile.title}
                  onChange={onChange}
                  className="input-field"
                  placeholder="e.g., Software Developer"
                />
              </div>
              
              <div>
                <label htmlFor="skills" className="block text-gray-700 text-sm font-bold mb-2">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={profile.skills}
                  onChange={onChange}
                  className="input-field"
                  placeholder="JavaScript, React, Node.js, Python"
                />
              </div>
              
              <div>
                <label htmlFor="expectedSalary" className="block text-gray-700 text-sm font-bold mb-2">
                  Expected Salary (Annual)
                </label>
                <input
                  type="number"
                  id="expectedSalary"
                  name="expectedSalary"
                  value={profile.expectedSalary}
                  onChange={onChange}
                  className="input-field"
                  placeholder="50000"
                />
              </div>
              
              <div>
                <label htmlFor="preferredLocations" className="block text-gray-700 text-sm font-bold mb-2">
                  Preferred Locations (comma-separated)
                </label>
                <input
                  type="text"
                  id="preferredLocations"
                  name="preferredLocations"
                  value={profile.preferredLocations}
                  onChange={onChange}
                  className="input-field"
                  placeholder="New York, San Francisco, Remote"
                />
              </div>
            </div>
            
            {/* Preferred Job Types */}
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Preferred Job Types
              </label>
              <div className="flex flex-wrap gap-4">
                {['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'].map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      value={type}
                      checked={profile.preferredJobTypes.includes(type)}
                      onChange={onChange}
                      className="mr-2"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          {/* Experience Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Experience</h2>
            <p className="text-gray-600 mb-4">
              Experience management will be available in the next update. For now, please include your experience in your bio.
            </p>
          </div>
          
          {/* Education Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Education</h2>
            <p className="text-gray-600 mb-4">
              Education management will be available in the next update. For now, please include your education in your bio.
            </p>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobSeekerProfile;
