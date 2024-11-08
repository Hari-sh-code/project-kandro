import React, { useContext, useState } from "react";
import { CgSearch } from "react-icons/cg";
import { MdAdd } from "react-icons/md";
import Filter from "./Filter";
import ModelGrid from "./ModelGrid";
import { Link } from "react-router-dom";
import DataContext from "../Context/DataContext";

const Models = () => {
  const { setSearchVal } = useContext(DataContext);
  return (
    <>
      <div className="flex flex-col basis-full overflow-auto h-screen bg-gray-50">
        <div className="text-4xl p-5 font-medium">Models</div>
        <div className="flex flex-row justify-between items-center px-5">
          <div>
            <form
              action=""
              className="gap-2 border rounded-full flex items-center justify-center p-2"
            >
              <label htmlFor="modelsetInp">
                <CgSearch className="h-6 w-6 pl-1 text-gray-600" />
              </label>
              <input
                onChange={(e) => setSearchVal(e.target.value.toLowerCase())}
                className="outline-none text-lg text-gray-600 rounded-r-full bg-transparent"
                type="text"
                id="datasetInp"
                placeholder="Search Models"
              />
            </form>
          </div>
          {/* <Link
            className="flex items-center justify-center rounded-full bg-black text-white border-black border-2 pr-3"
            to={"/upload file"}
          >
            <MdAdd className="h-8 w-8" />
            <div className="text-2xl flex items-center pb-1">Dataset</div>
          </Link> */}
        </div>
        <div className="px-5">
          <Filter />
        </div>
        <div className="px-5">
          <ModelGrid />
        </div>
      </div>
    </>
  );
};

export default Models;
