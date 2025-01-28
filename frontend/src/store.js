import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import productReducer from "./slices/productSlice";

const reducer = combineReducers({
  productsState: productsReducer,
  productState: productReducer,
}); // Note the correct plural name

const store = configureStore({
  reducer, // Combine reducers here if you have any
  // No need to explicitly add thunk; it's included by default
});

export default store;
