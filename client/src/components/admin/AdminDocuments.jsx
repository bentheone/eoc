import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

const AdminDocuments = () => {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get('/api/documents/admin');
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

  const handleStatusUpdate = async (documentId, status, notes = '') => {
    try {
      await axios.put(`/api/documents/${documentId}/status`, {
        status,
        adminNotes: notes
      });

      setDocuments(documents.map(doc =>
        doc._id === documentId ? { ...doc, status, adminNotes: notes } : doc
      ));

      setAlert(`Document ${status} successfully`, 'success');
    } catch (err) {
      console.error(err);
      setAlert('Error updating document status', 'error');
    }
  };

  const filteredDocuments = documents.filter(doc => {
    if (filter === 'all') return true;
    return doc.status === filter;
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Document Management</h1>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Pending ({documents.filter(d => d.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded ${filter === 'approved' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Approved ({documents.filter(d => d.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded ${filter === 'rejected' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Rejected ({documents.filter(d => d.status === 'rejected').length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            All ({documents.length})
          </button>
        </div>
      </div>

      {/* Documents List */}
      {filteredDocuments.length > 0 ? (
        <div className="space-y-6">
          {filteredDocuments.map(doc => (
            <div key={doc._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{doc.name}</h2>
                  <p className="text-gray-600">Uploaded by: {doc.user.name} ({doc.user.email})</p>
                  <p className="text-gray-500">Type: {formatDocumentType(doc.type)}</p>
                  <p className="text-gray-500">Size: {formatFileSize(doc.fileSize)}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(doc.status)}`}>
                    {formatStatus(doc.status)}
                  </span>
                  <div className="text-sm text-gray-500 mt-2">
                    Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                  </div>
                  {doc.isDefault && (
                    <div className="text-sm text-green-600 font-semibold mt-1">
                      Default Document
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">File Type:</span> {doc.fileType}
                  </div>
                  <div>
                    <span className="font-semibold">User Role:</span> {formatRole(doc.user.role || 'jobseeker')}
                  </div>
                  <div>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-800 hover:text-green-700 font-semibold"
                    >
                      View Document →
                    </a>
                  </div>
                </div>
              </div>

              {doc.adminNotes && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Admin Notes</h3>
                  <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">{doc.adminNotes}</p>
                </div>
              )}

              {doc.status === 'pending' && (
                <div className="border-t pt-4">
                  <div className="flex flex-col space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Admin Notes (required for rejection)
                      </label>
                      <textarea
                        id={`notes-${doc._id}`}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                        rows="3"
                        placeholder="Add notes about this document..."
                      />
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => {
                          const notes = document.getElementById(`notes-${doc._id}`).value;
                          if (!notes.trim()) {
                            setAlert('Please add notes before rejecting', 'error');
                            return;
                          }
                          handleStatusUpdate(doc._id, 'rejected', notes);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          const notes = document.getElementById(`notes-${doc._id}`).value;
                          handleStatusUpdate(doc._id, 'approved', notes);
                        }}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Documents Found</h2>
          <p className="text-gray-600">
            {filter === 'pending'
              ? 'No documents pending review.'
              : filter === 'approved'
              ? 'No approved documents yet.'
              : filter === 'rejected'
              ? 'No rejected documents yet.'
              : 'No documents in the system yet.'
            }
          </p>
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

const formatRole = (role) => {
  switch (role) {
    case 'jobseeker':
      return 'Job Seeker';
    case 'company':
      return 'Company';
    case 'admin':
      return 'Admin';
    default:
      return role;
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

export default AdminDocuments;
