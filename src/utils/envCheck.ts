export function checkEnvironment() {
  const requiredEnvVars = ['VITE_REACT_APP_BASE_URL'];
  
  for (const envVar of requiredEnvVars) {
    if (!import.meta.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
} 