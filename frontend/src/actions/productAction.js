import axios from "axios";

import {
  productFail,
  productSuccess,
  productRequest,
} from "../slices/productSlice";

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
