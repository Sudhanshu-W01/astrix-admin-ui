// src/features/filter/filterSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  filterText: string;
  tags: string[];
}

const initialState: FilterState = {
  filterText: '',
  tags: [],
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilterText: (state, action: PayloadAction<string>) => {
      state.filterText = action.payload;
    },
    addTag: (state, action: PayloadAction<string>) => {
      if (!state.tags.includes(action.payload)) {
        state.tags.push(action.payload);
      }
    },
    removeTag: (state, action: PayloadAction<string>) => {
      state.tags = state.tags.filter(tag => tag !== action.payload);
    },
    clearTags: (state) => {
      state.tags = [];
    },
  },
});

export const { setFilterText, addTag, removeTag, clearTags } = filterSlice.actions;
export default filterSlice.reducer;
