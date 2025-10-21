import { Database, ArrowRight, AlertCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Label } from "./label";
import { Input } from "./input";
import { Button } from "./button";
import { GoogleOAuthButton } from "./GoogleOAuthButton";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  
  const { login, signUp, confirmSignUp, resendConfirmationCode, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) {
      return; 
    }
    setIsLoading(true);
    setError(null);
    
    try {
      if (isSignUpMode) {
        if (password !== confirmPassword) {
          setError('Passwords do not match!');
          return;
        }

        if (password.length < 8) {
          setError('Password must be at least 8 characters long');
          return;
        }

        if (!firstName.trim() || !lastName.trim() || !username.trim()) {
          setError('All fields are required for sign-up');
          return;
        }
        await signUp({
          email,
          password,
          firstName,
          lastName,
          username,
        });
        setShowVerification(true);
      } else {
        try {
          await login({ email, password });
          navigate('/dashboard');
        } catch (loginError: any) {
          if (loginError.message?.includes('verify your email') || 
              loginError.message?.includes('CONFIRM_SIGN_UP') ||
              loginError.name === 'UserNotConfirmedException') {
            setShowVerification(true);
            if (!username && email) {
              setUsername(email);
            }
            setError('Please verify your email address. Check your inbox for the verification code.');
          } else {
            throw loginError;
          }
        }
      }
    } catch (err: any) {
      console.error(isSignUpMode ? 'Sign-up error:' : 'Login error:', err);
      setError(err.message || `${isSignUpMode ? 'Sign-up' : 'Login'} failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const identifier = username || email;
      await confirmSignUp({
        username: identifier,
        confirmationCode: verificationCode,
      });
      setShowVerification(false);
      setIsSignUpMode(false);
      setVerificationCode('');
      alert('Account verified successfully! Please log in.');
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const identifier = username || email;
      await resendConfirmationCode(identifier);
      alert('Verification code sent! Please check your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    setError(null);

    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setUsername("");
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <motion.div
            className="relative"
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              type: "spring",
              stiffness: 200
            }}
          >
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl" />
            <div className="relative bg-gradient-to-br from-primary to-primary/80 rounded-xl p-3 shadow-lg">
              <Database className="h-9 w-9 text-primary-foreground" />
            </div>
          </motion.div>
        </div>
        <motion.h1
          className="mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {showVerification ? 'Verify Your Email' : isSignUpMode ? 'Create Account' : 'Welcome Back'}
        </motion.h1>
        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {showVerification 
            ? 'Enter the verification code sent to your email'
            : isSignUpMode 
            ? 'Create your account to start designing database schemas'
            : 'Design your database schemas with ease'
          }
        </motion.p>
      </motion.div>

      <motion.div
        className="relative bg-card border border-border rounded-2xl p-8 shadow-xl backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent rounded-2xl pointer-events-none" />

        <motion.div
          className="absolute -inset-[1px] bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 rounded-2xl -z-10"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <form onSubmit={showVerification ? handleVerification : handleSubmit} className="space-y-5 relative" noValidate>
          {error && (
            <motion.div
              className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          {showVerification ? (
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Label htmlFor="verificationCode">Verification Code</Label>
              <div className="relative">
                <Input
                  id="verificationCode"
                  type="text"
                  placeholder="Enter verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-input-background transition-all duration-200 focus:scale-[1.01] h-11 disabled:opacity-50"
                />
              </div>
            </motion.div>
          ) : (
            <>
              {isSignUpMode && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required={isSignUpMode}
                        disabled={isLoading}
                        className="bg-input-background transition-all duration-200 focus:scale-[1.01] h-11 disabled:opacity-50"
                      />
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                    >
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required={isSignUpMode}
                        disabled={isLoading}
                        className="bg-input-background transition-all duration-200 focus:scale-[1.01] h-11 disabled:opacity-50"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="johndoe"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required={isSignUpMode}
                      disabled={isLoading}
                      className="bg-input-background transition-all duration-200 focus:scale-[1.01] h-11 disabled:opacity-50"
                    />
                  </motion.div>
                </>
              )}

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: isSignUpMode ? 0.6 : 0.4 }}
              >
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-input-background transition-all duration-200 focus:scale-[1.01] h-11 disabled:opacity-50"
                  />
                  {email && (
                    <motion.div
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  )}
                </div>
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: isSignUpMode ? 0.7 : 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {!isSignUpMode && (
                    <a
                      href="#"
                      className="text-primary hover:underline transition-all duration-200 hover:translate-x-0.5"
                    >
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder={isSignUpMode ? "Create a password (min 8 characters)" : "••••••••"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-input-background transition-all duration-200 focus:scale-[1.01] h-11 disabled:opacity-50"
                  />
                  {password && (
                    <motion.div
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  )}
                </div>
              </motion.div>

              {isSignUpMode && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                >
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required={isSignUpMode}
                      disabled={isLoading}
                      className="bg-input-background transition-all duration-200 focus:scale-[1.01] h-11 disabled:opacity-50"
                    />
                    {confirmPassword && (
                      <motion.div
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              disabled={isLoading || !email || !password || (isSignUpMode && (!firstName || !lastName || !username || !confirmPassword)) || (showVerification && !verificationCode)}
              className="w-full h-11 group relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                console.log(showVerification ? 'Verify button clicked' : isSignUpMode ? 'Sign up button clicked' : 'Sign in button clicked');
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {showVerification ? 'Verifying...' : isSignUpMode ? 'Creating account...' : 'Signing in...'}
                  </>
                ) : (
                  <>
                    {showVerification ? 'Verify Email' : isSignUpMode ? 'Create Account' : 'Sign in'}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </Button>
          </motion.div>
        </form>

        {!showVerification && (
          <motion.div
            className="mt-6 text-center relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-4 text-muted-foreground">or continue with</span>
              </div>
            </div>

            <div className="mb-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.85 }}
              >
                <GoogleOAuthButton
                  onClick={handleGoogleSignIn}
                  isLoading={isLoading}
                  disabled={isLoading}
                />
              </motion.div>
            </div>

            <p className="text-muted-foreground">
              {isSignUpMode ? 'Already have an account?' : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-primary hover:underline transition-all duration-200 hover:translate-x-0.5 inline-block"
              >
                {isSignUpMode ? 'Sign in here' : 'Sign up for free'}
              </button>
            </p>
          </motion.div>
        )}

        {showVerification && (
          <motion.div
            className="mt-6 text-center space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{' '}
              <button
                type="button"
                className="text-primary hover:underline transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleResendCode}
                disabled={isLoading}
              >
                Resend
              </button>
            </p>
            <p className="text-sm text-muted-foreground">
              <button
                type="button"
                className="text-primary hover:underline transition-all duration-200"
                onClick={() => {
                  setShowVerification(false);
                  setVerificationCode('');
                  setError(null);
                }}
              >
                ← Back to Login
              </button>
            </p>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="mt-8 text-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <p className="text-muted-foreground">
          By signing in, you agree to our{" "}
          <a href="#" className="text-primary hover:underline transition-all duration-200">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:underline transition-all duration-200">
            Privacy Policy
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}
