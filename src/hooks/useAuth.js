import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import { apiFetch } from '../lib/apiClient';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (email, password, setError, setLoading) => {
    setError?.('');
    setLoading?.(true);

    try {
      const data = await apiFetch(`${APP_BASE_URL}/api/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const { user, token } = data.data;
      if (user && user.user_type === 'agent' && !user.email_verified_at) {
        toast.info('Please verify your email to continue.');
        navigate(`/verify-email?email=${encodeURIComponent(user.email)}`);
        return;
      }
      dispatch(loginSuccess({ user, token }));
      navigate('/home');
      toast.success('Login Success!');
    } catch (err) {
      let msg = 'Invalid email or password';
      if (err.message && err.message !== 'SESSION_EXPIRED') {
        msg = err.message;
      }
      setError?.(msg);
      toast.error(msg);
    } finally {
      setLoading?.(false);
    }
  };

  // NOTE: setError is now optional and unused; we rely solely on toasts per your requirement.
  const signup = async (userData, setLoading) => {
    setLoading?.(true);
    
    try {
      const data = await apiFetch(`${APP_BASE_URL}/api/signup/add`, {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      const message = data?.message || 'Account created successfully';
      toast.success(message);
      navigate('/login');
    } catch (err) {
      const message = err.message || 'Failed to create account';
      toast.error(message);
    } finally {
      setLoading?.(false);
    }
  };

  const agentSignup = async (agentData, setLoading) => {
    setLoading?.(true);
    
    try {
      const data = await apiFetch(`${APP_BASE_URL}/api/agent-signup`, {
        method: 'POST',
        body: JSON.stringify(agentData),
      });
      const message = data?.message || 'Agent account created successfully. Please verify your email.';
      toast.success(message);
      navigate(`/verify-email?email=${encodeURIComponent(agentData.email)}`);
    } catch (err) {
      const message = (err && err.errors && Object.values(err.errors).flat().join(' ')) || err.message || 'Failed to create agent account';
      toast.error(message);
      throw err;
    } finally {
      setLoading?.(false);
    }
  };

  return { login, signup, agentSignup };
};
