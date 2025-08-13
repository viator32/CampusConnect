import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !value.endsWith('@study.thws.de')) {
      setEmailError('Email must end with @study.thws.de');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError) return;
    try {
      await register(name, email, password, studentId);
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold text-center">Register</h1>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full"
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
            className="w-full"
          />
          {emailError && (
            <p className="text-red-500 text-sm">{emailError}</p>
          )}
          <Input
            placeholder="Student ID"
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
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
            Register
          </Button>
        </form>
        <p className="text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
