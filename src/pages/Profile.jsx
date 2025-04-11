import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
  const { userInfo, signOut, supabase, loading } = useAuthStore();
  const [questionCount, setQuestionCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [loadingStats, setLoadingStats] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [joinDate, setJoinDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      setDisplayName(userInfo.full_name);
      fetchUserStats();
      fetchUserMetadata();
    }
  }, [userInfo]);

  const fetchUserStats = async () => {
    if (!userInfo) return;
    
    try {
      setLoadingStats(true);
      
      // Fetch question count from questions table
      const { count, error } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('user', userInfo.id);
        
      if (error) throw error;
      setQuestionCount(count || 0);
      
    } catch (error) {
      console.error('Error fetching user stats:', error.message);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchUserMetadata = async () => {
    if (!userInfo) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('id', userInfo.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setJoinDate(new Date(data.created_at));
      } else {
        // Fallback to session creation time if profile data not available
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user?.created_at) {
          setJoinDate(new Date(userData.user.created_at));
        }
      }
    } catch (error) {
      console.error('Error fetching user metadata:', error.message);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: displayName }
      });
      
      if (error) throw error;
      
      // Update local state with new info
      useAuthStore.setState({ 
        userInfo: { ...userInfo, full_name: displayName }
      });
      
      setIsEditing(false);
      setUpdateSuccess(true);
      
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error updating profile:', error.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.')) {
      try {
        // In a real application, this would involve additional API calls
        // to properly delete user data and the account itself
        
        // For now, just sign out
        await signOut();
        navigate('/');
      } catch (error) {
        console.error('Error deleting account:', error.message);
      }
    }
  };

  if (loading || !userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header with background */}
          <div className="bg-gradient-to-r from-indigo-700 to-blue-600 px-6 py-8">
            <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex-shrink-0">
                <img 
                  src={userInfo.avatar_url || 'https://via.placeholder.com/100'} 
                  alt={userInfo.full_name}
                  className="h-24 w-24 rounded-full border-4 border-white shadow-md"
                />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-white">{userInfo.full_name}</h1>
                <p className="text-indigo-100">{userInfo.email}</p>
                {joinDate && (
                  <p className="text-indigo-200 text-sm mt-1">
                    Thành viên từ {joinDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="px-6 py-8">
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-indigo-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="bg-indigo-100 rounded-full p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-700">Câu hỏi đã gửi</h3>
                    <p className="text-2xl font-semibold text-indigo-700">{loadingStats ? '...' : questionCount}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 rounded-full p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-700">Phiên truy cập gần nhất</h3>
                    <p className="text-md font-semibold text-blue-700">
                      {new Date().toLocaleDateString('vi-VN', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Profile settings */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin cá nhân</h2>
              
              {updateSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Cập nhật thông tin thành công!
                </div>
              )}
              
              <form onSubmit={handleUpdateProfile}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Họ và tên</label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="fullName"
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <div className="mt-1 p-3 w-full bg-white border border-gray-200 rounded-md">
                        {userInfo.full_name}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1 p-3 w-full bg-white border border-gray-200 rounded-md text-gray-500">
                      {userInfo.email}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="provider" className="block text-sm font-medium text-gray-700">Phương thức đăng nhập</label>
                    <div className="mt-1 p-3 w-full bg-white border border-gray-200 rounded-md flex items-center">
                      {userInfo.email.includes('gmail') ? (
                        <>
                          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                              <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                              <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                            </g>
                          </svg>
                          <span>Google</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                          </svg>
                          <span>GitHub</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  {isEditing ? (
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
                      >
                        Lưu thay đổi
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setDisplayName(userInfo.full_name);
                        }}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="bg-white border border-indigo-600 text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50 transition duration-300"
                    >
                      Chỉnh sửa thông tin
                    </button>
                  )}
                </div>
              </form>
            </div>
            
            {/* Account actions */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tài khoản</h2>
              
              <div className="space-y-4">
                <button
                  onClick={signOut}
                  className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-4-4H3zm9 4a1 1 0 01-1 1H5a1 1 0 110-2h6a1 1 0 011 1zm-6 5a1 1 0 100 2h6a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Đăng xuất
                </button>
                
                <button
                  onClick={handleDeleteAccount}
                  className="w-full sm:w-auto bg-white border border-red-500 text-red-500 px-6 py-3 rounded-lg hover:bg-red-50 transition duration-300 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Xóa tài khoản
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;