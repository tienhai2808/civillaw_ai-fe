import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const {
    session,
    loading,
    signInWithGoogle,
    signInWithGitHub,
  } = useAuthStore();

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (session) {
      navigate(from, { replace: true });
    }
  }, [session, navigate, from]);

  const handleSignIn = (providerFn) => {
    const redirectTo = `${window.location.origin}${from}`;
    providerFn(redirectTo);
  };

  if (loading) {
    return <div className='h-[100vh] bg-blue-200 flex items-center justify-center'>Loading...</div>;
  }

  return (
    <div className='h-[100vh] bg-blue-200 flex flex-col items-center justify-center gap-4'>
      <button className='border-black border-2 p-2 bg-white' onClick={() => handleSignIn(signInWithGoogle)}>
        Sign in with Google
      </button>
      <button className='border-black border-2 p-2 bg-white' onClick={() => handleSignIn(signInWithGitHub)}>
        Sign in with GitHub
      </button>
    </div>
  );
};

export default Login;
