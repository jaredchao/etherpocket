import { useLocalStorageState } from 'ahooks';

/**
 * 本地存储钩子函数，用于持久化保存数据到localStorage
 * 使用ahooks的useLocalStorageState实现
 * @param key localStorage键名
 * @param initialValue 初始值
 * @returns [存储的值, 设置值的函数, 移除值的函数]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const [state, setState] = useLocalStorageState<T>(key, {
    defaultValue: initialValue,
  });

  // 移除值的函数，与原API保持一致
  const removeValue = () => {
    setState(initialValue);
    window.localStorage.removeItem(key);
  };

  return [
    state as T, 
    setState, 
    removeValue
  ];
} 
