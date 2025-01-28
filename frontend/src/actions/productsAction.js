import axios from "axios";

import {
  productsFail,
  productsSuccess,
  productsRequest,
} from "../slices/productsSlice";

import {
  productFail,
  productSuccess,
  productRequest,
} from "../slices/productSlice";

export const getProducts =
  (keyword, price, category, rating, currentPage) => async (dispatch) => {
    try {
      dispatch(productsRequest());
      let link = `/api/v1/products?page=${currentPage}`;
      if (keyword) {
        link += `&keyword=${keyword}`;
      }
      if (price) {
        link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`;
      }
      if (category) {
        link += `&category=${category}`;
      }
      if (rating) {
        link += `&ratings=${rating}`;
      }
      dispatch(productsRequest());
      const { data } = await axios.get(link);
      dispatch(productsSuccess(data));
      console.log("called");
    } catch (error) {
      console.log("hii");
      dispatch(productsFail(error.response.data.message));
    }
  };

export const getProduct = (id) => async (dispatch) => {
  try {
    dispatch(productRequest());
    const { data } = await axios.get(`/api/v1/product/${id}`); // The URL is correct
    console.log(data);
    dispatch(productSuccess(data));
    console.log("called");
  } catch (error) {
    console.log("hii");
    dispatch(productFail(error.response.data.message));
  }
};
