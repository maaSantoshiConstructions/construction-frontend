import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, getMe, logoutUser } from '../api/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const { data } = await getMe();
      setUser(data.data);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const { data } = await loginUser(credentials);
    const userObj = data.data;
    const token = userObj.token;
    const refreshToken = userObj.refreshToken;

    localStorage.setItem('token', token);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userObj));
    setUser(userObj);
    return userObj;
  };

  const register = async (formData) => {
    const { data } = await registerUser(formData);
    const userObj = data.data;
    const token = userObj.token;
    const refreshToken = userObj.refreshToken;

    localStorage.setItem('token', token);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userObj));
    setUser(userObj);
    return userObj;
  };

  const logout = async () => {
    try { await logoutUser(); } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const getRedirectPath = (role) => {
    const paths = {
      super_admin: '/admin/dashboard',
      company_admin: '/admin/dashboard',
      sales_executive: '/sales/dashboard',
      channel_partner: '/partner/dashboard',
      customer: '/customer/dashboard'
    };
    return paths[role] || '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loadUser, getRedirectPath }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
