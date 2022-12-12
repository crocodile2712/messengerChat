import type { CategoryContextValue } from 'contexts/Category';
import CategoryContext from 'contexts/Category';
import { useContext } from 'react';

const useCategory = (): CategoryContextValue => {
  const categoryContext = useContext(CategoryContext);

  if (!categoryContext) {
    throw new Error('Forgot to wrap component in CategoryContext');
  }

  return categoryContext;
};

export default useCategory;
