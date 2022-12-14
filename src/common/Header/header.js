import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import AppBar from "@material-ui/core/AppBar";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { Link } from "react-router-dom";
import "./Header.css";
import Search from "@material-ui/icons/Search";
//function for loading of resources
import loadData from "../../middleware/loadData";

function Header(props) {
  const history = useHistory();
  history.baseURL = props.baseURL;
  var pathname = history.location.pathname;
  var queryStr = history.location.search;
  console.log(history);
  //for category select menu
  const [categories, setCategories] = useState([]);
  //selected category value  SortBy value product name and direction only if path is '/products'
  var [category, setCategory] = useState(
    pathname === "/products"
      ? queryStr === ""
        ? ""
        : queryStr.split("&")[0].split("=")[1]
      : ""
  );
  var [sortBy, setSortBy] = useState(
    pathname === "/products"
      ? queryStr === ""
        ? ""
        : queryStr.split("&")[2].split("=")[1]
      : ""
  );
  var [direction, setDirection] = useState(
    pathname === "/products"
      ? queryStr === ""
        ? ""
        : queryStr.split("&")[1].split("=")[1]
      : ""
  );
  var [productname, setProductName] = useState(
    pathname === "/products"
      ? queryStr === ""
        ? ""
        : queryStr.split("&")[3].split("=")[1]
      : ""
  );

  //handle catecory input field change
  const onCategoryChange = (event) => {
    setCategory(event.target.value);
    var url = `/products?category=${event.target.value}&name=&sortBy=${sortBy}=&direction=`;
    history.push(url);
  };

  //handle sortBy input field change
  const onSortByChange = (event) => {
    if (event.target.value !== "updatedAt" || event.target.value !== "") {
      setSortBy(event.target.value.split(" ")[0]);
      setDirection(event.target.value.split(" ")[1]);
      var url = `/products?category=${category}&name=${productname}&sortBy=${
        event.target.value.split(" ")[0]
      }&direction=${event.target.value.split(" ")[1]}`;
      history.push(url);
    } else {
      setSortBy(event.target.value);
      setDirection("DESC");
      var url = `/products?category=${category}&name=${productname}&sortBy=${event.target.value}&direction=DESC}`;
      history.push(url);
    }
  };

  //handle product name input field change
  const onProductNameChange = (event) => {
    setProductName(event.target.value);
  };

  //Handling Logout
  const onLogout = () => {
    window.sessionStorage.clear();
    history.push("/");
  };

  //handling searh product
  const onSearchClick = () => {
    var url = `/products?category=${category}&name=${productname}&sortBy=${sortBy}&direction=${direction}`;
    history.push(url);
  };

  //after the component load
  useEffect(() => {
    //load all the categories from server
    loadData(`${history.baseURL}/products/categories`, "get", null, null, null)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const appBar = {
    height: "60px",
    display: "flex",
    backgroundColor: "#3f51b5",
    flexDirection: "row",
    justifyContent: "space-between",
  };

  const logo = {
    fontSize: "3em",
    margin: "2px 1%",
    heigth: "1em",
    width: "5%",
  };

  const filterFields = {
    width: "15%",
    backgroundColor: "#ffff",
    borderRadius: "5px",
  };
  return (
    <AppBar style={appBar}>
      {/**creating the logo */}
      <ShoppingCartIcon style={logo} />
      {(() => {
        //check if the user is not loggedin
        if (
          !window.sessionStorage.getItem("isLoggedIn") ||
          window.sessionStorage.getItem("isLoggedIn") === undefined
        ) {
          return (
            <div
              className="header-links"
              style={{ justifyContent: "flex-end" }}
            >
              <ul className="links-container">
                <li>
                  <Link to="/login" className="links">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="links">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
          );
        } else {
          return (
            <div className="header-links">
              <div className="filter-fields">
                <FormControl id="form-1" variant="filled" style={filterFields}>
                  <InputLabel
                    id="selsect-category-label"
                    shrink={true}
                    style={{ color: "black" }}
                  >
                    Category
                  </InputLabel>
                  <Select
                    labelId="selsect-category-label"
                    value={category}
                    id="select-category"
                    onChange={onCategoryChange}
                    label="Category"
                    className="menu-select"
                  >
                    <MenuItem value="">All</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl id="form-2" variant="filled" style={filterFields}>
                  <InputLabel
                    id="select-sort-label"
                    shrink={true}
                    style={{ color: "black" }}
                  >
                    Sort By
                  </InputLabel>
                  <Select
                    labelId="select-sort-label"
                    value={sortBy}
                    id="select-sort"
                    onChange={onSortByChange}
                    label="Sort By"
                    color="primary"
                    className="menu-select"
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="price DESC">Price high to low</MenuItem>
                    <MenuItem value="price ASC">Price low to high</MenuItem>
                    <MenuItem value="updatedAt">Latest</MenuItem>
                  </Select>
                </FormControl>
                <FormControl id="form-3" style={{ width: "40%" }}>
                  <input
                    id="productName"
                    placeholder="Product name"
                    value={productname}
                    onChange={onProductNameChange}
                    className="search-bar"
                  />
                </FormControl>
                <Search
                  className="searchIcon"
                  onClick={() => {
                    onSearchClick();
                  }}
                />
              </div>

              <ul
                className="links-container"
                style={{
                  width:
                    window.sessionStorage.getItem("role") === "admin"
                      ? "20%"
                      : "15%",
                }}
              >
                <li>
                  <Link to="/" className="links">
                    Home
                  </Link>
                </li>
                {window.sessionStorage.getItem("role") === "admin" &&
                  (() => {
                    return (
                      <li>
                        <Link to="/addproduct" className="links">
                          Add Product
                        </Link>
                      </li>
                    );
                  })()}
                <li>
                  <a
                    onClick={() => {
                      onLogout();
                    }}
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          );
        }
      })()}
    </AppBar>
  );
}

export default Header;
