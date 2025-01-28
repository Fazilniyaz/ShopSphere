import React, { Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLocation } from "react-router-dom";

function Search() {
  const location = useLocation();

  const clearkeyword = () => {
    setkeyword("");
  };

  useEffect(() => {
    if (location.pathname === "/") {
      clearkeyword();
    }
  }, [location]);

  const [keyword, setkeyword] = useState("");

  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    navigate(`/search/${keyword}`);
  };

  return (
    <Fragment>
      <form onSubmit={searchHandler}>
        <div class="input-group">
          <input
            type="text"
            id="search_field"
            class="form-control"
            placeholder="Enter Product Name ..."
            value={keyword}
            onChange={(e) => setkeyword(e.target.value)}
          />
          <div class="input-group-append">
            <button id="search_btn" class="btn">
              <i class="fa fa-search" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </form>
    </Fragment>
  );
}

export default Search;
