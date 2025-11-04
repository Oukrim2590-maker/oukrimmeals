import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';

type ProductFormData = Omit<Product, 'id'> & { id?: number };

interface ProductEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: ProductFormData) => void;
  product: Product | null;
}

const initialFormData: Omit<Product, 'id'> = {
  name: '',
  image: '',
  price: 0,
  description: '',
};

const ProductEditorModal: React.FC<ProductEditorModalProps> = ({ isOpen, onSave, onClose, product }) => {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData(product);
      } else {
        setFormData(initialFormData);
      }
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setFormData(prev => ({
      ...prev,
      [name]: isNumber ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.image || formData.price <= 0) {
      alert('المرجو ملء جميع الحقول المطلوبة (الاسم، الصورة، السعر).');
      return;
    }
    onSave(formData);
  };

  return (
     <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center p-4">
      <div className="bg-[#FEFCF5] rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{product ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="إغلاق">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">صورة المنتج</label>
            <div 
              className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:border-green-500 transition-colors"
              onClick={handleImageClick}
            >
              {formData.image ? (
                <img src={formData.image} alt="معاينة" className="w-full h-full object-cover rounded-md" />
              ) : (
                <span className="text-gray-500">اضغط هنا لاختيار صورة</span>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              className="hidden"
              accept="image/*"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">السعر (د.م.)</label>
            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" required min="0" />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"></textarea>
          </div>
          
          <div className="p-4 border-t bg-gray-50 flex flex-col-reverse sm:flex-row gap-2 -mx-6 -mb-6 mt-6">
            <button type="button" onClick={onClose} className="w-full text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300">
              إلغاء
            </button>
            <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditorModal;