import type { AuthContextValue } from 'contexts/Auth';
import AuthContext from 'contexts/Auth';
import { useContext } from 'react';

const useAuth = (): AuthContextValue => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('Forgot to wrap component in AuthContext');
  }

  return authContext;
};

export default useAuth;
