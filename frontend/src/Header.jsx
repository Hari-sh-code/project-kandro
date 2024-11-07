import React, { useEffect, useState } from "react";
import { VscAccount } from "react-icons/vsc";
import Web3 from "web3";
import { IoMdCloseCircle } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";

const NavBar = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [account, setAccount] = useState("");
    const [copyStatus, setCopyStatus] = useState("Copy");
    // Toggle the slide panel
    const toggleSlide = () => setIsOpen(!isOpen);
  
    // Connect to MetaMask and get the account address
    const connectMetaMask = async () => {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3.eth.getAccounts();
          if (accounts.length > 0) setAccount(accounts[0]);
        } catch (error) {
          console.error("MetaMask connection error:", error);
        }
      } else {
        alert("Please install MetaMask!");
      }
    };
  
    useEffect(() => {
      if (isOpen && !account) {
        connectMetaMask();
      }
    }, [isOpen]);
    const handleCopy = () => {
      navigator.clipboard.writeText(account);
      setCopyStatus("Copied!");
  
      // Reset the copy status after a short delay
      setTimeout(() => setCopyStatus("Copy"), 2000);
    };
  return (
    <div className="p-2 border-b">
      <div className="px-2 flex items-center justify-between">
        <h1 className="font-semibold flex items-end -space-x-1">
          <svg
            className="pb-1"
            width="51"
            height="62"
            viewBox="0 0 112 141"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_87_179)">
              <path d="M623 -206H-523V478H623V-206Z" fill="white" />
              <path
                d="M43.625 39.875C44.542 40.292 45.625 40.583 46.875 40.75C48.208 40.917 49.458 41 50.625 41C52.042 41 53.5 40.958 55 40.875C56.5 40.792 58.333 40.625 60.5 40.375C62.25 40.208 64.417 40 67 39.75C69.583 39.5 72.458 39.167 75.625 38.75C74.458 39.333 73.458 39.958 72.625 40.625C71.792 41.292 71.083 41.958 70.5 42.625C69.833 43.375 69.292 44.125 68.875 44.875C68.292 45.875 67.5 47.625 66.5 50.125C65.583 52.542 64.625 55.25 63.625 58.25C62.708 61.25 61.875 64.292 61.125 67.375C60.458 70.458 60.083 73.083 60 75.25C59.917 77.083 59.833 79.167 59.75 81.5C59.667 83.5 59.583 85.958 59.5 88.875C59.417 91.792 59.333 95.125 59.25 98.875C65.25 94.542 69.875 91.083 73.125 88.5C76.375 85.833 78.75 83.792 80.25 82.375C82 80.792 83.042 79.667 83.375 79C83.292 78.5 83.083 77.958 82.75 77.375C82.333 76.875 81.75 76.292 81 75.625C80.25 74.958 79.125 74.208 77.625 73.375C79.792 73.625 81.667 73.792 83.25 73.875C84.917 73.958 86.333 74.042 87.5 74.125C88.833 74.208 90 74.208 91 74.125C92.083 74.125 93.417 74.083 95 74C97.75 73.917 102 73.792 107.75 73.625C102.167 76.542 97.75 79.042 94.5 81.125C92.667 82.292 91.042 83.375 89.625 84.375C88.208 85.458 86.75 86.583 85.25 87.75C83.917 88.75 82.375 89.917 80.625 91.25C78.958 92.583 77.292 94 75.625 95.5C78.542 100.25 81.083 104.167 83.25 107.25C85.5 110.333 87.375 112.833 88.875 114.75C90.625 117 92.167 118.792 93.5 120.125C94.833 121.375 96.583 122.792 98.75 124.375C100.583 125.792 102.958 127.458 105.875 129.375C108.875 131.208 112.5 133.333 116.75 135.75C114.583 135.333 112.5 135.042 110.5 134.875C108.5 134.792 106.792 134.792 105.375 134.875C103.625 134.958 102.042 135.125 100.625 135.375C99.125 135.708 97.458 136.125 95.625 136.625C94.042 137.042 92.167 137.583 90 138.25C87.917 139 85.625 139.958 83.125 141.125C84.708 139.958 85.875 138.833 86.625 137.75C87.458 136.75 88.042 135.917 88.375 135.25C88.708 134.417 88.833 133.708 88.75 133.125C88.333 132.292 87.375 130.583 85.875 128C84.458 125.833 82.375 122.667 79.625 118.5C76.875 114.333 72.958 108.667 67.875 101.5C67.625 101.583 67.208 101.833 66.625 102.25C66.125 102.667 65.375 103.25 64.375 104C63.375 104.667 62.042 105.667 60.375 107L63.75 128.875C63 129.208 62.167 129.5 61.25 129.75C60.417 130 59.625 130.208 58.875 130.375C57.958 130.625 57.042 130.792 56.125 130.875C55.208 130.958 54.125 131.125 52.875 131.375C51.792 131.542 50.5 131.75 49 132C47.5 132.333 45.792 132.708 43.875 133.125C44.958 132.375 45.833 131.5 46.5 130.5C47.167 129.583 47.708 128.708 48.125 127.875C48.542 126.958 48.917 126 49.25 125C49.417 124.167 49.583 122 49.75 118.5C50 115 50.208 110.833 50.375 106C50.542 101.083 50.667 95.833 50.75 90.25C50.917 84.667 51 79.417 51 74.5C51 69.5 50.958 65.167 50.875 61.5C50.792 57.75 50.625 55.333 50.375 54.25C49.958 52.917 49.458 51.5 48.875 50C48.375 48.667 47.667 47.167 46.75 45.5C45.917 43.75 44.875 41.875 43.625 39.875Z"
                fill="#120707"
              />
              <path
                d="M52.105 55.338C52.105 55.338 46.553 52.705 42.729 51.943C39.001 51.2 33.001 51.455 33.001 51.455C33.001 51.455 35.375 46.776 38.005 44.883C41.18 42.597 49.376 41 49.376 41C49.542 42.238 44.978 44.326 43.615 46.259L40.431 48.766C40.431 48.766 45.777 49.029 49.376 50.11"
                stroke="black"
              />
              <path
                d="M21.193 56.206C23.222 54.632 30.578 54 30.578 54C30.578 54 25.117 55.502 22.404 57.676C20.919 58.866 19.073 61.206 19.073 61.206C19.073 61.206 16.453 63.153 15.592 63.706L4.84399 70.176L11.505 74.588L4.84399 79.147L9.23401 88.265L19.073 92.088L27.702 88.265L29.518 74.588L33 79.147C29.646 86.878 28.444 91.194 27.702 98.853C27.702 98.853 21.019 99.891 16.954 101.941C13.094 103.888 7.41699 109 7.41699 109C7.41699 109 6.24299 105.379 4.84399 103.412C3.34699 101.306 0 98.853 0 98.853L4.84399 90.618L0 79.147L2.422 76.647L0 68.877L19.073 58.853C19.073 58.853 20.139 57.023 21.193 56.206Z"
                stroke="#0A0707"
              />
              <g filter="url(#filter0_i_87_179)">
                <path
                  d="M21.4919 66.9641L22.65 65.0801L20.4579 66.7801L19.642 68.9131L19.588 69.0541L19.4659 69.1421L18.0659 70.1401L22.0809 69.4571L27.0469 67.7251H21.918H21.0229L21.4919 66.9641Z"
                  stroke="#140303"
                />
              </g>
              <path
                d="M36 140C36 140 37.695 133.674 39.332 129.841C41.82 124.017 44.179 121.25 47.591 115.947C49.726 112.629 51.846 111.097 52.952 107.282C54.795 100.923 54.144 94.959 51.503 88.906C49.069 83.327 40.781 78 40.781 78"
                stroke="black"
              />
              <path
                d="M35.243 140L30.021 130.786C30.021 130.786 27.555 127.296 26.395 124.822C25.499 122.913 24.9559 121.821 24.5089 119.752C23.8459 116.682 23.8149 114.762 24.5089 111.7C25.4539 107.527 30.021 102.306 30.021 102.306C30.021 102.306 28.478 107.986 28.57 111.7C28.65 114.897 28.965 116.744 30.021 119.752C30.959 122.423 33.357 126.164 33.357 126.164C33.357 126.164 37.466 121.373 40.32 117.366C42.417 114.421 44.478 112.291 45.977 108.419C48.185 102.717 48.53 98.725 47.283 92.762C46.081 87.018 40.32 78 40.32 78"
                stroke="#0A0707"
              />
              <path
                d="M37 59.032C37 59.032 42.157 56.71 43.224 59.032C43.745 60.165 43.745 61.129 43.224 62.263C42.384 64.089 38.592 63.955 38.592 63.955C38.592 63.955 44.571 66.129 45.974 68.615C46.961 70.365 48 76 48 76"
                stroke="black"
              />
              <path
                d="M37 58.6668C37 58.6668 40.592 54.5378 43.425 55.0428C45.047 55.3318 46.286 55.7698 47.029 57.2488C47.664 58.5118 47.453 59.5228 47.029 60.8728C46.656 62.0608 45.305 63.5518 45.305 63.5518C45.305 63.5518 48.354 65.1918 48.753 67.1758C49.309 69.9508 48.753 75.9998 48.753 75.9998"
                stroke="black"
              />
              <path
                d="M69.98 22.1695C77.266 24.0975 83.459 8.35547 83.459 8.35547L80.514 34.1495C80.514 34.1495 64.574 32.7175 54.702 34.2455C44.061 35.8935 28.185 42.5575 28.185 42.5575L14.822 22.4225C14.822 22.4225 25.126 30.3855 29.103 26.2055C31.656 23.5215 30.637 16.8435 30.637 16.8435C30.637 16.8435 37.624 26.5235 42.432 24.0635C46.098 22.1875 46.434 14.3045 46.434 14.3045C46.434 14.3045 52.029 23.3235 56.748 21.7635C60.864 20.4025 61.738 11.8455 61.738 11.8455C61.738 11.8455 64.993 20.8495 69.98 22.1695Z"
                stroke="black"
              />
              <path
                d="M83.5 8C84.3284 8 85 7.32843 85 6.5C85 5.67157 84.3284 5 83.5 5C82.6716 5 82 5.67157 82 6.5C82 7.32843 82.6716 8 83.5 8Z"
                fill="#1B1010"
              />
              <path
                d="M14.5 23C15.3284 23 16 22.3284 16 21.5C16 20.6716 15.3284 20 14.5 20C13.6716 20 13 20.6716 13 21.5C13 22.3284 13.6716 23 14.5 23Z"
                fill="#1B1010"
              />
            </g>
            <defs>
              <filter
                id="filter0_i_87_179"
                x="17.7756"
                y="64.6855"
                width="9.43591"
                height="9.94727"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="shape"
                  result="effect1_innerShadow_87_179"
                />
              </filter>
              <clipPath id="clip0_87_179">
                <rect width="112" height="141" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span className="">andro</span>
        </h1>

        <VscAccount className="h-10 w-10"onClick={toggleSlide} />
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSlide}
        />
      )}

      {/* Slide-in panel */}
      <div
        className={`fixed top-0 right-0 h-full w-84 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
<div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Account Details</h2>
            <button
              className="text-4xl text-gray-600 hover:text-gray-800"
              onClick={toggleSlide}
              aria-label="Close"
            >
              <IoMdCloseCircle />
            </button>
          </div>
          
          {account ? (
            <div className="mt-4">
              <p className="font-semibold">Address:</p>
              <div className="flex items-center gap-2">
                <p className="break-words text-sm text-gray-700">{account}</p>
                <button
                  onClick={handleCopy}
                  className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
                  aria-label="Copy address"
                >
                  <MdContentCopy /> <span>{copyStatus}</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-4">No account connected</p>
          )}
          
          <button
            className="mt-6 px-4 py-2 bg-gray-800 hover:bg-gray-600 text-white rounded-md w-full"
            onClick={connectMetaMask}
          >
            {account ? "Refresh Account" : "Connect MetaMask"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
