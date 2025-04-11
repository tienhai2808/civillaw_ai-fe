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
    return (
      <div className="h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-8 transform transition-all hover:shadow-2xl">
        <div className="text-center mb-8">
          <div className="bg-indigo-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Đăng nhập</h2>
          <p className="text-gray-600 mt-2">Truy cập hệ thống hỏi đáp pháp luật dân sự</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => handleSignIn(signInWithGoogle)}
            className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 flex items-center justify-center space-x-2 hover:bg-gray-50 transition duration-300 shadow-sm"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
            <span className="text-gray-700 font-medium">Đăng nhập với Google</span>
          </button>
          
          <button 
            onClick={() => handleSignIn(signInWithGitHub)}
            className="w-full bg-gray-800 rounded-lg py-3 px-4 flex items-center justify-center space-x-2 hover:bg-gray-700 transition duration-300 shadow-sm"
          >
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            <span className="text-white font-medium">Đăng nhập với GitHub</span>
          </button>
        </div>

        <div className="mt-8 text-center text-sm">
          <p className="text-gray-500">Bằng việc đăng nhập, bạn đồng ý với điều khoản sử dụng và chính sách bảo mật của chúng tôi.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;