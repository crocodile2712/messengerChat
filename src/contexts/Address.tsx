import { ADDRESS_DEFAULT } from 'constant/common';
import useRefresh from 'hooks/useRefresh';
import { createContext, useEffect, useState } from 'react';
import type { DispatchWithoutAction } from 'react';
import Users from 'services/users';
import type { FCC } from 'types/react';
import type { Address } from 'types/user';

interface State {
  addressDefault: Address | null;
  listAddress: Address[];
}

const initialState: State = {
  addressDefault: null,
  listAddress: [],
};

export interface AddressContextValue extends State {
  refetch: DispatchWithoutAction;
}

const AddressContext = createContext<AddressContextValue | null>(null);

if (process.env.NODE_ENV === 'development') {
  AddressContext.displayName = 'AddressContext';
}

const AddressProvider: FCC = (props) => {
  const { children } = props;
  const [state, setState] = useState<State>(initialState);
  const [refresh, refetch] = useRefresh();

  useEffect(() => {
    Users.getListAddress()
      .then((response) => {
        if (response.data) {
          const defaultAddress = response.data.find(
            (item: Address) => item.addressDefault === ADDRESS_DEFAULT
          );
          setState({
            addressDefault: defaultAddress,
            listAddress: response.data,
          });
        }
      })
      .catch();
  }, [refresh]);

  return (
    <AddressContext.Provider
      value={{
        ...state,
        refetch,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

const AuthConsumer = AddressContext.Consumer;
export { AddressContext as default, AddressProvider, AuthConsumer };
