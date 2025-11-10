// FIX: Import React to provide the React namespace for types.
import React, { useState, useEffect } from 'react';
import { getDataFromStorage, saveDataToStorage } from '../utils/storage';

export function usePersistentData<T>(
  storageKey: string,
  initialData: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [data, setData] = useState<T>(() =>
    getDataFromStorage(storageKey, initialData)
  );

  useEffect(() => {
    saveDataToStorage(storageKey, data);
  }, [data, storageKey]);

  return [data, setData];
}
