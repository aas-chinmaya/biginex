import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryMasterRow } from "../types";

interface CategoryState {
  categories: CategoryMasterRow[];
  loading: boolean;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<CategoryMasterRow[]>) {
      state.categories = action.payload;
    },
    addCategory(state, action: PayloadAction<CategoryMasterRow>) {
      state.categories.unshift(action.payload);
    },
    removeCategory(state, action: PayloadAction<string>) {
      state.categories = state.categories.filter((category) => String(category.id) !== action.payload);
    },
  },
});

export const { setCategories, addCategory, removeCategory } = categorySlice.actions;
export default categorySlice.reducer;
