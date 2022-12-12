export interface Dictionary<T = any> {
  [key: string]: T;
}

export type PickUnion<T> = { [K in keyof T]: Pick<T, K> }[keyof T];

export interface CommonResponse<D = any> {
  data: D | null;
  httpStatusCode: string;
  message: string | null;
  success: boolean;
  additionalInfo: Dictionary | null;
}

export interface Sort {
  sortBy: string;
  sortDirection: string;
}

export interface Paging {
  pageNumber: number;
  pageSize: number;
}
