import {
  API_CHANGE_PASSWORD_PATH,
  API_CREATE_ADDRESS,
  API_GET_ADDRESS,
  API_GET_LIST_ADDRESS,
  API_GET_LIST_CITY,
  API_GET_LIST_DISTRICT,
  API_GET_LIST_WARD,
  API_GET_USER_PROFILE_PATH,
  API_REMOVE_ADDRESS,
  API_UPDATE_ADDRESS,
  API_UPDATE_USER_PROFILE_PATH,
  API_UPLOAD_IMAGE,
} from 'constant/api-path';
import { CommonResponse } from 'types/common';
import type {
  Address,
  AddressFormParams,
  ChangePasswordParams,
  UpdateUserParams,
  User,
} from 'types/user';
import HttpClient from 'utils/HttpClient';

class Users {
  public getUser() {
    return HttpClient.get<null, CommonResponse<User>>(
      API_GET_USER_PROFILE_PATH
    );
  }

  public updateUser(params: UpdateUserParams) {
    return HttpClient.put<typeof params, CommonResponse<User>>(
      API_UPDATE_USER_PROFILE_PATH,
      params
    );
  }

  public changePassword(params: ChangePasswordParams) {
    return HttpClient.put<typeof params, CommonResponse<User>>(
      API_CHANGE_PASSWORD_PATH,
      params
    );
  }

  public getAvatarUrl(params: FormData) {
    return HttpClient.post<FormData, CommonResponse<string>>(
      API_UPLOAD_IMAGE,
      params,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  }

  public getListCity() {
    return HttpClient.get<null, CommonResponse>(API_GET_LIST_CITY);
  }

  public getListDistrict(cityId: number) {
    return HttpClient.get<null, CommonResponse>(API_GET_LIST_DISTRICT, {
      params: {
        id: cityId,
      },
    });
  }

  public getListWard(districtId: number) {
    return HttpClient.get<null, CommonResponse>(API_GET_LIST_WARD, {
      params: {
        id: districtId,
      },
    });
  }

  public getListAddress() {
    return HttpClient.get<null, CommonResponse>(API_GET_LIST_ADDRESS);
  }

  public getAddress(addressId: number) {
    const url = API_GET_ADDRESS + addressId;
    return HttpClient.get<number, CommonResponse>(url);
  }

  public removeAddress(addressId: number) {
    const url = API_REMOVE_ADDRESS + addressId;
    return HttpClient.put<number, CommonResponse<Address>>(url);
  }

  public updateAddress(params: AddressFormParams) {
    return HttpClient.post<typeof params, CommonResponse>(
      API_UPDATE_ADDRESS,
      params
    );
  }

  public createAddress(params: AddressFormParams) {
    return HttpClient.post<typeof params, CommonResponse>(
      API_CREATE_ADDRESS,
      params
    );
  }
}

export default new Users();
