import { createContext, useEffect, useState } from 'react';
import type { CategoryRespond, CategorySearch } from 'types/product';
import type { FCC } from 'types/react';
import Product from 'services/product';

export interface CategoryContextValue {
  categoryList: CategoryRespond;
  rootCategory: CategorySearch[];
  getCategory: () => void;
  getCategoryRoot: () => void;
}

export const CategoryContext = createContext<CategoryContextValue | null>(null);

if (process.env.NODE_ENV === 'development') {
  CategoryContext.displayName = 'CategoryContext';
}

const CategoryProvider: FCC = (props) => {
  const { children } = props;
  const [rootCategory, setRootCategory] = useState<CategorySearch[]>([]);
  const [triggerFetch, setTriggerFetch] = useState<boolean>(false);
  const [triggerFetchRoot, setTriggerFetchRoot] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<CategoryRespond>({
    '0': [],
    '1': [],
    '2': [],
  });

  useEffect(() => {
    if (triggerFetch) {
      Product.getCategory()
        .then((res) => {
          if (res.httpStatusCode === '200' && res.data) {
            setCategoryList(res.data);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [triggerFetch]);

  useEffect(() => {
    if (triggerFetchRoot) {
      Product.getCategoryRoot()
        .then((res) => {
          if (res.httpStatusCode === '200' && res.data) {
            setRootCategory(res.data);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [triggerFetchRoot]);

  const getCategory = () => {
    setTriggerFetch(true);
  };

  const getCategoryRoot = () => {
    setTriggerFetchRoot(true);
  };

  return (
    <CategoryContext.Provider
      value={{
        categoryList,
        rootCategory,
        getCategory,
        getCategoryRoot,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

const CategoryConsumer = CategoryContext.Consumer;
export { CategoryContext as default, CategoryProvider, CategoryConsumer };
