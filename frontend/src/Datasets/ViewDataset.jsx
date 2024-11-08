import React, { useContext } from "react";
import img1 from "../assets/iconify.png";
import { useParams, useNavigate } from "react-router-dom";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import DataContext from "../Context/DataContext";
import { FaEthereum } from "react-icons/fa";
import { IoMdStar } from "react-icons/io";

// Helper function to get today's date in IST (Indian Standard Time)
const getTodayInIST = () => {
  const today = new Date(); // Get current date
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5 hours 30 minutes (in milliseconds)
  const istDate = new Date(today.getTime() + istOffset); // Apply IST offset

  return istDate;
};

const ViewDataset = () => {
  const { datasets } = useContext(DataContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const dataset = datasets.find((data) => data.id === id);

  if (!dataset) {
    return <p>Dataset not found!</p>;
  }

  // Function to determine the quality scale style
  const getQualityScaleColor = (quality) => {
    if (quality >= 90) {
      return "bg-green-500"; // High quality
    } else if (quality >= 75) {
      return "bg-yellow-500"; // Medium quality
    } else {
      return "bg-red-500"; // Low quality
    }
  };

  // Use today's date in IST
  const timestampInIST = getTodayInIST();
  const formattedTimestamp = timestampInIST.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  return (
    <div className="bg-gray-50 p-8 basis-full">
      <div className="flex items-center mb-4">
        <button
          className="text-gray-700 hover:text-gray-900"
          onClick={() => navigate(-1)}
        >
          <IoArrowBackCircleSharp className="text-3xl mr-2" />
        </button>
        <h2 className="text-3xl font-semibold text-gray-800">{dataset.name}</h2>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex gap-6">
          <img
            src={img1}
            alt={dataset.name}
            className="w-1/3 h-96 object-cover rounded-lg"
          />
          <div className="flex flex-col justify-between w-2/3">
            {/* Description Header */}
            <div className="mt-4">
              <h3 className="text-xl font-semibold">Description</h3>
              <p className="text-lg mt-2">{dataset.description}</p>
            </div>

            {/* Quality Score and Scale */}
            <div className="mt-4">
              <h4 className="text-xl font-semibold">Quality Score</h4>
              <div className="flex items-center mt-2">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getQualityScaleColor(
                      dataset.quality
                    )}`}
                    style={{ width: `${dataset.quality}%` }} // Set width based on quality
                  />
                </div>
                <span className="ml-2 text-gray-700">{dataset.quality}%</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-xl font-semibold">
                    Owner: {dataset.owner}
                  </h3>
                  <p className="text-lg mt-3">Quality: {dataset.quality}%</p>
                </div>
                <div>
                  <p className="text-lg flex items-center">
                    <IoMdStar className="h-6 w-6 " />
                    {dataset.rating}
                  </p>
                  <h3 className="text-2xl mt-3 font-semibold flex items-center justify-center">
                    <FaEthereum />
                    {`${dataset.price} Gwei ETH`}
                  </h3>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg">
                  <strong>Uploaded on:</strong> {formattedTimestamp.slice(0, 9)}
                </p>
                <button className="bg-black text-white px-3 py-1 mt-4 pb-2 text-2xl rounded-full">
                  Buy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDataset;
