import type { Dictionary } from './common';

export interface SeachProductParams {
  pageNumber: number;
  pageSize: number;
  query: string | null;
  categoryIds: string[] | null;
  priceFrom: number | null;
  priceTo: number | null;
  sortBy: string;
  sortDirection: string;
  status: number;
}

export interface CategorySearch {
  displayOrder: string;
  id: string;
  itemBrandGroupId: string;
  itemSizeGroupId: string;
  level: string;
  name: string;
  parentId: string;
}

export interface AddWatchedProductParams {
  id: string;
  name: string;
  price: number;
  thumbnailUrl: string;
}

export interface EstimatePriceParams {
  totalPrice: number;
  weight: number;
}

export interface CartItem {
  brand: string;
  id: string;
  image: string;
  name: string;
  condition: string;
  price: number;
  size: string;
  status: string;
  shippingDuration: string;
  shippingMethod: string;
}

export interface CategoryRespond extends Dictionary {
  0: CategorySearch[];
  1: CategorySearch[];
  2: CategorySearch[];
}

export interface RelatedProductResponseItem {
  id: string;
  items: Product[];
}

export interface SearchProduct {
  id: string;
  name: string;
  thumbnailUrl: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  thumbnailUrl: string;
}

interface Color {
  name: string;
  id: number;
  rgb: string;
}

export interface Comment {
  created: number;
  id: number;
  message: string;
  user: User;
}

interface User {
  id: number;
  name: string;
  photo_thumbnail_url: string;
  photo_url: string;
}

interface Brand {
  id: number;
  name: string;
  sub_name: string;
}

interface Category {
  brand_group_id: number;
  display_order: number;
  id: number;
  name: string;
  parent_category_id: number;
  parent_category_name: string;
  root_category_id: number;
  root_category_name: string;
}

interface Condition {
  id: number;
  name: string;
}

interface Rating {
  normal: number;
  bad: number;
  good: number;
}

interface Seller {
  created: number;
  id: number;
  is_official: boolean;
  name: string;
  num_ratings: number;
  num_sell_items: number;
  photo_thumbnail_url: string;
  photo_url: string;
  quick_shipper: boolean;
  ratings: Rating;
  register_sms_confirmation: string;
  register_sms_confirmation_at: string;
  score: number;
  star_rating_score: number;
}

interface ShippingClass {
  fee: number;
  icon_id: number;
  id: number;
  is_pickup: boolean;
  pickup_fee: number;
  shipping_fee: number;
  total_fee: number;
}

interface ShippingDuration {
  id: number;
  max_days: number;
  min_days: number;
  name: string;
}

interface ShippingFromArea {
  id: number;
  name: string;
}

interface ShippingMethod {
  id: number;
  is_deprecated: string;
  name: string;
}

interface ShippingPayer {
  code: string;
  id: number;
  name: string;
}

interface ItemSize {
  name: string;
  id: number;
}

export interface ProductDetail {
  additional_services: [];
  application_attributes: {};
  checksum: string;
  colors: Color[];
  comments: Comment[];
  created: number;
  description: string;
  has_additional_service: boolean;
  has_like_list: boolean;
  hash_tags: [];
  id: string;
  is_anonymous_shipping: boolean;
  is_cancelable: boolean;
  is_dynamic_shipping_fee: boolean;
  is_offerable: boolean;
  is_offerable_v2: boolean;
  is_organizational_user: boolean;
  is_shop_item: string;
  is_stock_item: boolean;
  is_web_visible: boolean;
  item_brand: Brand;
  item_category: Category;
  item_condition: Condition;
  item_size: ItemSize;
  liked: boolean;
  name: string;
  num_comments: number;
  num_likes: number;
  organizational_user_status: '';
  pager_id: number;
  photo_paths: string[];
  photos: string[];
  price: number;
  seller: Seller;
  shipped_by_worker: boolean;
  shipping_class: ShippingClass;
  shipping_duration: ShippingDuration;
  shipping_from_area: ShippingFromArea;
  shipping_method: ShippingMethod;
  shipping_payer: ShippingPayer;
  status: string;
  thumbnails: string[];
  updated: number;
}

export interface OutStandingProductParams {
  pageNumber: number | null;
  pageSize: number | null;
}
