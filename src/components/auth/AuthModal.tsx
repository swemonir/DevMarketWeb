import React, { useState } from 'react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, User, AlertCircle, Chrome } from 'lucide-react';
import toast from 'react-hot-toast';
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}
export function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login'
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const {
    login,
    signup,
    loginWithGoogle,
    loading
  } = useAuth();
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Email is required';else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (mode === 'signup') {
      if (!name) newErrors.name = 'Name is required';
      if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (mode === 'login') {
        await login(email, password);
        toast.success('Welcome back!');
      } else {
        await signup(name, email, password);
        toast.success('Account created successfully!');
      }
      onClose();
    } catch (error) {
      toast.error('Authentication failed. Please try again.');
    }
  };
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success('Welcome back!');
      onClose();
    } catch (error) {
      toast.error('Google login failed.');
    }
  };
  return <Modal isOpen={isOpen} onClose={onClose} title={mode === 'login' ? 'Welcome Back' : 'Create Account'}>
      <div className="space-y-6">
        <Button variant="outline" fullWidth onClick={handleGoogleLogin} className="relative">
          <Chrome className="w-5 h-5 mr-2" />
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#151b2d] px-2 text-gray-500">
              Or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && <Input label="Full Name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} error={errors.name} icon={<User className="w-4 h-4" />} />}

          <Input label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} icon={<Mail className="w-4 h-4" />} />

          <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} error={errors.password} icon={<Lock className="w-4 h-4" />} />

          {mode === 'signup' && <Input label="Confirm Password" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} error={errors.confirmPassword} icon={<Lock className="w-4 h-4" />} />}

          <div className="pt-2">
            <Button type="submit" fullWidth isLoading={loading}>
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </div>
        </form>

        <div className="text-center text-sm">
          {mode === 'login' ? <p className="text-gray-400">
              Don't have an account?{' '}
              <button onClick={() => setMode('signup')} className="text-blue-400 hover:text-blue-300 font-medium">
                Sign up
              </button>
            </p> : <p className="text-gray-400">
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-blue-400 hover:text-blue-300 font-medium">
                Sign in
              </button>
            </p>}
        </div>
      </div>
    </Modal>;
}