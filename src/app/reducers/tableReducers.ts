import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    index: "",
    data: "",
    label: "",
  },
  events: {
    index: "",
    data: "",
    label: "",
  },
  tickets: {
    index: "",
    data: "",
    label: "",
  },
  posts: {
    index: "",
    data: "",
    label: "",
  },
  buyers: {
    index: "",
    data: "",
    label: "",
  },
};

const tableParams = createSlice({
  name: "params",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    updateEvents: (state, action) => {
      state.events = action.payload;
    },
    updatePosts: (state, action) => {
      state.posts = action.payload;
    },
    updateBuyers: (state, action) => {
      state.buyers = action.payload;
    },
    updateTickets: (state, action) => {
      state.tickets = action.payload;
    },
  },
});

export const { updateUser, updateEvents, updatePosts,updateBuyers,updateTickets } = tableParams.actions;
export default tableParams.reducer;
