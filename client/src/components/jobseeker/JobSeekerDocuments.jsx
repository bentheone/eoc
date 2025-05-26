import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

const JobSeekerDocuments = () => {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  
  const [uploadForm, setUploadForm] = useState({
    name: '',
    type: 'resume',
    file: null,
    isDefault: false
  });

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get('/api/documents');
        setDocuments(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setAlert('Error fetching documents', 'error');
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [setAlert]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadForm(prev => ({
        ...prev,
        file,
        name: prev.name || file.name.split('.')[0]
      }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadForm.file) {
      setAlert('Please select a file', 'error');
      return;
    }
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('name', uploadForm.name);
      formData.append('type', uploadForm.type);
      formData.append('isDefault', uploadForm.isDefault);
      
      const res = await axios.post('/api/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setDocuments([res.data, ...documents]);
      setAlert('Document uploaded successfully', 'success');
      setShowUploadForm(false);
      setUploadForm({
        name: '',
        type: 'resume',
        file: null,
        isDefault: false
      });
    } catch (err) {
      console.error(err);
      setAlert(err.response?.data?.msg || 'Error uploading document', 'error');
    }
    
    setUploading(false);
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }
    
    try {
      await axios.delete(`/api/documents/${documentId}`);
      setDocuments(documents.filter(doc => doc._id !== documentId));
      setAlert('Document deleted successfully', 'success');
    } catch (err) {
      console.error(err);
      setAlert('Error deleting document', 'error');
    }
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Documents</h1>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="btn-primary"
        >
          Upload Document
        </button>
      </div>
      
      {/* Upload Form */}
      {showUploadForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Upload New Document</h2>
          
          <form onSubmit={handleUpload}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  Document Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                  placeholder="My Resume"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">
                  Document Type
                </label>
                <select
                  id="type"
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, type: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="resume">Resume</option>
                  <option value="cv">CV</option>
                  <option value="cover_letter">Cover Letter</option>
                  <option value="certificate">Certificate</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="file" className="block text-gray-700 text-sm font-bold mb-2">
                File (PDF or DOCX only)
              </label>
              <input
                type="file"
                id="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                className="input-field"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={uploadForm.isDefault}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-gray-700">Set as default document for this type</span>
              </label>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="btn-primary"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Documents List */}
      {documents.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Default
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map(doc => (
                <tr key={doc._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {doc.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDocumentType(doc.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                      {formatStatus(doc.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.isDefault ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleDelete(doc._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Documents Uploaded</h2>
          <p className="text-gray-600 mb-4">
            Upload your resume, CV, and other documents to apply for jobs.
          </p>
          <button
            onClick={() => setShowUploadForm(true)}
            className="btn-primary"
          >
            Upload Your First Document
          </button>
        </div>
      )}
    </div>
  );
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

const getStatusColor = (status) => {
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

const formatStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default JobSeekerDocuments;
