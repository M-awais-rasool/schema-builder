import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowLeft, RefreshCw, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../auth/button';
import { Input } from '../auth/input';
import { Label } from '../auth/label';

interface EmailVerificationProps {
  email?: string;
  onVerificationSuccess?: () => void;
}

export function EmailVerification({ email: propEmail, onVerificationSuccess }: EmailVerificationProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  const { confirmSignUp, resendConfirmationCode, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = propEmail || user?.email || searchParams.get('email') || '';

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !verificationCode.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await confirmSignUp({
        username: email,
        confirmationCode: verificationCode.trim(),
      });

      setIsVerified(true);

      if (onVerificationSuccess) {
        onVerificationSuccess();
      } else {
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Email verified successfully! Please log in.',
              type: 'success'
            }
          });
        }, 2000);
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.message || 'Verification failed. Please check your code and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (isResending || countdown > 0 || !email) return;

    setIsResending(true);
    setError(null);

    try {
      await resendConfirmationCode(email);
      setCountdown(60); 
    } catch (err: any) {
      console.error('Resend error:', err);
      setError(err.message || 'Failed to resend verification code.');
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (isVerified) {
    return (
      <motion.div
        className="w-full max-w-md mx-auto text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 shadow-xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Check className="h-8 w-8 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Email Verified!
          </h2>
          
          <p className="text-green-600 mb-4">
            Your email has been successfully verified. You can now log in to your account.
          </p>
          
          <p className="text-sm text-green-500">
            Redirecting to login page...
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="p-3 bg-primary/10 rounded-full">
            <Mail className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Verify Your Email
        </h1>
        
        <p className="text-muted-foreground">
          We've sent a verification code to
        </p>
        <p className="text-primary font-medium">
          {email}
        </p>
      </motion.div>

      <motion.div
        className="relative bg-card border border-border rounded-2xl p-8 shadow-xl backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent rounded-2xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-6 relative" noValidate>
          {error && (
            <motion.div
              className="bg-red-50 border border-red-200 rounded-lg p-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          <div className="space-y-2">
            <Label htmlFor="verificationCode">Verification Code</Label>
            <Input
              id="verificationCode"
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setVerificationCode(value);
                setError(null);
              }}
              className="text-center text-2xl tracking-widest font-mono"
              maxLength={6}
              autoComplete="one-time-code"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || verificationCode.length !== 6}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Verifying...
              </div>
            ) : (
              'Verify Email'
            )}
          </Button>

          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?
            </p>
            
            <Button
              type="button"
              variant="ghost"
              onClick={handleResendCode}
              disabled={isResending || countdown > 0}
              className="text-primary hover:text-primary/80"
            >
              {isResending ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Sending...
                </div>
              ) : countdown > 0 ? (
                `Resend in ${countdown}s`
              ) : (
                'Resend Code'
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBackToLogin}
            className="w-full text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
        </div>
      </motion.div>

      <motion.div
        className="mt-6 text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p>
          Check your spam folder if you don't see the email in your inbox.
        </p>
      </motion.div>
    </motion.div>
  );
}