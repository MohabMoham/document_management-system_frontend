import React from 'react';
import { AlertCircle } from 'lucide-react';
import InputField from '../../components/InputField/InputField';

interface LoginScreenProps {
  loginData: { email: string; password: string };
  setLoginData: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>;
  rememberPassword: boolean;
  setRememberPassword: React.Dispatch<React.SetStateAction<boolean>>;
  error: string;
  success: string;
  loading: boolean;
  handleLoginSubmit: () => void;
  switchScreen: (screen: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  loginData,
  setLoginData,
  rememberPassword,
  setRememberPassword,
  error,
  success,
  loading,
  handleLoginSubmit,
  switchScreen,
}) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="max-w-sm w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Log in</h1>
        <p className="text-gray-600">Welcome back! Please enter your details.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <InputField
            type="email"
            name="email"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <InputField
            type="password"
            name="password"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberPassword}
              onChange={(e) => setRememberPassword(e.target.checked)}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-600">Remember password</span>
          </label>
          <button type="button" className="text-sm text-blue-600 hover:text-blue-500">
            Forgot my password
          </button>
        </div>
        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-md">
            <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
              <div className="h-2 w-2 bg-white rounded-full"></div>
            </div>
            <span className="text-sm">{success}</span>
          </div>
        )}
        <button
          type="button"
          onClick={handleLoginSubmit}
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-md font-medium focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => switchScreen('register')}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default LoginScreen;