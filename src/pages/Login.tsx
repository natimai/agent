import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { showToast } from '../components/common/Toast';
import { setUser } from '../store/slices/authSlice';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // בשלב זה נדמה משתמש לדוגמה
      const mockUser = {
        id: '1',
        email: formData.email,
        username: 'משתמש לדוגמה',
        createdAt: new Date().toISOString(),
        gameSettings: {
          difficulty: 'medium' as const,
          startingBudget: 1000000
        }
      };

      dispatch(setUser(mockUser));
      showToast.success('התחברת בהצלחה!');
      navigate('/dashboard');
    } catch (error) {
      showToast.error('שם משתמש או סיסמה שגויים');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="grid md:grid-cols-2">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="logo-container">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="logo-circle"
              >
                <FiLogIn />
              </motion.div>
              <h1 className="text-2xl font-bold">ברוכים הבאים</h1>
              <p className="text-gray-600">התחבר למשחק סוכן הכדורגל</p>
            </div>

            <div className="form-field">
              <label htmlFor="email">דואר אלקטרוני</label>
              <div className="input-container">
                <FiMail />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <div className="flex items-center justify-between">
                <Link to="/forgot-password" className="auth-link">
                  שכחת סיסמה?
                </Link>
                <label htmlFor="password">סיסמה</label>
              </div>
              <div className="input-container">
                <FiLock />
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? (
                <>
                  <div className="spinner" />
                  <span>מתחבר...</span>
                </>
              ) : (
                <>
                  <FiLogIn />
                  <span>התחבר</span>
                </>
              )}
            </button>

            <div className="divider">
              <span>או התחבר באמצעות</span>
            </div>

            <div className="social-buttons">
              <button type="button" className="social-button">
                <img src="/google.svg" alt="Google" />
              </button>
              <button type="button" className="social-button">
                <img src="/facebook.svg" alt="Facebook" />
              </button>
              <button type="button" className="social-button">
                <img src="/apple.svg" alt="Apple" />
              </button>
            </div>

            <div className="text-center text-sm">
              אין לך חשבון?{" "}
              <Link to="/register" className="auth-link">
                הירשם עכשיו
              </Link>
            </div>
          </form>

          <div className="image-side">
            <img
              src="/login-image.jpg"
              alt="כדורגל"
              className="image"
            />
            <div className="image-overlay"></div>
            <div className="image-content">
              <h2>נהל את הקריירה שלך</h2>
              <p>הפוך לסוכן הכדורגל המוביל בעולם</p>
            </div>
          </div>
        </div>
      </div>

      <div className="terms-text">
        בהתחברות אתה מסכים ל
        <Link to="/terms">תנאי השימוש</Link>
        ול
        <Link to="/privacy">מדיניות הפרטיות</Link>
        שלנו
      </div>
    </div>
  );
};

export default Login; 