import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import JobSeekerSetupStages from '../setup/JobSeekerSetupStages';
import CompanySetupStages from '../setup/CompanySetupStages';

const ProfileCheck = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [profileExists, setProfileExists] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('/api/profiles/me');
        setProfileExists(res.data.exists);
      } catch (err) {
        console.error('Error checking profile:', err);
        // If there's an error, assume profile doesn't exist
        setProfileExists(false);
      }

      setLoading(false);
    };

    checkProfile();
  }, [isAuthenticated, user]);

  // Show loading spinner while checking
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If profile doesn't exist, show setup component
  if (profileExists === false) {
    if (user.role === 'jobseeker') {
      return <JobSeekerSetupStages />;
    } else if (user.role === 'company') {
      return <CompanySetupStages />;
    }
  }

  // If profile exists, render the children (dashboard components)
  return children;
};

export default ProfileCheck;
