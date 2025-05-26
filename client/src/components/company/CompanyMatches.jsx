import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

const CompanyMatches = () => {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get('/api/matches/company');
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

  const handleStatusUpdate = async (matchId, status) => {
    try {
      await axios.put(`/api/matches/${matchId}/status`, { status });
      setMatches(matches.map(match =>
        match._id === matchId ? { ...match, status } : match
      ));
      setAlert(`Match status updated to ${status}`, 'success');
    } catch (err) {
      console.error(err);
      setAlert('Error updating match status', 'error');
    }
  };

  const filteredMatches = matches.filter(match => {
    if (filter === 'all') return true;
    return match.status === filter;
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Candidate Matches</h1>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            All ({matches.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            New ({matches.filter(m => m.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('applied')}
            className={`px-4 py-2 rounded ${filter === 'applied' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Applied ({matches.filter(m => m.status === 'applied').length})
          </button>
          <button
            onClick={() => setFilter('interviewed')}
            className={`px-4 py-2 rounded ${filter === 'interviewed' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Interviewed ({matches.filter(m => m.status === 'interviewed').length})
          </button>
        </div>
      </div>

      {/* Matches */}
      {filteredMatches.length > 0 ? (
        <div className="space-y-6">
          {filteredMatches.map(match => (
            <div key={match._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{match.jobSeeker.name}</h2>
                  <p className="text-gray-600">Applied for: {match.job.title}</p>
                  <p className="text-gray-500">{match.job.location}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-800">{match.matchScore}%</div>
                  <div className="text-sm text-gray-500">Match Score</div>
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

              <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(match.status)}`}>
                  {formatStatus(match.status)}
                </span>

                <div className="flex space-x-2">
                  {match.status === 'applied' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(match._id, 'interviewed')}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        Interview
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(match._id, 'rejected')}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {match.status === 'interviewed' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(match._id, 'offered')}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Make Offer
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(match._id, 'rejected')}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {match.status === 'offered' && (
                    <button
                      onClick={() => handleStatusUpdate(match._id, 'hired')}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Mark as Hired
                    </button>
                  )}

                  <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Candidate Matches</h2>
          <p className="text-gray-600">
            {filter === 'all'
              ? 'Post jobs to get matched with qualified candidates.'
              : `No matches with status "${filter}" found.`
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
    case 'applied':
      return 'bg-green-100 text-green-800';
    case 'interviewed':
      return 'bg-purple-100 text-purple-800';
    case 'offered':
      return 'bg-indigo-100 text-indigo-800';
    case 'hired':
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

export default CompanyMatches;
