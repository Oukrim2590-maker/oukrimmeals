export const getDataFromStorage = <T>(key: string, fallbackData: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    if (item === null) {
      return fallbackData;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Could not parse data from localStorage key "${key}"`, error);
    return fallbackData;
  }
};

export const saveDataToStorage = <T>(key: string, data: T) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Could not save data to localStorage key "${key}"`, error);
    alert("حدث خطأ أثناء حفظ البيانات. قد تكون مساحة التخزين ممتلئة. لن يتم حفظ التغييرات الأخيرة بعد تحديث الصفحة.");
  }
};
