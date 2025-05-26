import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

const AdminJobs = () => {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('/api/jobs/admin');
        setJobs(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setAlert('Error fetching jobs', 'error');
        setLoading(false);
      }
    };

    fetchJobs();
  }, [setAlert]);

  const handleStatusUpdate = async (jobId, status) => {
    try {
      await axios.put(`/api/jobs/${jobId}/status`, { status });
      setJobs(jobs.map(job =>
        job._id === jobId ? { ...job, status } : job
      ));
      setAlert(`Job ${status} successfully`, 'success');
    } catch (err) {
      console.error(err);
      setAlert('Error updating job status', 'error');
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-800"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Job Management</h1>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            All ({jobs.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Pending ({jobs.filter(j => j.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded ${filter === 'approved' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Approved ({jobs.filter(j => j.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded ${filter === 'rejected' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Rejected ({jobs.filter(j => j.status === 'rejected').length})
          </button>
        </div>
      </div>

      {/* Jobs List */}
      {filteredJobs.length > 0 ? (
        <div className="space-y-6">
          {filteredJobs.map(job => (
            <div key={job._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
                  <p className="text-gray-600">{job.company.name}</p>
                  <p className="text-gray-500">{job.location} • {job.jobType}</p>
                  {job.salary && (
                    <p className="text-gray-500">${job.salary.toLocaleString()}/year</p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(job.status)}`}>
                    {formatStatus(job.status)}
                  </span>
                  <div className="text-sm text-gray-500 mt-2">
                    Posted: {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700 text-sm">{job.description}</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Requirements</h3>
                <p className="text-gray-700 text-sm">{job.requirements}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <span className="font-semibold">Experience:</span> {job.experience}
                </div>
                <div>
                  <span className="font-semibold">Education:</span> {job.education}
                </div>
                <div>
                  <span className="font-semibold">Company Email:</span> {job.company.email}
                </div>
                {job.applicationDeadline && (
                  <div>
                    <span className="font-semibold">Deadline:</span> {new Date(job.applicationDeadline).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <span className="font-semibold">Skills:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {job.status === 'pending' && (
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => handleStatusUpdate(job._id, 'approved')}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(job._id, 'rejected')}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}

              {job.status === 'approved' && (
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => handleStatusUpdate(job._id, 'closed')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Close Job
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(job._id, 'rejected')}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">💼</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Jobs Found</h2>
          <p className="text-gray-600">
            {filter === 'all'
              ? 'No jobs in the system yet.'
              : `No jobs with status "${filter}" found.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

const getStatusColor = (status) => {
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

const formatStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default AdminJobs;
