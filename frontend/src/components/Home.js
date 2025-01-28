import React, { Fragment, useEffect, useState } from "react";
import MetaData from "./layouts/MetaData";
import Loader from "./layouts/Loader";
import { useDispatch } from "react-redux";
import { getProducts } from "../actions/productsAction";
import { useSelector } from "react-redux";
import Product from "./product/Product";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "react-js-pagination";

export const Home = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const { products, loading, error, productsCount, resPerPage } = useSelector(
    (state) => state.productsState
  );
  console.log("products", products);
  console.log(currentPage);
  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo);
  };

  useEffect(() => {
    if (error) {
      return toast.error(error, {
        position: "bottom-center", //
      });
    }
    dispatch(getProducts(null, null, null, null, currentPage));
  }, [error, dispatch, currentPage]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Buy Best Products"} />
          <h1 id="products_heading">Latest Products</h1>

          <section id="products" className="container mt-5">
            <div className="row">
              {/* Passing products as a prop to Product component */}
              {/* <Product products={products} /> */}
              {products &&
                products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
            </div>
          </section>
          {productsCount > 0 && productsCount > resPerPage ? (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                activePage={currentPage}
                onChange={setCurrentPageNo}
                totalItemsCount={productsCount}
                itemsCountPerPage={resPerPage}
                nextPageText={"Next"}
                firstPageText={"First"}
                lastPageText={"Last"}
                itemClass={"page-item"}
                linkClass={"page-link"}
              />
            </div>
          ) : null}
        </Fragment>
      )}
    </Fragment>
  );
};
