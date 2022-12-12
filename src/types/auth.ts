export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string | null;
  httpStatusCode: number;
  message: string;
  success: boolean;
}

export interface RegisterParams {
  fullName: string;
  mobile: string;
  email: string | null;
  password: string;
  passwordConfirm: string;
}

export interface ConfirmAccountParams {
  email: string;
  otp: string;
}

export interface SendMailOtpParams {
  email: string;
}

export interface ChangePasswordAuthParams {
  newPassword: string;
  renewPassword: string;
  email: string;
  otp: string;
}

export interface CheckEmailPhoneExistParams {
  email: string | null;
  mobile: string | null;
}
