import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

const AdminMatches = () => {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get('/api/matches/admin');
        setMatches(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setAlert('Error fetching matches', 'error');
        setLoading(false);
      }
    };

    fetchMatches();
  }, [setAlert]);

  const handleApproval = async (matchId, approved, notes = '') => {
    try {
      await axios.put(`/api/matches/${matchId}/admin-approval`, {
        adminApproved: approved,
        adminNotes: notes
      });

      setMatches(matches.map(match =>
        match._id === matchId ? { ...match, adminApproved: approved, adminNotes: notes } : match
      ));

      setAlert(`Match ${approved ? 'approved' : 'rejected'} successfully`, 'success');
    } catch (err) {
      console.error(err);
      setAlert('Error updating match approval', 'error');
    }
  };

  const filteredMatches = matches.filter(match => {
    if (filter === 'pending') return !match.adminApproved;
    if (filter === 'approved') return match.adminApproved;
    return true;
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Match Management</h1>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Pending Approval ({matches.filter(m => !m.adminApproved).length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded ${filter === 'approved' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Approved ({matches.filter(m => m.adminApproved).length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            All ({matches.length})
          </button>
        </div>
      </div>

      {/* Matches List */}
      {filteredMatches.length > 0 ? (
        <div className="space-y-6">
          {filteredMatches.map(match => (
            <div key={match._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {match.jobSeeker.name} → {match.job.title}
                  </h2>
                  <p className="text-gray-600">{match.company.name}</p>
                  <p className="text-gray-500">{match.job.location}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-800">{match.matchScore}%</div>
                  <div className="text-sm text-gray-500">Match Score</div>
                  <div className="mt-2">
                    {match.adminApproved ? (
                      <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                        Approved
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500">Skills Match</div>
                  <div className="font-semibold">{match.matchDetails.skillsMatch}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Experience Match</div>
                  <div className="font-semibold">{match.matchDetails.experienceMatch}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Education Match</div>
                  <div className="font-semibold">{match.matchDetails.educationMatch}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Location Match</div>
                  <div className="font-semibold">{match.matchDetails.locationMatch}%</div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Job Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Job Seeker Email:</span> {match.jobSeeker.email}
                  </div>
                  <div>
                    <span className="font-semibold">Company Email:</span> {match.company.email}
                  </div>
                  <div>
                    <span className="font-semibold">Job Type:</span> {match.job.jobType}
                  </div>
                  <div>
                    <span className="font-semibold">Created:</span> {new Date(match.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {match.adminNotes && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Admin Notes</h3>
                  <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">{match.adminNotes}</p>
                </div>
              )}

              {!match.adminApproved && (
                <div className="border-t pt-4">
                  <div className="flex flex-col space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Admin Notes (required for rejection)
                      </label>
                      <textarea
                        id={`notes-${match._id}`}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                        rows="3"
                        placeholder="Add notes about this match..."
                      />
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => {
                          const notes = document.getElementById(`notes-${match._id}`).value;
                          if (!notes.trim()) {
                            setAlert('Please add notes before rejecting', 'error');
                            return;
                          }
                          handleApproval(match._id, false, notes);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          const notes = document.getElementById(`notes-${match._id}`).value;
                          handleApproval(match._id, true, notes);
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
          <div className="text-gray-400 text-6xl mb-4">🎯</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Matches Found</h2>
          <p className="text-gray-600">
            {filter === 'pending'
              ? 'No matches pending approval.'
              : filter === 'approved'
              ? 'No approved matches yet.'
              : 'No matches in the system yet.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminMatches;
