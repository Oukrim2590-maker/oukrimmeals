import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

const AdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login } = useAdmin();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (!success) {
      setError('كلمة المرور غير صحيحة.');
      setTimeout(() => setError(''), 3000);
    } else {
      setPassword('');
      setError('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex justify-center items-center p-4" onClick={closeLoginModal}>
      <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-8" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">تسجيل الدخول للمدير</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            دخول
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;
