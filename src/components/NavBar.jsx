import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';

const NavBar = () => {
  const { userInfo, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleProfileClick = () => {
    navigate('/my-profile');
    setIsProfileMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-blue-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-white rounded-full p-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">Luật Dân Sự AI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {userInfo ? (
              <div className="flex items-center space-x-4">
                <Link to="/" className="text-white hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium">
                  Trang chủ
                </Link>
                
                {/* Profile dropdown */}
                <div className="relative ml-3">
                  <div>
                    <button 
                      onClick={toggleProfileMenu} 
                      className="flex items-center space-x-3 text-sm focus:outline-none"
                    >
                      <img
                        src={userInfo.avatar_url || 'https://via.placeholder.com/40'}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full border-2 border-white"
                      />
                      <span className="text-white font-medium hidden lg:block">
                        {userInfo.full_name}
                      </span>
                      <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Dropdown menu */}
                  {isProfileMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                      <div className="py-1">
                        <button 
                          onClick={handleProfileClick} 
                          className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Thông tin cá nhân
                        </button>
                      </div>
                      <div className="py-1">
                        <button 
                          onClick={handleSignOut} 
                          className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50 transition duration-300 text-sm font-medium shadow-sm"
              >
                Đăng nhập
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-indigo-100 hover:bg-indigo-800 focus:outline-none"
            >
              <svg 
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg 
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-indigo-800 rounded-b-lg shadow-inner">
          <Link 
            to="/" 
            className="text-white hover:bg-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Trang chủ
          </Link>
          
          {userInfo ? (
            <div className="border-t border-indigo-600 pt-2 mt-2">
              <div className="flex items-center px-3 py-2">
                <img
                  src={userInfo.avatar_url || 'https://via.placeholder.com/40'}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <span className="ml-3 text-white font-medium">{userInfo.full_name}</span>
              </div>
              <button 
                onClick={handleProfileClick} 
                className="text-indigo-100 hover:bg-indigo-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
              >
                Thông tin cá nhân
              </button>
              <button 
                onClick={handleSignOut} 
                className="text-red-300 hover:bg-indigo-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                navigate('/login');
                setIsMenuOpen(false);
              }}
              className="bg-white text-indigo-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;