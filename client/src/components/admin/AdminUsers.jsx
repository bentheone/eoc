import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/users');
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setAlert('Error fetching users', 'error');
        setLoading(false);
      }
    };

    fetchUsers();
  }, [setAlert]);

  const handleStatusUpdate = async (userId, isActive) => {
    try {
      const userToUpdate = users.find(u => u._id === userId);
      await axios.put(`/api/users/${userId}`, {
        name: userToUpdate.name,
        email: userToUpdate.email,
        role: userToUpdate.role,
        isActive
      });

      setUsers(users.map(u =>
        u._id === userId ? { ...u, isActive } : u
      ));

      setAlert(`User ${isActive ? 'activated' : 'deactivated'} successfully`, 'success');
    } catch (err) {
      console.error(err);
      setAlert('Error updating user status', 'error');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`/api/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      setAlert('User deleted successfully', 'success');
    } catch (err) {
      console.error(err);
      setAlert('Error deleting user', 'error');
    }
  };

  const filteredUsers = users.filter(u => {
    if (filter === 'all') return true;
    if (filter === 'active') return u.isActive;
    if (filter === 'inactive') return !u.isActive;
    if (filter === 'verified') return u.isVerified;
    if (filter === 'unverified') return !u.isVerified;
    return u.role === filter;
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            All ({users.length})
          </button>
          <button
            onClick={() => setFilter('jobseeker')}
            className={`px-4 py-2 rounded ${filter === 'jobseeker' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Job Seekers ({users.filter(u => u.role === 'jobseeker').length})
          </button>
          <button
            onClick={() => setFilter('company')}
            className={`px-4 py-2 rounded ${filter === 'company' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Companies ({users.filter(u => u.role === 'company').length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded ${filter === 'active' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Active ({users.filter(u => u.isActive).length})
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded ${filter === 'inactive' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Inactive ({users.filter(u => !u.isActive).length})
          </button>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(u => (
                <tr key={u._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{u.name}</div>
                      <div className="text-sm text-gray-500">{u.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(u.role)}`}>
                      {formatRole(u.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {u.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(u._id, !u.isActive)}
                        className={`${u.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
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
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Users Found</h2>
          <p className="text-gray-600">
            {filter === 'all'
              ? 'No users in the system yet.'
              : `No users matching the "${filter}" filter.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

const getRoleColor = (role) => {
  switch (role) {
    case 'jobseeker':
      return 'bg-blue-100 text-blue-800';
    case 'company':
      return 'bg-purple-100 text-purple-800';
    case 'admin':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
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

export default AdminUsers;
