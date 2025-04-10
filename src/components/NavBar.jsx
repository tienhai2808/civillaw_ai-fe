import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const { userInfo, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleProfileClick = () => {
    navigate('/my-profile');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shadow-lg sticky">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo hoặc tên ứng dụng */}
        <div className="text-white text-xl font-bold tracking-tight">
          <a href="/">MyApp</a>
        </div>

        {/* Menu cho desktop */}
        <div className="flex items-center space-x-6">
          {userInfo ? (
            <div className="flex items-center space-x-4">
              {/* Ảnh đại diện */}
              <img
                src={userInfo.avatar_url || 'https://via.placeholder.com/40'}
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-white cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleProfileClick}
              />
              {/* Tên người dùng */}
              <span
                className="text-white font-medium cursor-pointer hover:text-gray-200 transition-colors hidden md:block"
                onClick={handleProfileClick}
              >
                {userInfo.full_name}
              </span>
              {/* Nút đăng xuất */}
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm font-semibold"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors text-sm font-semibold"
            >
              Đăng nhập
            </button>
          )}
        </div>

        {/* Menu hamburger cho mobile (nếu cần mở rộng thêm) */}
        {/* Hiện tại chỉ hiển thị đơn giản, có thể thêm toggle menu nếu cần */}
      </div>
    </nav>
  );
};

export default NavBar;