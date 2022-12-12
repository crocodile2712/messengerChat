import { API_GET_WATCHED_PRODUCT } from 'constant/api-path';
import type { CommonResponse } from 'types/common';
import type { Product } from 'types/product';
import HttpClient from 'utils/HttpClient';

// Get watched products
interface GetWatchedProductResponse {
  products: Product[] | null;
}
const getWatchedProducts = async () => {
  return HttpClient.get<null, CommonResponse<GetWatchedProductResponse>>(
    API_GET_WATCHED_PRODUCT
  );
};

// Get related products
const getRelatedProducts = async (productId: string) => {
  return HttpClient.get<null, CommonResponse<Product[]>>(
    `/product/related_product/${productId}`
  );
};

export { getWatchedProducts, getRelatedProducts };
