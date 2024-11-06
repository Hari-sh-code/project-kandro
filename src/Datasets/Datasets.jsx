import React from "react";
import { CgSearch } from "react-icons/cg";
import { MdAdd } from "react-icons/md";
import Filter from "./Filter";
import DataGrid from "./DataGrid";

const Datasets = () => {
  return (
    <>
      <div className="flex flex-col basis-full overflow-auto h-screen">
        <div className="text-4xl p-5 font-medium">Datasets</div>
        <div className="flex flex-row justify-between items-center px-5">
          <div>
            <form
              action=""
              className="gap-2 border rounded-lg flex items-center justify-center"
            >
              <label htmlFor="datasetInp">
                <CgSearch className="h-6 w-6 pl-1 text-gray-600" />
              </label>
              <input
                className="outline-none text-lg text-gray-600 rounded-lg"
                type="text"
                id="datasetInp"
                placeholder="Search Datasets"
              />
            </form>
          </div>
          <button className="flex items-center justify-center rounded-full bg-black text-white border-black border-2 pr-3">
            <MdAdd className="h-8 w-8" />
            <div className="text-2xl flex items-center pb-1">Dataset</div>
          </button>
        </div>
        <div className="px-5">
          <Filter />
        </div>
        <div className="px-5">
          <DataGrid />
        </div>
      </div>
    </>
  );
};

export default Datasets;
