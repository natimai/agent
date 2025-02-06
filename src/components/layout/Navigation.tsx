import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { motion } from 'framer-motion';

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 right-0 left-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="text-xl font-bold">
                ⚽ סוכן כדורגל
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className="border-b-2 border-transparent hover:border-blue-400 inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-blue-400 transition-colors"
              >
                דף הבית
              </Link>
              <Link
                to="/players"
                className="border-b-2 border-transparent hover:border-blue-400 inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-blue-400 transition-colors"
              >
                שחקנים
              </Link>
              <Link
                to="/transfers"
                className="border-b-2 border-transparent hover:border-blue-400 inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-blue-400 transition-colors"
              >
                העברות
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">{user?.username}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              התנתק
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 