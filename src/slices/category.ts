import type { CategorySearch } from "types/product";
import { createSlice } from '@reduxjs/toolkit';

interface CategoryState {
  categoryList: Record<number, CategorySearch[]> | null;
}

const initialState: CategoryState = {
  categoryList: null,
}

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategoryList(state, action){
      state.categoryList = action.payload;
    }
  },
});

export const { setCategoryList } = categorySlice.actions;
export default categorySlice.reducer;