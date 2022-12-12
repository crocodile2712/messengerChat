import {
  API_CHECK_EXIST_EMAIL_PHONE,
  API_FORGOT_CHANGE_PASSWORD_PATH,
  API_FORGOT_PASSWORD_PATH,
  API_LOGIN_PATH,
  API_LOGOUT_PATH,
  API_REGISTER_PATH,
  API_SEND_OTP_AGAIN_PATH,
  API_VERIFY_PATH,
} from 'constant/api-path';
import type {
  ChangePasswordAuthParams,
  CheckEmailPhoneExistParams,
  ConfirmAccountParams,
  LoginParams,
  RegisterParams,
  SendMailOtpParams,
} from 'types/auth';
import { CommonResponse } from 'types/common';
import { User } from 'types/user';
import HttpClient from 'utils/HttpClient';

class Auth {
  public login(params: LoginParams) {
    return HttpClient.post<typeof params, CommonResponse>(
      API_LOGIN_PATH,
      params
    );
  }

  public register(params: RegisterParams) {
    return HttpClient.post<typeof params, CommonResponse<User>>(
      API_REGISTER_PATH,
      params
    );
  }

  public confirmAccount(params: ConfirmAccountParams) {
    return HttpClient.get<typeof params, CommonResponse<User>>(
      API_VERIFY_PATH,
      {
        params,
      }
    );
  }

  public logout() {
    return HttpClient.get<null, CommonResponse>(API_LOGOUT_PATH);
  }

  public sendMailOtp(params: SendMailOtpParams) {
    const url = API_FORGOT_PASSWORD_PATH + params.email;
    return HttpClient.get<typeof params, CommonResponse<User>>(url);
  }

  public changePasswordAuth(params: ChangePasswordAuthParams) {
    return HttpClient.put<typeof params, CommonResponse<User>>(
      API_FORGOT_CHANGE_PASSWORD_PATH,
      params
    );
  }

  public sendOtpAgain(params: SendMailOtpParams) {
    return HttpClient.get<typeof params, CommonResponse<User>>(
      API_SEND_OTP_AGAIN_PATH,
      {
        params,
      }
    );
  }

  public checkEmailPhoneExist(params: CheckEmailPhoneExistParams) {
    return HttpClient.get<null, CommonResponse>(API_CHECK_EXIST_EMAIL_PHONE, {
      params,
    });
  }
}

export default new Auth();
