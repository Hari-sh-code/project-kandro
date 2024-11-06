import React, { useContext, useEffect } from "react";
import DataContext from "../Context/DataContext";

const Filter = () => {
  const { filter, handleFilter } = useContext(DataContext);

  return (
    <div className="flex gap-2 py-4 border-b">
      <div
        onClick={() => handleFilter(0)}
        className={`${
          filter === 0
            ? "bg-gray-700 text-white hover:bg-gray-700 transition-all duration-300"
            : "bg-white text-black"
        } filter`}
      >
        All
      </div>
      <div
        onClick={() => handleFilter(1)}
        className={`${
          filter === 1
            ? "bg-gray-700 text-white hover:bg-gray-700 transition-all duration-300"
            : "bg-white text-black"
        } filter`}
      >
        Newly Uploaded
      </div>
      <div
        onClick={() => handleFilter(2)}
        className={`${
          filter === 2
            ? "bg-gray-700 text-white hover:bg-gray-700 transition-all duration-300"
            : "bg-white text-black"
        } filter`}
      >
        High Quality
      </div>
      <div
        onClick={() => handleFilter(3)}
        className={`${
          filter === 3
            ? "bg-gray-700 text-white hover:bg-gray-700 transition-all duration-300"
            : "bg-white text-black"
        } filter`}
      >
        High Rating
      </div>
    </div>
  );
};

export default Filter;
