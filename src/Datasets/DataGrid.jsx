import img1 from "../assets/iconify.png";
import { IoMdStar } from "react-icons/io";
import { FaEthereum } from "react-icons/fa";

const DataGrid = () => {
  return (
    <div className="mt-20 flex justify-center">
      <div className="grid grid-cols-3 gap-10">
        <div className="relative rounded-lg">
          <img className="h-96 w-96 rounded-lg opacity-75" src={img1} alt="" />
          <div className="absolute top-0 right-0 flex items-center gap-1 text-xl p-2 bg-white text-black border-t border-r rounded-bl-lg rounded-tr-lg">
            4.9 <IoMdStar className="h-6 w-6" />
          </div>
          <div className="absolute -bottom-1 rounded-t-3xl rounded-b-lg w-full border bg-white p-3">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <h3 className="text-3xl font-semibold">Hospital Dataset</h3>
                <div>By Sabeshragav</div>
              </div>
              <div className="flex items-center">
                <FaEthereum /> 3.4 Gwei ETH
              </div>
            </div>
          </div>
        </div>
        <div className="relative rounded-lg">
          <img className="h-96 w-96 rounded-lg opacity-75" src={img1} alt="" />
          <div className="absolute top-0 right-0 flex items-center gap-1 text-xl p-2 bg-white text-black border-t border-r rounded-bl-lg rounded-tr-lg">
            4.9 <IoMdStar className="h-6 w-6" />
          </div>
          <div className="absolute -bottom-1 rounded-t-3xl rounded-b-lg w-full border bg-white p-3">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <h3 className="text-3xl font-semibold">Hospital Dataset</h3>
                <div>By Sabeshragav</div>
              </div>
              <div className="flex items-center">
                <FaEthereum /> 3.4 Gwei ETH
              </div>
            </div>
          </div>
        </div>
        <div className="relative rounded-lg">
          <img className="h-96 w-96 rounded-lg opacity-75" src={img1} alt="" />
          <div className="absolute top-0 right-0 flex items-center gap-1 text-xl p-2 bg-white text-black border-t border-r rounded-bl-lg rounded-tr-lg">
            4.9 <IoMdStar className="h-6 w-6" />
          </div>
          <div className="absolute -bottom-1 rounded-t-3xl rounded-b-lg w-full border bg-white p-3">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <h3 className="text-3xl font-semibold">Hospital Dataset</h3>
                <div>By Sabeshragav</div>
              </div>
              <div className="flex items-center">
                <FaEthereum /> 3.4 Gwei ETH
              </div>
            </div>
          </div>
        </div>
        <div className="relative rounded-lg">
          <img className="h-96 w-96 rounded-lg opacity-75" src={img1} alt="" />
          <div className="absolute top-0 right-0 flex items-center gap-1 text-xl p-2 bg-white text-black border-t border-r rounded-bl-lg rounded-tr-lg">
            4.9 <IoMdStar className="h-6 w-6" />
          </div>
          <div className="absolute -bottom-1 rounded-t-3xl rounded-b-lg w-full border bg-white p-3">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <h3 className="text-3xl font-semibold">Hospital Dataset</h3>
                <div>By Sabeshragav</div>
              </div>
              <div className="flex items-center">
                <FaEthereum /> 3.4 Gwei ETH
              </div>
            </div>
          </div>
        </div>
        <div className="relative rounded-lg">
          <img className="h-96 w-96 rounded-lg opacity-75" src={img1} alt="" />
          <div className="absolute top-0 right-0 flex items-center gap-1 text-xl p-2 bg-white text-black border-t border-r rounded-bl-lg rounded-tr-lg">
            4.9 <IoMdStar className="h-6 w-6" />
          </div>
          <div className="absolute -bottom-1 rounded-t-3xl rounded-b-lg w-full border bg-white p-3">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <h3 className="text-3xl font-semibold">
                  Hospital Datase tsadasdasdasdasd
                </h3>
                <div>By Sabeshragavdasdasddasd</div>
              </div>
              <div className="flex items-center">
                <FaEthereum /> 3.4 Gwei ETH
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataGrid;
