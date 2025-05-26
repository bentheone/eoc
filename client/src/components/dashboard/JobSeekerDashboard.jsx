import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

const JobSeekerDashboard = () => {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile
        const profileRes = await axios.get('/api/profiles/me');
        setProfile(profileRes.data);
        
        // Fetch matches
        const matchesRes = await axios.get('/api/matches/jobseeker');
        setMatches(matchesRes.data);
        
        // Fetch documents
        const documentsRes = await axios.get('/api/documents');
        setDocuments(documentsRes.data);
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setAlert('Error fetching dashboard data', 'error');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [setAlert]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Job Seeker Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome, {user.name}!</h2>
            <p className="text-gray-600">
              {profile ? 'Your profile is set up and ready.' : 'Please complete your profile to get started.'}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            {profile ? (
              <Link to="/jobseeker/profile" className="btn-secondary">
                Edit Profile
              </Link>
            ) : (
              <Link to="/jobseeker/profile" className="btn-primary">
                Create Profile
              </Link>
            )}
          </div>
        </div>
        
        {/* Profile Completion */}
        {profile && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Profile Completion</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${calculateProfileCompletion(profile)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Your profile is {calculateProfileCompletion(profile)}% complete
            </p>
          </div>
        )}
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Matches</h3>
            <p className="text-3xl font-bold text-primary">{matches.length}</p>
            <Link to="/jobseeker/matches" className="text-primary hover:underline text-sm">
              View all matches
            </Link>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Documents</h3>
            <p className="text-3xl font-bold text-primary">{documents.length}</p>
            <Link to="/jobseeker/documents" className="text-primary hover:underline text-sm">
              Manage documents
            </Link>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Applications</h3>
            <p className="text-3xl font-bold text-primary">
              {matches.filter(match => match.status === 'applied').length}
            </p>
            <Link to="/jobseeker/matches" className="text-primary hover:underline text-sm">
              View applications
            </Link>
          </div>
        </div>
      </div>
      
      {/* Recent Matches */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Matches</h2>
          <Link to="/jobseeker/matches" className="text-primary hover:underline">
            View All
          </Link>
        </div>
        
        {matches.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Job Title</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Company</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Match Score</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {matches.slice(0, 5).map(match => (
                  <tr key={match._id}>
                    <td className="px-4 py-3 text-sm text-gray-800">{match.job.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{match.company.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{match.matchScore}%</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(match.status)}`}>
                        {formatStatus(match.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No matches found. Complete your profile to get matched with jobs.</p>
        )}
      </div>
      
      {/* Document Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Document Status</h2>
          <Link to="/jobseeker/documents" className="text-primary hover:underline">
            Upload Documents
          </Link>
        </div>
        
        {documents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Document Name</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Type</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Default</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {documents.map(doc => (
                  <tr key={doc._id}>
                    <td className="px-4 py-3 text-sm text-gray-800">{doc.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{formatDocumentType(doc.type)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${getDocumentStatusColor(doc.status)}`}>
                        {formatDocumentStatus(doc.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {doc.isDefault ? (
                        <span className="text-green-500">Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No documents uploaded. Upload your resume and other documents to apply for jobs.</p>
        )}
      </div>
    </div>
  );
};

// Helper functions
const calculateProfileCompletion = (profile) => {
  if (!profile) return 0;
  
  let totalFields = 0;
  let completedFields = 0;
  
  // Basic profile fields
  const basicFields = ['bio', 'location', 'phone'];
  totalFields += basicFields.length;
  completedFields += basicFields.filter(field => profile[field]).length;
  
  // Job seeker specific fields
  if (profile.jobSeeker) {
    // Title and skills
    totalFields += 2;
    if (profile.jobSeeker.title) completedFields++;
    if (profile.jobSeeker.skills && profile.jobSeeker.skills.length > 0) completedFields++;
    
    // Experience
    totalFields++;
    if (profile.jobSeeker.experience && profile.jobSeeker.experience.length > 0) completedFields++;
    
    // Education
    totalFields++;
    if (profile.jobSeeker.education && profile.jobSeeker.education.length > 0) completedFields++;
    
    // Preferences
    totalFields += 3;
    if (profile.jobSeeker.preferredJobTypes && profile.jobSeeker.preferredJobTypes.length > 0) completedFields++;
    if (profile.jobSeeker.preferredLocations && profile.jobSeeker.preferredLocations.length > 0) completedFields++;
    if (profile.jobSeeker.expectedSalary) completedFields++;
  }
  
  return Math.round((completedFields / totalFields) * 100);
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-blue-100 text-blue-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'applied':
      return 'bg-green-100 text-green-800';
    case 'interviewed':
      return 'bg-purple-100 text-purple-800';
    case 'offered':
      return 'bg-indigo-100 text-indigo-800';
    case 'hired':
      return 'bg-green-100 text-green-800';
    case 'closed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatDocumentType = (type) => {
  switch (type) {
    case 'resume':
      return 'Resume';
    case 'cv':
      return 'CV';
    case 'cover_letter':
      return 'Cover Letter';
    case 'certificate':
      return 'Certificate';
    case 'other':
      return 'Other';
    default:
      return type;
  }
};

const getDocumentStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDocumentStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default JobSeekerDashboard;
