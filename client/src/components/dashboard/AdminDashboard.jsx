import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  
  const [stats, setStats] = useState({
    users: 0,
    jobSeekers: 0,
    companies: 0,
    jobs: 0,
    pendingJobs: 0,
    matches: 0,
    pendingMatches: 0,
    documents: 0,
    pendingDocuments: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersRes = await axios.get('/api/users');
        const users = usersRes.data;
        
        // Fetch jobs
        const jobsRes = await axios.get('/api/jobs/admin');
        const jobs = jobsRes.data;
        
        // Fetch matches
        const matchesRes = await axios.get('/api/matches/admin');
        const matches = matchesRes.data;
        
        // Fetch documents
        const documentsRes = await axios.get('/api/documents/admin');
        const documents = documentsRes.data;
        
        // Calculate stats
        setStats({
          users: users.length,
          jobSeekers: users.filter(u => u.role === 'jobseeker').length,
          companies: users.filter(u => u.role === 'company').length,
          jobs: jobs.length,
          pendingJobs: jobs.filter(j => j.status === 'pending').length,
          matches: matches.length,
          pendingMatches: matches.filter(m => !m.adminApproved).length,
          documents: documents.length,
          pendingDocuments: documents.filter(d => d.status === 'pending').length
        });
        
        // Create recent activity
        const activity = [];
        
        // Add recent users
        users.slice(0, 3).forEach(user => {
          activity.push({
            type: 'user_registration',
            message: `New ${user.role} registered: ${user.name}`,
            timestamp: user.createdAt,
            status: user.isVerified ? 'verified' : 'pending'
          });
        });
        
        // Add recent jobs
        jobs.slice(0, 3).forEach(job => {
          activity.push({
            type: 'job_posting',
            message: `New job posted: ${job.title}`,
            timestamp: job.createdAt,
            status: job.status
          });
        });
        
        // Add recent matches
        matches.slice(0, 3).forEach(match => {
          activity.push({
            type: 'match_created',
            message: `New match created with ${match.matchScore}% score`,
            timestamp: match.createdAt,
            status: match.adminApproved ? 'approved' : 'pending'
          });
        });
        
        // Sort by timestamp
        activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setRecentActivity(activity.slice(0, 10));
        
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome, {user.name}!</h2>
        
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.users}</p>
            <div className="text-sm text-blue-600 mt-2">
              <span>{stats.jobSeekers} Job Seekers</span>
              <br />
              <span>{stats.companies} Companies</span>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Jobs</h3>
            <p className="text-3xl font-bold text-green-600">{stats.jobs}</p>
            <div className="text-sm text-green-600 mt-2">
              <span>{stats.pendingJobs} Pending Approval</span>
            </div>
            <Link to="/admin/jobs" className="text-green-600 hover:underline text-sm">
              Manage Jobs
            </Link>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Matches</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.matches}</p>
            <div className="text-sm text-purple-600 mt-2">
              <span>{stats.pendingMatches} Pending Approval</span>
            </div>
            <Link to="/admin/matches" className="text-purple-600 hover:underline text-sm">
              Review Matches
            </Link>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">Documents</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.documents}</p>
            <div className="text-sm text-orange-600 mt-2">
              <span>{stats.pendingDocuments} Pending Review</span>
            </div>
            <Link to="/admin/documents" className="text-orange-600 hover:underline text-sm">
              Review Documents
            </Link>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/users"
            className="bg-primary text-white p-4 rounded-lg hover:bg-primary/90 transition-colors text-center"
          >
            <div className="text-2xl mb-2">👥</div>
            <div className="font-semibold">Manage Users</div>
          </Link>
          
          <Link
            to="/admin/jobs"
            className="bg-primary text-white p-4 rounded-lg hover:bg-primary/90 transition-colors text-center"
          >
            <div className="text-2xl mb-2">💼</div>
            <div className="font-semibold">Review Jobs</div>
          </Link>
          
          <Link
            to="/admin/matches"
            className="bg-primary text-white p-4 rounded-lg hover:bg-primary/90 transition-colors text-center"
          >
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-semibold">Approve Matches</div>
          </Link>
          
          <Link
            to="/admin/documents"
            className="bg-primary text-white p-4 rounded-lg hover:bg-primary/90 transition-colors text-center"
          >
            <div className="text-2xl mb-2">📄</div>
            <div className="font-semibold">Verify Documents</div>
          </Link>
        </div>
      </div>
      
      {/* Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Approvals</h2>
          <div className="space-y-4">
            {stats.pendingJobs > 0 && (
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <span className="font-semibold text-yellow-800">{stats.pendingJobs} Jobs</span>
                  <p className="text-sm text-yellow-600">Waiting for approval</p>
                </div>
                <Link to="/admin/jobs" className="btn-primary text-sm">
                  Review
                </Link>
              </div>
            )}
            
            {stats.pendingMatches > 0 && (
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <span className="font-semibold text-yellow-800">{stats.pendingMatches} Matches</span>
                  <p className="text-sm text-yellow-600">Waiting for approval</p>
                </div>
                <Link to="/admin/matches" className="btn-primary text-sm">
                  Review
                </Link>
              </div>
            )}
            
            {stats.pendingDocuments > 0 && (
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <span className="font-semibold text-yellow-800">{stats.pendingDocuments} Documents</span>
                  <p className="text-sm text-yellow-600">Waiting for verification</p>
                </div>
                <Link to="/admin/documents" className="btn-primary text-sm">
                  Review
                </Link>
              </div>
            )}
            
            {stats.pendingJobs === 0 && stats.pendingMatches === 0 && stats.pendingDocuments === 0 && (
              <p className="text-gray-600">No pending approvals at this time.</p>
            )}
          </div>
        </div>
        
        {/* System Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">System Actions</h2>
          <div className="space-y-4">
            <button
              onClick={() => generateMatches()}
              className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              🔄 Generate New Matches
            </button>
            
            <button
              onClick={() => sendNotifications()}
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              📧 Send Pending Notifications
            </button>
            
            <button
              onClick={() => exportData()}
              className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition-colors"
            >
              📊 Export System Data
            </button>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        
        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getActivityColor(activity.type)}`}></div>
                  <div>
                    <p className="text-sm text-gray-800">{activity.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString()} at{' '}
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(activity.status)}`}>
                  {formatStatus(activity.status)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No recent activity.</p>
        )}
      </div>
    </div>
  );
};

// Helper functions
const generateMatches = async () => {
  try {
    await axios.post('/api/matches/generate');
    window.location.reload();
  } catch (err) {
    console.error('Error generating matches:', err);
  }
};

const sendNotifications = () => {
  // Placeholder for sending notifications
  alert('Notifications sent successfully!');
};

const exportData = () => {
  // Placeholder for data export
  alert('Data export initiated!');
};

const getActivityColor = (type) => {
  switch (type) {
    case 'user_registration':
      return 'bg-blue-500';
    case 'job_posting':
      return 'bg-green-500';
    case 'match_created':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
    case 'verified':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default AdminDashboard;
