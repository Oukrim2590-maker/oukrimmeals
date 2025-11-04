import React, { useState, useEffect } from 'react';
import { CartItem } from '../context/CartContext';
import { WHATSAPP_LINK } from '../constants';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderConfirmed: () => void;
  cartItems: CartItem[];
  totalPrice: number;
}

const USER_INFO_KEY = 'oukrim_meals_user_info';

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderConfirmed, cartItems, totalPrice }) => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
  });
  const [errors, setErrors] = useState({ name: false, address: false, city: false });
  const [isOrderSent, setIsOrderSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
        try {
            const storedInfo = window.localStorage.getItem(USER_INFO_KEY);
            if (storedInfo) {
                setUserInfo(JSON.parse(storedInfo));
            }
        } catch (error) {
            console.error("Could not parse user info from localStorage", error);
        }
        // Reset the sent state every time the modal opens
        setIsOrderSent(false);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
    if (value.trim()) {
        setErrors(prev => ({...prev, [name]: false}));
    }
  };

  const validateForm = () => {
      const newErrors = {
          name: !userInfo.name.trim(),
          address: !userInfo.address.trim(),
          city: !userInfo.city.trim()
      };
      setErrors(newErrors);
      return !newErrors.name && !newErrors.address && !newErrors.city;
  };

  const handleConfirmOrder = () => {
    if (!validateForm()) {
        return;
    }

    window.localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));

    let message = "مرحبا Oukrim Meals،\n";
    message += "هذه معلوماتي للطلب:\n";
    message += `الاسم: ${userInfo.name}\n`;
    message += `العنوان: ${userInfo.address}\n`;
    message += `المدينة: ${userInfo.city}\n`;
    if (userInfo.phone) {
      message += `الهاتف: ${userInfo.phone}\n`;
    }
    message += "\nوهذا هو طلبي:\n\n";

    cartItems.forEach(item => {
      message += `- ${item.name} (x${item.quantity}) - ${item.price * item.quantity} د.م.\n`;
      if (item.customizations) {
        if (item.customizations.removed.length > 0) {
            message += `  (بدون: ${item.customizations.removed.join('، ')})\n`;
        }
        if (item.customizations.added) {
            message += `  (تعليمات: ${item.customizations.added})\n`;
        }
      }
    });
    message += `\nالإجمالي: ${totalPrice} د.م.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `${WHATSAPP_LINK}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    setIsOrderSent(true);

    // After showing the success message, close the modal and clear the cart
    setTimeout(() => {
      onOrderConfirmed();
    }, 4000); // 4 seconds delay to allow user to read the message
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center p-4">
      <div className="bg-[#FEFCF5] rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        
        {isOrderSent ? (
          <div className="p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
             <svg className="w-20 h-20 text-green-500 mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">تم إرسال طلبك بنجاح!</h2>
            <p className="text-gray-600">سيتم الآن إغلاق هذه النافذة. المرجو إكمال الطلب على واتساب.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-2xl font-bold text-gray-800">معلومات التوصيل</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="إغلاق">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل *</label>
                <input type="text" id="name" name="name" value={userInfo.name} onChange={handleChange} className={`w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.name && <p className="text-red-500 text-xs mt-1">المرجو إدخال الاسم.</p>}
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">العنوان الكامل *</label>
                <textarea id="address" name="address" value={userInfo.address} onChange={handleChange} rows={2} className={`w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}></textarea>
                 {errors.address && <p className="text-red-500 text-xs mt-1">المرجو إدخال العنوان.</p>}
              </div>
               <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">المدينة *</label>
                <input type="text" id="city" name="city" value={userInfo.city} onChange={handleChange} className={`w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`} />
                 {errors.city && <p className="text-red-500 text-xs mt-1">المرجو إدخال المدينة.</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف (اختياري)</label>
                <input type="tel" id="phone" name="phone" value={userInfo.phone} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" />
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex flex-col-reverse sm:flex-row gap-2">
              <button onClick={onClose} className="w-full text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300">
                الرجوع للسلة
              </button>
              <button onClick={handleConfirmOrder} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
                تأكيد الطلب عبر واتساب
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;