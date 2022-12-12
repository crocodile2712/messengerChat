import { combineReducers } from '@reduxjs/toolkit';
import counterReducer from 'slices/counter';
import categoryReducer from 'slices/category';

const rootReducer = combineReducers({
  counter: counterReducer,
  category: categoryReducer,
});

export default rootReducer;
