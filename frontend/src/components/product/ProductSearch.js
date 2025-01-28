import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../layouts/MetaData";
import Loader from "../layouts/Loader";
import { useDispatch } from "react-redux";
import { getProducts } from "../../actions/productsAction";
import { useSelector } from "react-redux";
import Product from "../product/Product";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "react-js-pagination";
import { useParams } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap.css";

export const ProductSearch = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const { keyword } = useParams();
  const [price, setPrice] = useState([1, 1000]);
  const [category, setCategory] = useState(null);
  const [priceChanged, setPriceChanged] = useState(price);
  const [rating, setRating] = useState(0);
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
    dispatch(getProducts(keyword, priceChanged, category, rating, currentPage));
  }, [error, dispatch, currentPage, keyword, category, priceChanged, rating]);

  const categories = [
    "Electronics",
    "Mobile Phones",
    "Laptops",
    "Accessories",
    "Headphones",
    "Food",
    "Books",
    "Cloth",
    "Sports",
    "Beauty/health",
    "Outdoor",
    "Home",
  ];

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Buy Best Products"} />
          <h1 id="products_heading">Search Products</h1>

          <section id="products" className="container mt-5">
            <div className="row">
              <div className="col-6 col-md-3 mb-5 mt-5">
                <div className="px-5" onMouseUp={() => setPriceChanged(price)}>
                  <Slider
                    range={true}
                    marks={{ 1: "$1", 1000: "$1000" }}
                    min={1}
                    max={1000}
                    defaultValue={price}
                    onChange={(price) => {
                      setPrice(price);
                    }}
                    handleRender={(renderProps) => {
                      return (
                        <Tooltip
                          overlay={`$${renderProps.props["aria-valuenow"]}`}
                        >
                          <div {...renderProps.props}> </div>
                        </Tooltip>
                      );
                    }}
                  />
                </div>
                <hr className="my-5" />
                <div className="mt-5">
                  <h3 className="mb-3">Categories</h3>
                  <ul className="pl-0">
                    {categories.map((item, i) => {
                      return (
                        <li
                          onClick={() => {
                            setCategory(item);
                          }}
                          style={{ listStyleType: "none", cursor: "pointer" }}
                        >
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <hr className="my-5" />
                <div className="mt-5">
                  <h4 className="mb-3">Ratings</h4>
                  <ul className="pl-0">
                    {[5, 4, 3, 2, 1].map((item, i) => {
                      return (
                        <li
                          onClick={() => {
                            setRating(item);
                          }}
                          style={{ listStyleType: "none", cursor: "pointer" }}
                        >
                          <div className="rating-outer">
                            <div
                              className="rating-inner"
                              style={{ width: `${item * 20}%` }}
                            ></div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {/* <Slider /> */}
              </div>
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
