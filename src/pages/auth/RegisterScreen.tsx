import React from 'react';
import { AlertCircle } from 'lucide-react';
import InputField from '../../components/InputField/InputField';

interface RegisterScreenProps {
  registerData: {
    email: string;
    password: string;
    nationalId: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  setRegisterData: React.Dispatch<React.SetStateAction<RegisterScreenProps['registerData']>>;
  error: string;
  success: string;
  loading: boolean;
  handleRegisterSubmit: () => void;
  switchScreen: (screen: string) => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({
  registerData,
  setRegisterData,
  error,
  success,
  loading,
  handleRegisterSubmit,
  switchScreen,
}) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="max-w-sm w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Sign up</h1>
        <p className="text-gray-600">Create your account to get started.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <InputField
            type="text"
            name="firstName"
           
            value={registerData.firstName}
            onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <InputField
            type="text"
            name="lastName"
    
            value={registerData.lastName}
            onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <InputField
            type="email"
            name="email"
       
            value={registerData.email}
            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <InputField
            type="tel"
            name="phone"
         
            value={registerData.phone}
            onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">National ID</label>
          <InputField
            type="text"
            name="nationalId"
        
            value={registerData.nationalId}
            onChange={(e) => setRegisterData({ ...registerData, nationalId: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <InputField
            type="password"
            name="password"
           
            value={registerData.password}
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
          />
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
          onClick={handleRegisterSubmit}
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-md font-medium focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => switchScreen('login')}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default RegisterScreen;