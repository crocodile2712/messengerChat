import HttpClient from 'utils/HttpClient';
import type { CommonResponse } from 'types/common';
import { API_TRANSACTION_SEARCH } from 'constant/api-path';
import type { SearchTransactionParams, TransactionItem } from 'types/transaction';

class Transaction {
  public searchTransaction(params: SearchTransactionParams) {
    return HttpClient.post<typeof params, CommonResponse<TransactionItem[]>>(
      API_TRANSACTION_SEARCH,
      params
    );
  }
}

export default new Transaction();
