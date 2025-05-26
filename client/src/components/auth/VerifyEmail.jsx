import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState({
    loading: true,
    success: false,
    message: ''
  });

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.get(`/api/auth/verify/${token}`);
        setVerificationStatus({
          loading: false,
          success: true,
          message: 'Your email has been successfully verified. You can now log in to your account.'
        });
      } catch (err) {
        setVerificationStatus({
          loading: false,
          success: false,
          message: err.response?.data?.error || 'Email verification failed. The link may be invalid or expired.'
        });
      }
    };

    verifyEmail();
  }, [token]);

  if (verificationStatus.loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        {verificationStatus.success ? (
          <>
            <div className="text-green-500 text-5xl mb-4">
              <i className="fas fa-check-circle"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Email Verified!</h1>
          </>
        ) : (
          <>
            <div className="text-red-500 text-5xl mb-4">
              <i className="fas fa-times-circle"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Verification Failed</h1>
          </>
        )}
        
        <p className="text-gray-600 mb-6">{verificationStatus.message}</p>
        
        <Link
          to="/login"
          className="btn-primary inline-block"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
