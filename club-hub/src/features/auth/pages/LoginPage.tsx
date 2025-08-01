import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    navigate('/explore');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold text-center">Log In</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full"
          />
          <Button type="submit" className="w-full">
            Log In
          </Button>
        </form>
        <p className="text-center text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-orange-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
