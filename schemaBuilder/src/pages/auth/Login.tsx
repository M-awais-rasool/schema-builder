import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { DatabaseGrid } from '../../components/auth/DatabaseGrid';
import { LoginForm } from '../../components/auth/LoginForm';

export default function Login() {
  const [searchParams] = useSearchParams();
  const [oauthError, setOauthError] = useState<string | null>(null);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'oauth_failed') {
      setOauthError('OAuth sign-in was cancelled or failed. Please try again.');
      const timer = setTimeout(() => {
        setOauthError(null);
        window.history.replaceState({}, '', '/login');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="size-full min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        <DatabaseGrid />
        <div className="relative z-10 w-full px-4 py-8 flex items-center justify-center">
          <div className="w-full max-w-md mx-auto">
            {oauthError && (
              <motion.div
                className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{oauthError}</p>
              </motion.div>
            )}
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}