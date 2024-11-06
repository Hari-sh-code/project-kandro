import React from "react";
import { MdAdd } from "react-icons/md";

const Datasets = () => {
  return (
    <>
      <div className="flex flex-col basis-full">
        <div className="text-4xl p-5 font-medium">Datasets</div>
        <div className="flex flex-row justify-between items-center px-5">
          <div>
            <form action="" className="border">
              <input type="text" name="" id="" />
            </form>
          </div>
          <div className="flex items-center justify-center rounded-full bg-black text-white border-black border-2 pr-3">
            <MdAdd className="h-10 w-10" />
            <div className="text-4xl flex items-center pb-1">Dataset</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Datasets;
