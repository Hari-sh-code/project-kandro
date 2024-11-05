import React from "react";
import { MdAdd } from "react-icons/md";

const Datasets = () => {
  return (
    <>
      <div className="flex justify-center flex-col container mx-auto">
        <div className="flex justify-center">
          <h1 className="text-7xl">Datasets</h1>
        </div>
        <div className="flex justify-end">
          <div className="flex flex-row items-center justify-center gap-2 bg-black text-white rounded-full p-2">
            <MdAdd className="h-8 w-8" />
            <div className="text-3xl flex items-center">New Datset</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Datasets;
