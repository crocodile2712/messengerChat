import type { Sort } from 'types/common';
import {
  HOME_PATH,
  PRODUCT_DETAIL_PATH,
  SEARCH_PATH,
  TERM_OF_SERVICE,
} from './route-path';

const STEP_1 = 1;
const STEP_2 = 2;
const STEP_3 = 3;
const STEP_4 = 4;
const UPLOAD_TYPE_PROFILE = 'PROFILE';
const ADDRESS_DEFAULT = 1;
const ADDRESS_UN_DEFAULT = 2;
const ON_SALE_PRODUCT = 'on_sale';

// MALE: 1, FEMALE: 2
const GENDERS = [1, 2];

const PRODUCT_SORT: Record<string, Sort> = {
  PRICE_ASC: {
    sortBy: 'price',
    sortDirection: 'ASC',
  },
  PRICE_DESC: {
    sortBy: 'price',
    sortDirection: 'DESC',
  },
  LATEST: {
    sortBy: 'created',
    sortDirection: 'DESC',
  },
  OLDEST: {
    sortBy: 'created',
    sortDirection: 'ASC',
  },
};

const PRODUCT_STATUS = {
  ON_SALE: 1,
  SOLD_OUT: 2,
};

const FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
const SEARCH_BAR_ROUTE = [
  HOME_PATH,
  SEARCH_PATH,
  `${PRODUCT_DETAIL_PATH}[productId]`,
  TERM_OF_SERVICE,
];

const TYPE_FORM = {
  UPDATE: 'UPDATE',
  CREATE: 'CREATE',
};

export {
  STEP_1,
  STEP_2,
  STEP_3,
  STEP_4,
  GENDERS,
  UPLOAD_TYPE_PROFILE,
  ADDRESS_DEFAULT,
  ADDRESS_UN_DEFAULT,
  PRODUCT_SORT,
  ON_SALE_PRODUCT,
  SEARCH_BAR_ROUTE,
  FILE_TYPES,
  PRODUCT_STATUS,
  TYPE_FORM,
};
