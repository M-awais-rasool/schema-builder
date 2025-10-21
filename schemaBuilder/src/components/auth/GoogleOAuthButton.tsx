import { motion } from 'framer-motion';
import type { FC } from 'react';

interface GoogleOAuthButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const GoogleOAuthButton: FC<GoogleOAuthButtonProps> = ({
  onClick,
  isLoading = false,
  disabled = false,
  className = '',
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative w-full flex items-center justify-center gap-3 px-6 py-3
        bg-white border border-gray-300 rounded-lg text-gray-700 font-medium
        transition-all duration-200 ease-in-out
        hover:border-gray-400 hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      transition={{ duration: 0.15 }}
    >
      <div className="flex-shrink-0 w-5 h-5">
        {isLoading ? (
          <motion.div
            className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
      </div>

      <span className="text-sm font-medium">
        {isLoading ? 'Signing in...' : 'Continue with Google'}
      </span>

      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] to-transparent rounded-lg opacity-0 pointer-events-none"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
};

export default GoogleOAuthButton;