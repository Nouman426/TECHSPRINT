import React, { useState, useEffect } from 'react';
import { UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { Award, Eye, EyeOff, CheckCircle2, ArrowRight, UserCheck, Briefcase } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const { authModalConfig, login, register } = useAuth();
  const [role, setRole] = useState<UserRole>(authModalConfig.role || 'client');
  const [mode, setMode] = useState<'signin' | 'signup'>(authModalConfig.mode || 'signin');
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Client optional fields
  const [phoneNumber, setPhoneNumber] = useState('');
  const [clientType, setClientType] = useState<'Individual' | 'Student' | 'Startup' | 'Small Business' | 'Organization'>('Individual');
  const [organizationName, setOrganizationName] = useState('');

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);

  useEffect(() => {
    setRole(authModalConfig.role || 'client');
    setMode(authModalConfig.mode || 'signin');
    setError(null);
  }, [authModalConfig, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isForgotMode) {
        if (!email) throw new Error("Please enter your email address.");
        setForgotSent(true);
        setLoading(false);
        return;
      }

      if (mode === 'signin') {
        if (!email || !password) throw new Error("Please fill in email and password.");
        await login(email, role);
      } else {
        if (!fullName || !email || !password) throw new Error("Please fill in all required fields.");
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        if (password.length < 6) throw new Error("Password must be at least 6 characters.");
        if (!agreeTerms) throw new Error("You must accept the Terms of Service and Privacy Policy.");

        await register(fullName, email, role, {
          phoneNumber: role === 'client' ? phoneNumber : undefined,
          clientType: role === 'client' ? clientType : undefined,
          organizationName: role === 'client' ? organizationName : undefined,
        });
      }

      onClose();
      if (onAuthSuccess) onAuthSuccess();
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      
      {/* Brand Header */}
      <div className="text-center pb-4 mb-4 border-b border-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-teal-500 text-slate-900 mx-auto flex items-center justify-center shadow-md mb-2">
          <Award className="w-7 h-7 stroke-[2.5]" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
          VETEREN
        </h2>
        <p className="text-xs text-slate-500 font-medium">Experience Never Retires.</p>
      </div>

      {/* Role Switcher Tabs (Professional | Client) */}
      <div className="bg-slate-100 p-1.5 rounded-xl flex gap-1 mb-4">
        <button
          type="button"
          onClick={() => { setRole('client'); setError(null); }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            role === 'client'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4 text-teal-600" />
          <span>I am a Client</span>
        </button>

        <button
          type="button"
          onClick={() => { setRole('professional'); setError(null); }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            role === 'professional'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4 text-teal-600" />
          <span>I am a Professional</span>
        </button>
      </div>

      {/* Mode Switcher (Sign In | Sign Up) */}
      {!isForgotMode && (
        <div className="flex border-b border-slate-200 mb-6">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); }}
            className={`pb-2.5 px-4 font-bold text-sm transition-colors relative ${
              mode === 'signin'
                ? 'text-teal-700 border-b-2 border-teal-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`pb-2.5 px-4 font-bold text-sm transition-colors relative ${
              mode === 'signup'
                ? 'text-teal-700 border-b-2 border-teal-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Sign Up
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Forgot Password Mode */}
      {isForgotMode ? (
        <div className="space-y-4">
          <h4 className="font-bold text-sm text-slate-900">Reset your password</h4>
          <p className="text-xs text-slate-600">Enter your email address to receive password reset instructions.</p>

          {forgotSent ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Password Reset Email Sent
              </div>
              <p>Check your inbox for password recovery steps.</p>
              <button
                type="button"
                onClick={() => setIsForgotMode(false)}
                className="text-xs text-teal-700 font-bold underline pt-2"
              >
                Return to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Send Reset Link
                </button>
                <button
                  type="button"
                  onClick={() => setIsForgotMode(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name for Sign Up */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Password *</label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => setIsForgotMode(true)}
                  className="text-[11px] text-teal-600 hover:text-teal-700 font-medium"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password & Extra Fields for Sign Up */}
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {/* Optional Client Fields */}
              {role === 'client' && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Optional Client Info</p>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Client Category</label>
                    <select
                      value={clientType}
                      onChange={e => setClientType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
                    >
                      <option value="Individual">Individual</option>
                      <option value="Student">Student</option>
                      <option value="Startup">Startup</option>
                      <option value="Small Business">Small Business</option>
                      <option value="Organization">Organization</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Organization Name (if applicable)</label>
                    <input
                      type="text"
                      value={organizationName}
                      onChange={e => setOrganizationName(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="terms" className="text-[11px] text-slate-600 leading-tight">
                  I accept the <span className="font-semibold text-slate-800">Terms of Service</span> and <span className="font-semibold text-slate-800">Privacy Policy</span>.
                </label>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Processing...' : (
              <>
                <span>{mode === 'signin' ? `Sign In as ${role === 'professional' ? 'Professional' : 'Client'}` : `Create ${role === 'professional' ? 'Professional' : 'Client'} Account`}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Shortcut Links as requested in Section 5 */}
      <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
        {role === 'professional' ? (
          <p>
            Looking for an expert?{' '}
            <button
              onClick={() => { setRole('client'); setError(null); }}
              className="text-teal-700 font-bold hover:underline"
            >
              Register as a Client
            </button>
          </p>
        ) : (
          <p>
            Want to share your experience?{' '}
            <button
              onClick={() => { setRole('professional'); setError(null); }}
              className="text-teal-700 font-bold hover:underline"
            >
              Register as a Professional
            </button>
          </p>
        )}
      </div>

    </Modal>
  );
};
