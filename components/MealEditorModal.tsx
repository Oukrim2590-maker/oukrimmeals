import React, { useState, useEffect } from 'react';
import { Meal } from '../types';

type MealFormData = Omit<Meal, 'id' | 'rating' | 'reviews'> & { id?: number };

interface MealEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meal: MealFormData) => void;
  meal: Meal | null;
}

const initialFormData: Omit<Meal, 'id' | 'rating' | 'reviews'> = {
  name: '',
  image: '',
  price: 0,
  ingredients: '',
  calories: 0,
  category: 'high-protein',
};

// Internal state will be different for ingredients
type EditorState = Omit<MealFormData, 'ingredients'> & { ingredients: string[] };

const MealEditorModal: React.FC<MealEditorModalProps> = ({ isOpen, onClose, onSave, meal }) => {
  const [formData, setFormData] = useState<EditorState>({ ...initialFormData, ingredients: [''] });

  useEffect(() => {
    if (isOpen) {
      if (meal) {
        const ingredientsArray = meal.ingredients ? meal.ingredients.split('، ').map(s => s.trim()).filter(Boolean) : [];
        setFormData({
          ...meal,
          ingredients: ingredientsArray.length > 0 ? ingredientsArray : [''],
        });
      } else {
        setFormData({ ...initialFormData, ingredients: [''] });
      }
    }
  }, [isOpen, meal]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setFormData(prev => ({
      ...prev,
      [name]: isNumber ? Number(value) : value,
    }));
  };
  
  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, ''] }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({ ...prev, ingredients: prev.ingredients.filter((_, i) => i !== index) }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.image || formData.price <= 0) {
      alert('المرجو ملء جميع الحقول المطلوبة (الاسم، الصورة، السعر).');
      return;
    }
    const dataToSave: MealFormData = {
        ...formData,
        ingredients: formData.ingredients.map(i => i.trim()).filter(Boolean).join('، ')
    };
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center p-4">
      <div className="bg-[#FEFCF5] rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{meal ? 'تعديل الوجبة' : 'إضافة وجبة جديدة'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="إغلاق">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">اسم الوجبة</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" required />
          </div>
          
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">رابط صورة الوجبة</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {formData.image && (
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">معاينة الصورة</label>
              <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center border border-gray-300 overflow-hidden">
                <img src={formData.image} alt="معاينة" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">السعر (د.م.)</label>
            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" required min="0" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المكونات</label>
            <div className="space-y-2">
                {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={ingredient}
                            onChange={(e) => handleIngredientChange(index, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder={`مكون ${index + 1}`}
                        />
                        <button
                            type="button"
                            onClick={() => removeIngredient(index)}
                            className="p-2 text-red-500 hover:bg-red-100 rounded-full flex-shrink-0"
                            aria-label="حذف المكون"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
            <button
                type="button"
                onClick={addIngredient}
                className="mt-2 flex items-center gap-1 text-sm text-green-600 font-semibold hover:text-green-800"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                <span>إضافة مكون آخر</span>
            </button>
          </div>
          
          <div>
            <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">السعرات الحرارية</label>
            <input type="number" id="calories" name="calories" value={formData.calories} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" min="0" />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">الصنف</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500">
              <option value="high-protein">بروتين عالي</option>
              <option value="vegetarian">نباتي</option>
              <option value="low-carb">قليل الكربوهيدرات</option>
            </select>
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

export default MealEditorModal;