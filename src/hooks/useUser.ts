import AuthContext from 'contexts/Auth';
import { useContext } from 'react';

const useUser = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('Forgot to wrap component in AuthContext');
  }

  const { user } = authContext;

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
};

export default useUser;
