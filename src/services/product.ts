import {
  API_ADD_TO_CART,
  API_ADD_WATCHED_PRODUCT,
  API_ESTIMATE_PRICE,
  API_GET_CART_ITEMS,
  API_GET_PRODUCT_DETAIL,
  API_GET_PRODUCT_OUTSTANDING,
  API_GET_RELATED_PRODUCT,
  API_GET_WATCHED_PRODUCT,
  API_PRICE_RATE,
  API_PRODUCT_CATEGORY,
  API_PRODUCT_CATEGORY_ROOT,
  API_PRODUCT_RECOMMENDED,
  API_PRODUCT_SEARCH,
  API_REMOVE_FROM_CART,
  API_UPDATE_NEWEST_PRODUCT_DETAIL,
} from 'constant/api-path';
import type { CommonResponse, Paging } from 'types/common';
import type {
  AddWatchedProductParams,
  CartItem,
  CategoryRespond,
  OutStandingProductParams,
  RelatedProductResponseItem,
  SeachProductParams,
  SearchProduct,
  Product as ProductType,
  CategorySearch,
  EstimatePriceParams,
} from 'types/product';
import HttpClient from 'utils/HttpClient';

class Product {
  public searchProduct(params: SeachProductParams) {
    return HttpClient.post<typeof params, CommonResponse<SearchProduct[]>>(
      API_PRODUCT_SEARCH,
      params
    );
  }

  public getOutstandingProduct(params: OutStandingProductParams) {
    return HttpClient.post<typeof params, CommonResponse<ProductType[]>>(
      API_GET_PRODUCT_OUTSTANDING,
      params
    );
  }

  public getCategory() {
    return HttpClient.get<null, CommonResponse<CategoryRespond>>(
      API_PRODUCT_CATEGORY
    );
  }

  public getCategoryRoot() {
    return HttpClient.get<null, CommonResponse<CategorySearch[]>>(
      API_PRODUCT_CATEGORY_ROOT
    );
  }

  public getProductDetail(productId: string) {
    const url = API_GET_PRODUCT_DETAIL + productId;
    return HttpClient.get<string, CommonResponse>(url);
  }

  public updateNewestProductDetail(productId: string) {
    const url = API_UPDATE_NEWEST_PRODUCT_DETAIL + productId;
    return HttpClient.get<string, CommonResponse>(url, {
      baseURL: 'http://103.157.218.82:3000/',
    });
  }

  public getWatchedProduct() {
    return HttpClient.get<null, CommonResponse>(API_GET_WATCHED_PRODUCT);
  }

  public getRelatedProduct(params: { id: string[] }) {
    return HttpClient.post<
      typeof params,
      CommonResponse<RelatedProductResponseItem[]>
    >(API_GET_RELATED_PRODUCT, params);
  }

  public addWatchedProduct(params: AddWatchedProductParams) {
    return HttpClient.post<typeof params, CommonResponse>(
      API_ADD_WATCHED_PRODUCT,
      params
    );
  }

  public addToCart(params: CartItem) {
    return HttpClient.post<typeof params, CommonResponse>(
      API_ADD_TO_CART,
      params
    );
  }

  public removeFromCart(id: string) {
    const url = API_REMOVE_FROM_CART + id;
    return HttpClient.delete<string, CommonResponse>(url);
  }

  public getCartItems() {
    return HttpClient.get<null, CommonResponse>(API_GET_CART_ITEMS);
  }

  public getProductRecommend(params: Paging) {
    return HttpClient.post<Paging, CommonResponse<SearchProduct[]>>(
      API_PRODUCT_RECOMMENDED,
      params
    );
  }

  public estimatePrice(params: EstimatePriceParams) {
    return HttpClient.post<EstimatePriceParams, CommonResponse<number>>(
      API_ESTIMATE_PRICE,
      params
    );
  }

  public getPriceRate() {
    return HttpClient.get<null, CommonResponse<number>>(API_PRICE_RATE);
  }
}

export default new Product();
