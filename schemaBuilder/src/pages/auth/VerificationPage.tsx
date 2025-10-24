import { useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { DatabaseGrid } from '../../components/auth/DatabaseGrid';
import { EmailVerification } from '../../components/auth/EmailVerification';

export default function VerificationPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'info' | 'error'>('info');

  useEffect(() => {
    const state = location.state as any;
    if (state?.message) {
      setMessage(state.message);
      setMessageType(state.type || 'info');
      
      const timer = setTimeout(() => {
        setMessage(null);
        window.history.replaceState({}, '', '/verify');
      }, 5000);

      return () => clearTimeout(timer);
    }

    const reason = searchParams.get('reason');
    if (reason === 'unverified') {
      setMessage('Please verify your email address to continue.');
      setMessageType('info');
    } else if (reason === 'login_failed') {
      setMessage('Email verification required. Please enter the verification code sent to your email.');
      setMessageType('error');
    }
  }, [searchParams, location.state]);

  const email = searchParams.get('email') || '';

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="size-full min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        <DatabaseGrid />
        <div className="relative z-10 w-full px-4 py-8 flex items-center justify-center">
          <div className="w-full max-w-md mx-auto">
            {message && (
              <motion.div
                className={`mb-6 border rounded-lg p-4 flex items-start gap-3 ${
                  messageType === 'error'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AlertCircle 
                  className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                    messageType === 'error' ? 'text-red-500' : 'text-blue-500'
                  }`} 
                />
                <p className={`text-sm ${
                  messageType === 'error' ? 'text-red-700' : 'text-blue-700'
                }`}>
                  {message}
                </p>
              </motion.div>
            )}
            <EmailVerification email={email} />
          </div>
        </div>
      </div>
    </div>
  );
}