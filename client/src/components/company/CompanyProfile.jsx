import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

const CompanyProfile = () => {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  
  const [profile, setProfile] = useState({
    bio: '',
    location: '',
    website: '',
    phone: '',
    name: '',
    industry: '',
    size: '',
    founded: '',
    description: '',
    socialMedia: {
      linkedin: '',
      twitter: '',
      facebook: ''
    }
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
          name: profileData.company?.name || '',
          industry: profileData.company?.industry || '',
          size: profileData.company?.size || '',
          founded: profileData.company?.founded || '',
          description: profileData.company?.description || '',
          socialMedia: {
            linkedin: profileData.company?.socialMedia?.linkedin || '',
            twitter: profileData.company?.socialMedia?.twitter || '',
            facebook: profileData.company?.socialMedia?.facebook || ''
          }
        });
        
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 400) {
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
    const { name, value } = e.target;
    
    if (name.startsWith('socialMedia.')) {
      const field = name.split('.')[1];
      setProfile(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [field]: value
        }
      }));
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
        name: profile.name,
        industry: profile.industry,
        size: profile.size,
        founded: profile.founded,
        description: profile.description,
        socialMedia: profile.socialMedia
      };
      
      await axios.post('/api/profiles', profileData);
      setAlert('Company profile updated successfully', 'success');
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Company Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={onSubmit}>
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={onChange}
                  className="input-field"
                  placeholder="Your Company Name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="industry" className="block text-gray-700 text-sm font-bold mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  value={profile.industry}
                  onChange={onChange}
                  className="input-field"
                  placeholder="e.g., Technology, Healthcare"
                />
              </div>
              
              <div>
                <label htmlFor="size" className="block text-gray-700 text-sm font-bold mb-2">
                  Company Size
                </label>
                <select
                  id="size"
                  name="size"
                  value={profile.size}
                  onChange={onChange}
                  className="input-field"
                >
                  <option value="">Select company size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="founded" className="block text-gray-700 text-sm font-bold mb-2">
                  Founded Year
                </label>
                <input
                  type="number"
                  id="founded"
                  name="founded"
                  value={profile.founded}
                  onChange={onChange}
                  className="input-field"
                  placeholder="2020"
                  min="1800"
                  max={new Date().getFullYear()}
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
                <label htmlFor="website" className="block text-gray-700 text-sm font-bold mb-2">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={profile.website}
                  onChange={onChange}
                  className="input-field"
                  placeholder="https://yourcompany.com"
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
            </div>
            
            <div className="mt-4">
              <label htmlFor="bio" className="block text-gray-700 text-sm font-bold mb-2">
                Company Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={onChange}
                className="input-field"
                rows="3"
                placeholder="Brief description of your company..."
                required
              />
            </div>
            
            <div className="mt-4">
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                Detailed Description
              </label>
              <textarea
                id="description"
                name="description"
                value={profile.description}
                onChange={onChange}
                className="input-field"
                rows="5"
                placeholder="Detailed description of your company, culture, and values..."
              />
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Social Media</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="linkedin" className="block text-gray-700 text-sm font-bold mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  id="linkedin"
                  name="socialMedia.linkedin"
                  value={profile.socialMedia.linkedin}
                  onChange={onChange}
                  className="input-field"
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
              
              <div>
                <label htmlFor="twitter" className="block text-gray-700 text-sm font-bold mb-2">
                  Twitter
                </label>
                <input
                  type="url"
                  id="twitter"
                  name="socialMedia.twitter"
                  value={profile.socialMedia.twitter}
                  onChange={onChange}
                  className="input-field"
                  placeholder="https://twitter.com/yourcompany"
                />
              </div>
              
              <div>
                <label htmlFor="facebook" className="block text-gray-700 text-sm font-bold mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  id="facebook"
                  name="socialMedia.facebook"
                  value={profile.socialMedia.facebook}
                  onChange={onChange}
                  className="input-field"
                  placeholder="https://facebook.com/yourcompany"
                />
              </div>
            </div>
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

export default CompanyProfile;
