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
    
    // Create an instance with the user's input to test it
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
    <div className="login-container">
      <h1>Admin Access</h1>
      <input 
        type="password" 
        value={keyInput}
        onChange={(e) => setKeyInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        disabled={isVerifying}
      />
      <button onClick={handleLogin} disabled={isVerifying}>
        {isVerifying ? 'Verifying...' : 'Login'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};