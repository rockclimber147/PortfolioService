import { useState } from 'react';
import { useAuth } from '../context/AdminAuthContext';

export const Login = () => {
  const [keyInput, setKeyInput] = useState('');
  const { login } = useAuth();

  return (
    <div className="login-container">
      <h1>Admin Access</h1>
      <input 
        type="password" 
        placeholder="Enter API Secret" 
        value={keyInput}
        onChange={(e) => setKeyInput(e.target.value)}
      />
      <button onClick={() => login(keyInput)}>Enter Dashboard</button>
    </div>
  );
};