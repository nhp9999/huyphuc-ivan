import React, { useState } from 'react';
import { Eye, EyeOff, Mail, KeyRound, Shield, CheckCircle, AlertCircle } from 'lucide-react';

const LoginDemo: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[a-z]/.test(pwd)) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = isEmailValid && password.length >= 6;

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Login Demo Features
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Showcase of enhanced login capabilities
        </p>
      </div>

      <div className="space-y-6">
        {/* Email Field with Validation */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`block w-full pl-10 pr-10 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                email && !isEmailValid
                  ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                  : email && isEmailValid
                  ? 'border-green-300 dark:border-green-600 focus:ring-green-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              }`}
              placeholder="Enter your email"
            />
            {email && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {isEmailValid ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Password Field with Strength Indicator */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyRound className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              className={`block w-full pl-10 pr-10 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                password && passwordStrength < 50
                  ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                  : password && passwordStrength >= 50 && passwordStrength < 75
                  ? 'border-yellow-300 dark:border-yellow-600 focus:ring-yellow-500'
                  : password && passwordStrength >= 75
                  ? 'border-green-300 dark:border-green-600 focus:ring-green-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              }`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-2">
              <div className="flex items-center space-x-2 mb-1">
                <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength < 50
                        ? 'bg-red-500'
                        : passwordStrength < 75
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
                <span className={`text-xs font-medium ${
                  passwordStrength < 50
                    ? 'text-red-600 dark:text-red-400'
                    : passwordStrength < 75
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Medium' : 'Strong'}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Password strength: {passwordStrength}%
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          disabled={!isFormValid}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 ${
            isFormValid
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] shadow-lg'
              : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-60'
          }`}
        >
          {isFormValid ? 'Login Ready' : 'Complete Form'}
        </button>

        {/* Security Badge */}
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <Shield className="h-4 w-4" />
          <span>Secure SSL Connection</span>
        </div>

        {/* Feature List */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Enhanced Features:
          </h4>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Real-time email validation</li>
            <li>• Password strength indicator</li>
            <li>• Dynamic form validation</li>
            <li>• Enhanced accessibility</li>
            <li>• Smooth animations</li>
            <li>• Dark mode support</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginDemo;
