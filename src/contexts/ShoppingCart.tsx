import { ON_SALE_PRODUCT } from 'constant/common';
import useAuth from 'hooks/useAuth';
import useRefresh from 'hooks/useRefresh';
import type { Dispatch, DispatchWithoutAction, SetStateAction } from 'react';
import { createContext, useEffect, useState } from 'react';
import product from 'services/product';
import type { CartItem } from 'types/product';
import type { FCC } from 'types/react';

export interface ShoppingCartContextValue {
  priceRate: number;
  shoppingCart: CartItem[];
  refetch: DispatchWithoutAction;
  setShoppingCart: Dispatch<SetStateAction<CartItem[]>>;
  buyItems: CartItem[];
  setBuyItems: Dispatch<SetStateAction<CartItem[]>>;
}

export const ShoppingCartContext =
  createContext<ShoppingCartContextValue | null>(null);

if (process.env.NODE_ENV === 'development') {
  ShoppingCartContext.displayName = 'ShoppingCartContext';
}

const ShoppingCartProvider: FCC = (props) => {
  const [refresh, refetch] = useRefresh();
  const { children } = props;
  const { isAuthenticated } = useAuth();
  const [shoppingCart, setShoppingCart] = useState<CartItem[]>([]);
  const [priceRate, setPriceRate] = useState<number>(0);
  const [buyItems, setBuyItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const onSaleProduct: CartItem[] = [];
    const outStockProduct: CartItem[] = [];

    product.getCartItems().then((response) => {
      response.data?.products?.forEach((item: CartItem) => {
        if (item.status === ON_SALE_PRODUCT) {
          onSaleProduct.push(item);
        } else {
          outStockProduct.push(item);
        }
      });

      setShoppingCart(onSaleProduct.concat(outStockProduct));
    });
  }, [refresh, isAuthenticated]);

  useEffect(() => {
    product.getPriceRate().then((response) => {
      if (response.data) {
        setPriceRate(response.data);
      }
    });
  }, [refresh]);

  return (
    <ShoppingCartContext.Provider
      value={{
        buyItems,
        setBuyItems,
        priceRate,
        setShoppingCart,
        shoppingCart,
        refetch,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};

const ShoppingCartConsumer = ShoppingCartContext.Consumer;
export {
  ShoppingCartContext as default,
  ShoppingCartProvider,
  ShoppingCartConsumer,
};
