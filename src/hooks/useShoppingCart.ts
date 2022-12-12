import type { ShoppingCartContextValue } from "contexts/ShoppingCart";
import ShoppingCartContext from "contexts/ShoppingCart";
import { useContext } from 'react';

const useShoppingCart = (): ShoppingCartContextValue => {
  const shoppingCartContext = useContext(ShoppingCartContext);

  if(!shoppingCartContext){
    throw new Error('Forgot to wrap component in ShoppingCartContext')
  }

  return shoppingCartContext;
}

export default useShoppingCart;