import { useState } from 'react';
import { useAuth } from '../context/AdminAuthContext';
import { AdminApiService } from '@portfolio/shared';

export const Login = () => {
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    setIsVerifying(true);
    setError(null);
    
    const testApi = new AdminApiService(import.meta.env.VITE_API_URL, keyInput);
    const isValid = await testApi.verifyKey();

    if (isValid) {
      login(keyInput); 
    } else {
      setError("Invalid Secret Key");
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Admin Access
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your secret key to manage Supabase resources
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm">
            <input 
              type="password" 
              placeholder="••••••••••••••••"
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              disabled={isVerifying}
            />
          </div>

          <div>
            <button 
              onClick={handleLogin} 
              disabled={isVerifying || !keyInput}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isVerifying ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying...
                </span>
              ) : 'Login'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded mt-4">
              <p className="text-sm text-red-700">⚠️ {error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};