import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

type Status = 'loading' | 'success' | 'error';

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');
  const hasVerified = useRef(false);

    useEffect(() => {

    if (hasVerified.current) return;

    hasVerified.current = true;

    const verify = async () => {
        try {
        const { data } = await api.get<{ message: string }>(
            `/auth/verify-email/${token ?? ''}`
        );

        setMessage(data.message);
        setStatus('success');

        } catch (err: unknown) {

        const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data
            ?.message ?? 'Verification failed. The link may have expired.';

        setMessage(msg);
        setStatus('error');
        }
    };

    void verify();

    }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="auth-card text-center">
        {status === 'loading' && (
          <>
            <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900">Verifying your email…</h2>
            <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Email verified!</h2>
            <p className="text-sm text-gray-500 mt-2">{message}</p>
            <Link
              to="/login"
              className="inline-block mt-6 w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition duration-150 text-center"
            >
              Go to login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Verification failed</h2>
            <p className="text-sm text-gray-500 mt-2">{message}</p>
            <Link
              to="/register"
              className="inline-block mt-6 w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition duration-150 text-center"
            >
              Register again
            </Link>
          </>
        )}
      </div>
    </div>
  );
}