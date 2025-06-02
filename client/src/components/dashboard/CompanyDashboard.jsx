import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

const CompanyDashboard = () => {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);

  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile
        const profileRes = await axios.get('/api/profiles/me');

        if (profileRes.data.exists) {
          setProfile(profileRes.data);

          // Only fetch jobs and matches if profile exists
          try {
            const jobsRes = await axios.get('/api/jobs/company');
            setJobs(jobsRes.data);
          } catch (jobErr) {
            console.log('No jobs found yet');
            setJobs([]);
          }

          try {
            const matchesRes = await axios.get('/api/matches/company');
            setMatches(matchesRes.data);
          } catch (matchErr) {
            console.log('No matches found yet');
            setMatches([]);
          }
        } else {
          // Profile doesn't exist, this shouldn't happen if ProfileCheck is working
          setProfile(null);
          setJobs([]);
          setMatches([]);
        }

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-800"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Company Dashboard</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome, {user.name}!</h2>
            <p className="text-gray-600">
              {profile ? 'Your company profile is set up and ready.' : 'Please complete your company profile to get started.'}
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            {profile ? (
              <Link to="/company/profile" className="btn-secondary">
                Edit Profile
              </Link>
            ) : (
              <Link to="/company/profile" className="btn-primary">
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
                className="bg-green-800 h-2.5 rounded-full"
                style={{ width: `${calculateProfileCompletion(profile)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Your company profile is {calculateProfileCompletion(profile)}% complete
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Jobs</h3>
            <p className="text-3xl font-bold text-green-800">
              {jobs.filter(job => job.status === 'approved' && job.isActive).length}
            </p>
            <Link to="/company/jobs" className="text-green-800 hover:underline text-sm">
              Manage jobs
            </Link>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending Jobs</h3>
            <p className="text-3xl font-bold text-green-800">
              {jobs.filter(job => job.status === 'pending').length}
            </p>
            <Link to="/company/jobs" className="text-green-800 hover:underline text-sm">
              View pending jobs
            </Link>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Candidate Matches</h3>
            <p className="text-3xl font-bold text-green-800">{matches.length}</p>
            <Link to="/company/matches" className="text-green-800 hover:underline text-sm">
              View all matches
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Jobs</h2>
          <Link to="/company/jobs" className="text-green-800 hover:underline">
            View All
          </Link>
        </div>

        {jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Job Title</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Location</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Matches</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {jobs.slice(0, 5).map(job => (
                  <tr key={job._id}>
                    <td className="px-4 py-3 text-sm text-gray-800">{job.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{job.location}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${getJobStatusColor(job.status)}`}>
                        {formatStatus(job.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {matches.filter(match => match.job._id === job._id).length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No jobs posted yet. Create your first job posting to start finding candidates.</p>
        )}
      </div>

      {/* Recent Candidate Matches */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Candidate Matches</h2>
          <Link to="/company/matches" className="text-green-800 hover:underline">
            View All
          </Link>
        </div>

        {matches.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Candidate</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Job</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Match Score</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {matches.slice(0, 5).map(match => (
                  <tr key={match._id}>
                    <td className="px-4 py-3 text-sm text-gray-800">{match.jobSeeker.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{match.job.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{match.matchScore}%</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${getMatchStatusColor(match.status)}`}>
                        {formatStatus(match.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No candidate matches yet. Post jobs to get matched with qualified candidates.</p>
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

  // Company specific fields
  if (profile.company) {
    // Basic company info
    const companyFields = ['name', 'industry', 'size', 'founded', 'description'];
    totalFields += companyFields.length;
    completedFields += companyFields.filter(field => profile.company[field]).length;

    // Social media
    if (profile.company.socialMedia) {
      const socialFields = ['linkedin', 'twitter', 'facebook'];
      totalFields += socialFields.length;
      completedFields += socialFields.filter(field => profile.company.socialMedia[field]).length;
    }
  }

  return Math.round((completedFields / totalFields) * 100);
};

const getJobStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'closed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getMatchStatusColor = (status) => {
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

export default CompanyDashboard;
