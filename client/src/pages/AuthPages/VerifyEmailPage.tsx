import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

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
          (err as { response?: { data?: { message?: string } } })
            ?.response?.data?.message ?? 'Verification failed. The link may have expired.';
        setMessage(msg);
        setStatus('error');
      }
    };

    void verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center">

          {/* LOADING */}
          {status === 'loading' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Verifying your email…</h2>
              <p className="text-sm text-gray-400 mt-2">Please wait a moment</p>

              
              <div className="flex justify-center gap-1 mt-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </>
          )}

          {/* SUCCESS */}
          {status === 'success' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Email verified!</h2>
              <p className="text-sm text-gray-500 mt-2">{message}</p>

              {/* SUCCESS BADGE */}
              <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full mt-4">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Account activated
              </div>

              <Link
                to="/login"
                className="mt-6 w-full inline-block bg-green-600 hover:bg-green-500 text-white text-sm font-medium py-2.5 rounded-lg transition text-center"
              >
                Continue to login →
              </Link>
            </>
          )}

          {/* ERROR */}
          {status === 'error' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Verification failed</h2>
              <p className="text-sm text-gray-500 mt-2">{message}</p>

              {/* ERROR BADGE */}
              <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-medium px-3 py-1.5 rounded-full mt-4">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Link expired or invalid
              </div>

              <Link
                to="/register"
                className="mt-6 w-full inline-block bg-red-500 hover:bg-red-400 text-white text-sm font-medium py-2.5 rounded-lg transition text-center"
              >
                Register again
              </Link>

              <p className="text-xs text-gray-400 mt-3">
                Already verified?{' '}
                <Link to="/login" className="text-blue-500 hover:underline">Sign in here</Link>
              </p>
            </>
          )}

        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Having trouble?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">Create a new account</Link>
        </p>
      </div>
    </div>
  );
}