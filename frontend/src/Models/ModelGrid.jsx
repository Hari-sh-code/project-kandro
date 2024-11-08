import React, { useContext, useState } from "react";
import img1 from "../assets/iconify.png";
import { IoMdStar } from "react-icons/io";
import { FaEthereum } from "react-icons/fa";
import { Link } from "react-router-dom";
import DataContext from "../Context/DataContext";
import { ThreeDot } from "react-loading-indicators";

const DataGrid = () => {
  const { loading } = useContext(DataContext);
  const [models, setModels] = useState([]);

  // Helper function to check if the dataset is new (within 48 hours)
  const isNewDataset = (time) => {
    const datasetTime = new Date(time);
    const now = new Date();
    const timeDiff = (now - datasetTime) / (1000 * 60 * 60); // Difference in hours
    return timeDiff < 48;
  };

  return (
    <div className="mt-14 flex justify-center">
      {/* Check if not loading */}
      {!loading ? (
        <div
          className={`${
            models.length > 0
              ? "grid grid-cols-3"
              : "flex items-center justify-center"
          } gap-10`}
        >
          {/* Check if models have content */}
          {models.length > 0 ? (
            models.map((data) => {
              return (
                <Link
                  to={`/models/${data.id}`}
                  className="relative rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-lg"
                  key={data.id}
                >
                  <img
                    className="h-96 w-96 rounded-lg opacity-85"
                    src={img1}
                    alt=""
                  />
                  {/* <div className="absolute top-0 font-semibold right-0 flex items-center gap-1 text-xl p-2 bg-white text-black border-t border-r rounded-bl-lg rounded-tr-lg">
                    {data.rating} <IoMdStar className="h-6 w-6" />
                  </div> */}

                  {isNewDataset(data.timestamp) && (
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
              );
            })
          ) : (
            <div className="flex mt-20 items-center justify-center h-96 text-gray-500 text-2xl">
              No models available
            </div>
          )}
        </div>
      ) : (
        // Show loading spinner when loading is true
        <div className="flex flex-col gap-3 justify-center items-center h-96 w-full">
          <ThreeDot variant="bounce" width="50" height="50" color="black" />
          <span>Loading models...</span>
        </div>
      )}
    </div>
  );
};

export default DataGrid;
