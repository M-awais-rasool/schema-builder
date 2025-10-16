export const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || '',
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID || '',
      identityPoolId: import.meta.env.VITE_AWS_IDENTITY_POOL_ID || undefined,
      allowGuestAccess: false,
      signUpVerificationMethod: 'code' as const,
      userAttributes: {
        email: {
          required: true,
        },
        given_name: {
          required: true,
        },
        family_name: {
          required: true,
        },
        preferred_username: {
          required: false,
        },
      },
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_AWS_COGNITO_DOMAIN || '',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: [import.meta.env.VITE_APP_URL || 'http://localhost:5173/'],
          redirectSignOut: [import.meta.env.VITE_APP_URL || 'http://localhost:5173/'],
          responseType: 'code' as const,
        },
      },
    },
  },
};

const ENV_VARS = {
  VITE_AWS_REGION: import.meta.env.VITE_AWS_REGION,
  VITE_AWS_USER_POOL_ID: import.meta.env.VITE_AWS_USER_POOL_ID,
  VITE_AWS_USER_POOL_CLIENT_ID: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID
};

export const validateAwsConfig = () => {
  const requiredEnvVars = [
    'VITE_AWS_REGION',
    'VITE_AWS_USER_POOL_ID', 
    'VITE_AWS_USER_POOL_CLIENT_ID'
  ];

  const missingVars = requiredEnvVars.filter(envVar => !ENV_VARS[envVar as keyof typeof ENV_VARS]);
  
  if (missingVars.length > 0) {
    console.warn('Missing AWS configuration environment variables:', missingVars);
    console.warn('Please create a .env file with the following variables:');
    missingVars.forEach(envVar => console.warn(`${envVar}=your_value_here`));
  }

  return missingVars.length === 0;
};