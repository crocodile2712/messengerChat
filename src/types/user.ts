export interface User {
  email: string;
  fullName: string;
  id: number;
  mobile: string;
  roles: [];
  username: string;
  dateOfBirth: string;
  gender: number;
  imageUrl: string;
  status: number;
  cashAmount: number;
  feeRatio: number;
}

export interface Address {
  id: number;
  addressDefault: number;
  cityId: number;
  districtId: number;
  fullName: string;
  mobile: string;
  specificAddress: string;
  wardsId: number;
  addressLine: string;
}

export interface Ward {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
}

export interface UpdateUserParams {
  email: string | null;
  fullName: string;
  id: number;
  mobile: string;
  username: string;
  dateOfBirth: string | null;
  gender: number | null;
  imageUrl: string | null;
}

export interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface AddressFormParams {
  id: number | null;
  addressDefault: number;
  cityId: number;
  districtId: number;
  fullName: string;
  mobile: string;
  specificAddress: string;
  wardsId: number;
}
