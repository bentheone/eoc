import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

const CompanyJobs = () => {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    jobType: 'Full-time',
    salary: '',
    skills: '',
    experience: 'Entry Level',
    education: 'High School',
    applicationDeadline: ''
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('/api/jobs/company');
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

  const resetForm = () => {
    setJobForm({
      title: '',
      description: '',
      requirements: '',
      location: '',
      jobType: 'Full-time',
      salary: '',
      skills: '',
      experience: 'Entry Level',
      education: 'High School',
      applicationDeadline: ''
    });
    setEditingJob(null);
    setShowJobForm(false);
  };

  const handleEdit = (job) => {
    setJobForm({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      location: job.location,
      jobType: job.jobType,
      salary: job.salary || '',
      skills: job.skills.join(', '),
      experience: job.experience,
      education: job.education,
      applicationDeadline: job.applicationDeadline ? job.applicationDeadline.split('T')[0] : ''
    });
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const jobData = {
        ...jobForm,
        salary: jobForm.salary ? parseInt(jobForm.salary) : undefined,
        applicationDeadline: jobForm.applicationDeadline || undefined
      };

      if (editingJob) {
        const res = await axios.put(`/api/jobs/${editingJob._id}`, jobData);
        setJobs(jobs.map(job => job._id === editingJob._id ? res.data : job));
        setAlert('Job updated successfully', 'success');
      } else {
        const res = await axios.post('/api/jobs', jobData);
        setJobs([res.data, ...jobs]);
        setAlert('Job posted successfully', 'success');
      }

      resetForm();
    } catch (err) {
      console.error(err);
      setAlert(err.response?.data?.errors?.[0]?.msg || 'Error saving job', 'error');
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      await axios.delete(`/api/jobs/${jobId}`);
      setJobs(jobs.filter(job => job._id !== jobId));
      setAlert('Job deleted successfully', 'success');
    } catch (err) {
      console.error(err);
      setAlert('Error deleting job', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-800"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Job Postings</h1>
        <button
          onClick={() => setShowJobForm(!showJobForm)}
          className="btn-primary"
        >
          {showJobForm ? 'Cancel' : 'Post New Job'}
        </button>
      </div>

      {/* Job Form */}
      {showJobForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editingJob ? 'Edit Job' : 'Post New Job'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobForm.title}
                  onChange={(e) => setJobForm(prev => ({ ...prev, title: e.target.value }))}
                  className="input-field"
                  placeholder="Software Developer"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={jobForm.location}
                  onChange={(e) => setJobForm(prev => ({ ...prev, location: e.target.value }))}
                  className="input-field"
                  placeholder="New York, NY"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Job Type
                </label>
                <select
                  value={jobForm.jobType}
                  onChange={(e) => setJobForm(prev => ({ ...prev, jobType: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Temporary">Temporary</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Salary (Annual)
                </label>
                <input
                  type="number"
                  value={jobForm.salary}
                  onChange={(e) => setJobForm(prev => ({ ...prev, salary: e.target.value }))}
                  className="input-field"
                  placeholder="50000"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Experience Level
                </label>
                <select
                  value={jobForm.experience}
                  onChange={(e) => setJobForm(prev => ({ ...prev, experience: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="Entry Level">Entry Level</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Education Level
                </label>
                <select
                  value={jobForm.education}
                  onChange={(e) => setJobForm(prev => ({ ...prev, education: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="High School">High School</option>
                  <option value="Associate">Associate</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="Doctorate">Doctorate</option>
                  <option value="None">None</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Application Deadline
                </label>
                <input
                  type="date"
                  value={jobForm.applicationDeadline}
                  onChange={(e) => setJobForm(prev => ({ ...prev, applicationDeadline: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Required Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={jobForm.skills}
                  onChange={(e) => setJobForm(prev => ({ ...prev, skills: e.target.value }))}
                  className="input-field"
                  placeholder="JavaScript, React, Node.js"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Job Description
              </label>
              <textarea
                value={jobForm.description}
                onChange={(e) => setJobForm(prev => ({ ...prev, description: e.target.value }))}
                className="input-field"
                rows="4"
                placeholder="Describe the job role and responsibilities..."
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Requirements
              </label>
              <textarea
                value={jobForm.requirements}
                onChange={(e) => setJobForm(prev => ({ ...prev, requirements: e.target.value }))}
                className="input-field"
                rows="4"
                placeholder="List the job requirements and qualifications..."
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {editingJob ? 'Update Job' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Jobs List */}
      {jobs.length > 0 ? (
        <div className="space-y-6">
          {jobs.map(job => (
            <div key={job._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
                  <p className="text-gray-600">{job.location} • {job.jobType}</p>
                  {job.salary && (
                    <p className="text-gray-600">${job.salary.toLocaleString()}/year</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(job.status)}`}>
                    {formatStatus(job.status)}
                  </span>
                  <button
                    onClick={() => handleEdit(job)}
                    className="text-green-800 hover:text-green-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{job.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Experience:</span> {job.experience}
                </div>
                <div>
                  <span className="font-semibold">Education:</span> {job.education}
                </div>
                <div>
                  <span className="font-semibold">Posted:</span> {new Date(job.createdAt).toLocaleDateString()}
                </div>
                {job.applicationDeadline && (
                  <div>
                    <span className="font-semibold">Deadline:</span> {new Date(job.applicationDeadline).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <span className="font-semibold">Skills:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">💼</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Jobs Posted</h2>
          <p className="text-gray-600 mb-4">
            Start by posting your first job to find qualified candidates.
          </p>
          <button
            onClick={() => setShowJobForm(true)}
            className="btn-primary"
          >
            Post Your First Job
          </button>
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

export default CompanyJobs;
