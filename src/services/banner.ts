import { API_BANNER_PATH } from 'constant/api-path';
import type { BannerType } from 'types/banner';
import { CommonResponse } from 'types/common';
import HttpClient from 'utils/HttpClient';

class Banner {
  public getActiveBanner() {
    return HttpClient.get<null, CommonResponse<BannerType[]>>(API_BANNER_PATH);
  }
}

export default new Banner();
