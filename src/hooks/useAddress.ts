import type { AddressContextValue } from 'contexts/Address';
import AddressContext from 'contexts/Address';
import { useContext } from 'react';

const useAddress = (): AddressContextValue => {
  const addressContext = useContext(AddressContext);

  if (!addressContext) {
    throw new Error('Forgot to wrap component in AuthContext');
  }

  return addressContext;
};

export default useAddress;
