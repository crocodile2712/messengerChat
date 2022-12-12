import type { CommonResponse } from 'types/common';
import type { TermAndPolicyRespond } from 'types/termAndPolicy';
import HttpClient from 'utils/HttpClient';

class TermAndPolicy {
  public getTerm() {
    return HttpClient.get<null, CommonResponse<TermAndPolicyRespond>>(
      '/terms-and-privacy-policy/terms'
    );
  }

  public getPolicy() {
    return HttpClient.get<null, CommonResponse<TermAndPolicyRespond>>(
      '/terms-and-privacy-policy/policy'
    );
  }
}

export default new TermAndPolicy();
