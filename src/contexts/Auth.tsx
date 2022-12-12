import useRefresh from 'hooks/useRefresh';
import type { DispatchWithoutAction } from 'react';
import { createContext, useEffect, useState } from 'react';
import Auth from 'services/auth';
import Users from 'services/users';
import type { FCC } from 'types/react';
import type { User } from 'types/user';
import LocalStorage from 'utils/LocalStorage';

type Login = typeof Auth.login;
type Register = typeof Auth.register;
type ConfirmAccount = typeof Auth.confirmAccount;
type SendMailOtp = typeof Auth.sendMailOtp;
type ChangePasswordAuth = typeof Auth.changePasswordAuth;
type SendOtpAgain = typeof Auth.sendOtpAgain;
type CheckEmailPhoneExist = typeof Auth.checkEmailPhoneExist;

interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

export interface AuthContextValue extends State {
  login: Login;
  register: Register;
  confirmAccount: ConfirmAccount;
  logout: () => void;
  sendMailOtp: SendMailOtp;
  refetch: DispatchWithoutAction;
  sendOtpAgain: SendOtpAgain;
  changePasswordAuth: ChangePasswordAuth;
  checkEmailPhoneExist: CheckEmailPhoneExist;
}

const AuthContext = createContext<AuthContextValue | null>(null);

if (process.env.NODE_ENV === 'development') {
  AuthContext.displayName = 'AuthContext';
}

const AuthProvider: FCC = (props) => {
  const { children } = props;
  const [state, setState] = useState<State>(initialState);
  const [refresh, refetch] = useRefresh();

  useEffect(() => {
    Users.getUser()
      .then((response) => {
        const { data, success } = response;
        if (success && data && data.status === 1) {
          setState({
            isInitialized: true,
            isAuthenticated: true,
            user: data,
          });
        } else {
          setState({
            isInitialized: true,
            isAuthenticated: false,
            user: null,
          });
        }
      })
      .catch((error) => {
        setState({
          isInitialized: true,
          isAuthenticated: false,
          user: null,
        });
      });
  }, [refresh]);

  // Login
  const login = async (data: Parameters<Login>[0]) => {
    const response = await Auth.login(data);
    if (response.data.accessToken && response.data.success) {
      const { accessToken } = response.data;
      LocalStorage.set('accessToken', accessToken);
      refetch();
    }

    return response;
  };

  // Register
  const register = async (data: Parameters<Register>[0]) => {
    const response = await Auth.register(data);
    return response;
  };

  // Logout
  const logout = async () => {
    LocalStorage.remove('accessToken');
    refetch();
  };

  const confirmAccount = async (data: Parameters<ConfirmAccount>[0]) => {
    const response = await Auth.confirmAccount(data);
    return response;
  };

  const sendMailOtp = async (data: Parameters<SendMailOtp>[0]) => {
    const response = await Auth.sendMailOtp(data);
    return response;
  };

  const sendOtpAgain = async (data: Parameters<SendOtpAgain>[0]) => {
    const response = await Auth.sendOtpAgain(data);
    return response;
  };

  const changePasswordAuth = async (
    data: Parameters<ChangePasswordAuth>[0]
  ) => {
    const response = await Auth.changePasswordAuth(data);
    return response;
  };

  const checkEmailPhoneExist = async (
    data: Parameters<CheckEmailPhoneExist>[0]
  ) => {
    return await Auth.checkEmailPhoneExist(data);
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        sendOtpAgain,
        confirmAccount,
        sendMailOtp,
        logout,
        register,
        refetch,
        changePasswordAuth,
        checkEmailPhoneExist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const AuthConsumer = AuthContext.Consumer;
export { AuthContext as default, AuthProvider, AuthConsumer };
