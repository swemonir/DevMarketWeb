import React, { useState } from 'react';

import { Mail, Lock, User, Chrome } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
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
  const [mode, setMode] = useState<'login' | 'signup' | 'verification_sent'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    login,
    signup,
    loginWithGoogle,
    loading
  } = useAuth();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Email is required'; else if (!/\S+@\S+\.\S/.test(email)) newErrors.email = 'Email is invalid';

    // Password validation only for login/signup forms, not used in recovery/verification view strictly but kept for safety
    if (mode !== 'verification_sent') {
      if (!password) newErrors.password = 'Password is required'; else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    }

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
        onClose();
      } else if (mode === 'signup') {
        const response = await signup(name, email, password, role);
        if (response?.accessToken) {
          toast.success('Account created successfully!');
          onClose();
        } else {
          setMode('verification_sent');
          toast.success('Please verify your email to continue.');
        }
      }
    } catch (error: any) {
      const message = error?.message || 'Authentication failed.';
      if (message.toLowerCase().includes('verify') || message.toLowerCase().includes('verification')) {
        toast.error(message, { duration: 5000 });
      } else {
        toast.error(message);
      }
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

  if (mode === 'verification_sent') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Check your inbox">
        <div className="text-center py-6 space-y-6">
          <div className="flex justify-center">
            <div className="bg-blue-500/10 p-4 rounded-full ring-4 ring-blue-500/20">
              <Mail className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Verification Link Sent</h3>
            <p className="text-gray-400 max-w-xs mx-auto">
              We've sent a verification link to <span className="font-medium text-white">{email}</span>
            </p>
          </div>

          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 text-sm text-gray-300">
            <p>Please check your email and click the link to activate your account. You won't be able to login until you verify.</p>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              fullWidth
              onClick={() => {
                setMode('login');
                setPassword('');
              }}
            >
              Back to Sign In
            </Button>

            <button
              type="button"
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Welcome Back' : 'Create Account'}
    >
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
          {mode === 'signup' && (
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
              error={errors.name}
              icon={<User className="w-4 h-4" />}
            />
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            error={errors.email}
            icon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            error={errors.password}
            icon={<Lock className="w-4 h-4" />}
          />
          {mode === 'signup' && (
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e: any) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              icon={<Lock className="w-4 h-4" />}
            />
          )}
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`flex items-center justify-center px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${role === 'buyer'
                    ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                    : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                >
                  Buyer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`flex items-center justify-center px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${role === 'seller'
                    ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                    : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                >
                  Seller
                </button>
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button type="submit" fullWidth isLoading={loading}>
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </div>
        </form>

        <div className="text-center text-sm">
          {mode === 'login' ? (
            <p className="text-gray-400">
              Don't have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-gray-400">
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}