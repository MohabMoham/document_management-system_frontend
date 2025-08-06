import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

const AuthWrapper: React.FC = () => {
  const navigate = useNavigate();

  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    nationalId: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'user'
  });

  useEffect(() => {
    const fetchCsrf = async () => {
      try {
        const res = await axiosInstance.get('/csrf-token');
        setCsrfToken(res.data.csrfToken);
      } catch (err) {
        console.error('Failed to fetch CSRF token:', err);
      }
    };
    fetchCsrf();
  }, []);

  const switchScreen = (screen: 'login' | 'register') => {
    setCurrentScreen(screen);
    setError('');
    setSuccess('');
    setLoading(false);
    if (screen === 'login') {
      setLoginData({ email: '', password: '' });
    } else {
      setRegisterData({
        email: '',
        password: '',
        nationalId: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'user',
      });
    }
  };

  const handleLoginSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await axiosInstance.post(
        '/login',
        loginData,
        {
          headers: {
            'X-CSRF-Token': csrfToken,
          }
        }
      );
      setSuccess('Login successful!');
      navigate('/home');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await axiosInstance.post(
        '/register',
        {
          email: registerData.email,
          password: registerData.password,
          national_id: registerData.nationalId,
          first_name: registerData.firstName,
          last_name: registerData.lastName,
          phone: registerData.phone,
          role: registerData.role || 'user',
        },
        {
          headers: {
            'X-CSRF-Token': csrfToken,
          }
        }
      );
      setSuccess('Registration successful! Welcome aboard!');
      navigate('/home');
    } catch (err: any) {
      const msg = err.response?.data?.message || '';
      if (msg.includes('email')) {
        setError('Email already exists. Please use a different email.');
      } else if (msg.includes('nationalId')) {
        setError('National ID already exists. Please check your details.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {currentScreen === 'login' ? (
        <LoginScreen
          loginData={loginData}
          setLoginData={setLoginData}
          rememberPassword={rememberPassword}
          setRememberPassword={setRememberPassword}
          error={error}
          success={success}
          loading={loading}
          handleLoginSubmit={handleLoginSubmit}
          switchScreen={switchScreen}
        />
      ) : (
        <RegisterScreen
          registerData={registerData}
          setRegisterData={setRegisterData}
          error={error}
          success={success}
          loading={loading}
          handleRegisterSubmit={handleRegisterSubmit}
          switchScreen={switchScreen}
        />
      )}
    </>
  );
};

export default AuthWrapper;