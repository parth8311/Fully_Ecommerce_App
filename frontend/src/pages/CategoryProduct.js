import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import productCategory from "../helpers/productCategory";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";
import VerticalCard from "../components/VerticalCard";
import SummeryApi from "../common";

const CategoryProduct = () => {
  const params = useParams();
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const urlCategoryListInArray = urlSearch.getAll("category");
  const urlCategoryListObject = {};
  urlCategoryListInArray.forEach((el) => {
    urlCategoryListObject[el] = true;
  });
  console.log("object", urlCategoryListObject);
  console.log(urlCategoryListInArray);
  const [selectCategory, setSelectCategory] = useState(urlCategoryListObject);
  const [filterCategoryList, setFilterCategoryList] = useState([]);

  const [sortBy,setSortBy] = useState("")

  console.log(sortBy)

  const fetchData = async () => {
    const response = await fetch(SummeryApi.filterProduct.url, {
      method: SummeryApi.filterProduct.method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        category: filterCategoryList,
      }),
    });
    const dataResponse = await response.json();
    setData(dataResponse?.data || []);
    console.log(dataResponse);
  };

  const handleSelectCategory = (e) => {
    const { name, value, checked } = e.target;
    setSelectCategory((prev) => {
      return {
        ...prev,
        [value]: checked,
      };
    });
    console.log(name, value, checked);
  };

  console.log(params);
  console.log(selectCategory);

  useEffect(() => {
    fetchData();
  }, [filterCategoryList]);

  useEffect(() => {
    const arrayOfCategory = Object.keys(selectCategory)
      .map((categoryKeyName) => {
        if (selectCategory[categoryKeyName]) {
          return categoryKeyName;
        }
        return null;
      })
      .filter((el) => el);

    setFilterCategoryList(arrayOfCategory);

    //format for url change when change on the checkbox
    const urlFormat = arrayOfCategory.map((el, index) => {
      if (arrayOfCategory.length - 1 === index) {
        return `category=${el}`;
      }
      return `category=${el}&&`;
    });

    console.log(urlFormat.join(""));
    navigate("/product-category?" + urlFormat.join(""));

    console.log(arrayOfCategory);
  }, [selectCategory]);

  const handleOnChangeSortBy = (e) => {
    const {value} = e.target
    setSortBy(value)
    if (value === 'asc') {
      setData(prev => prev.sort((a,b) => a.sellingPrice - b.sellingPrice))
    }
    if (value === 'dsc') {
      setData(prev => prev.sort((a,b) => b.sellingPrice - a.sellingPrice))
    }
  }

  useEffect(() => {

  },[sortBy])

  return (
    <div className="container mx-auto p-4">
      {/* {params?.categoryName} */}
      {/**Desktop Version */}
      <div className="hidden lg:grid grid-cols-[200px,1fr]">
        {/**Left Side */}
        <div className="bg-white p-2 min-h-[calc(100vh-120px)] overflow-y-scroll">
          {/**Sort By */}
          <div className="">
            <h3 className="text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300">
              Sort By
            </h3>
            <form className="text-sm flex flex-col gap-2 py-2">
              <div className="flex items-center gap-3">
                <input type="radio" name="sortBy" checked={sortBy === "asc"} onChange={handleOnChangeSortBy} value={"asc"}/>
                <label>Price - Low To High</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="radio" name="sortBy" checked={sortBy === "dsc"} onChange={handleOnChangeSortBy} value={"dsc"}/>
                <label>Price - High To Low</label>
              </div>
            </form>
          </div>

          {/**Filter By */}
          <div className="">
            <h3 className="text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300">
              Category
            </h3>
            <form className="text-sm flex flex-col gap-2 py-2">
              {productCategory.map((categoryName, index) => {
                return (
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name={"category"}
                      checked={selectCategory[categoryName?.value]}
                      value={categoryName?.value}
                      id={categoryName?.value}
                      onChange={handleSelectCategory}
                    />
                    <label htmlFor={categoryName?.value}>
                      {categoryName?.label}
                    </label>
                  </div>
                );
              })}
            </form>
          </div>
        </div>

        {/**Right Side (Product) */}
        <div className="px-4">
          <p className="font-medium text-slate-800 text-lg my-2">Search Result : {data.length}</p>
          <div className="min-h-[calc(100vh-120px)] overflow-y-scroll max-h-[calc(100vh - 120px)]">
            {data.length !== 0 && (
              <VerticalCard data={data} loading={loading} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProduct;
