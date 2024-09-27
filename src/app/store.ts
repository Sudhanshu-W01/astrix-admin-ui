import { configureStore } from "@reduxjs/toolkit";
import tableReducers from "./reducers/tableReducers";
import filterReducers from "./reducers/filterReducers";

export const makeStore = () => {
  return configureStore({
    reducer: {
      tableParams:tableReducers,
      filter: filterReducers,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
