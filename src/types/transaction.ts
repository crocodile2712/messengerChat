export interface SearchTransactionParams {
  pageNumber: number;
  pageSize: number;
  from: string | null;
  to: string | null;
}

export interface TransactionItem {
  id: number;
  createdAt: string;
  amount: number;
  note: string;
  orderId: null | number;
  type: number
}