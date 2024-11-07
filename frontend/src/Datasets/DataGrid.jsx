import React, { useContext } from "react";
import img1 from "../assets/iconify.png";
import { IoMdStar } from "react-icons/io";
import { FaEthereum } from "react-icons/fa";
import { Link } from "react-router-dom";
import DataContext from "../Context/DataContext";

const DataGrid = () => {
  const { datasets } = useContext(DataContext);

  const isNewDataset = (time) => {
    const datasetTime = new Date(time);
    const now = new Date();

    const timeDiff = (now - datasetTime) / (1000 * 60 * 60);

    return timeDiff < 48;
  };

  return (
    <div className="mt-20 flex justify-center">
      <div className="grid grid-cols-3 gap-10">
        {datasets.length > 0 ? (
          datasets.map((data) => (
            <Link
              to={`/datasets/${data.id}`}
              className="relative rounded-lg"
              key={data.id}
            >
              <img
                className="h-96 w-96 rounded-lg opacity-85"
                src={img1}
                alt=""
              />
              <div className="absolute top-0 font-semibold right-0 flex items-center gap-1 text-xl p-2 bg-white text-black border-t border-r rounded-bl-lg rounded-tr-lg">
                {data.rating} <IoMdStar className="h-6 w-6" />
              </div>

              {isNewDataset(data.time) && (
                <div className="absolute top-0 left-0 flex items-center justify-center text-xl p-2 bg-black font-bold text-white rounded-br-lg">
                  NEW
                </div>
              )}

              <div className="absolute -bottom-1 rounded-t-3xl rounded-b-lg w-full border bg-white p-3">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-3xl font-semibold">
                      {data.name.length < 19
                        ? data.name
                        : `${data.name.slice(0, 19)}...`}
                    </h3>
                    <div>{`By ${data.owner}`}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xl gap-1 font-semibold">
                      <FaEthereum /> {data.price} Gwei ETH
                    </div>

                    <div className="bg-black text-white px-2 py-1 pb-1 text-xl rounded-full">
                      View
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No items available</p>
        )}
      </div>
    </div>
  );
};

export default DataGrid;
