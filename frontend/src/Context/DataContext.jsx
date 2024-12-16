import { createContext, useState, useEffect } from "react";
import Web3 from "web3";
import DatasetStorageABI from "./DatasetStorageABI";

const web3 = new Web3(window.ethereum); // Connect to Ethereum using MetaMask
const contractAddress = import.meta.env.VITE_contractAddress; // Replace with your contract's address

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [filter, setFilter] = useState(0); // 0: All, 1: Last 2 Days, 2: Highly Rated, 3: High Quality
  const [searchVal, setSearchVal] = useState("");
  const [datasets, setDatasets] = useState([]);
  const [filteredDatasets, setFilteredDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to convert timestamp to IST (Indian Standard Time)
  const convertToIST = (timestamp) => {
    const timestampNumber = parseInt(timestamp, 10); // Convert the string to a number
    if (isNaN(timestampNumber)) {
      console.error("Invalid timestamp:", timestamp);
      return new Date(); // Return the current date if timestamp is invalid
    }
    const date = new Date(timestampNumber * 1000); // Convert to milliseconds if in seconds
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5 hours 30 minutes (in milliseconds)
    const istDate = new Date(date.getTime() + istOffset); // Apply IST offset

    return istDate;
  };

  // Fetch datasets from the smart contract when the component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        const contract = new web3.eth.Contract(
          DatasetStorageABI,
          contractAddress
        );
        const datasetCount = await contract.methods.getDatasetCount().call();
        const loadedDatasets = [];

        for (let i = 1; i <= datasetCount; i++) {
          const dataset = await contract.methods.getDataset(i).call();

          // Convert the timestamp to IST before storing it in the dataset
          const timestampInIST = convertToIST(dataset.timestamp);
          const dateOnly = timestampInIST.toLocaleDateString("en-IN", {
            timeZone: "Asia/Kolkata",
          });

          loadedDatasets.push({
            id: dataset.id.toString(), // Convert BigNumber to string
            name: dataset.name,
            owner: dataset.owner,
            timestamp: timestampInIST, // Store the full timestamp to sort later
            timestampString: dateOnly, // Only include the date part
            quality: dataset.quality.toString(),
            useraddress: dataset.useraddress, // Make sure rating is a number
            price: parseFloat(dataset.price.toString()), // Make sure price is a number
            coverImg: dataset.coverImg,
            description: dataset.description,
            cidkey: dataset.cidkey, // Include cidkey
          });
        }
        setDatasets(loadedDatasets);
      } catch (error) {
        console.error("Error fetching data from the blockchain:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Apply filter and search logic
  useEffect(() => {
    const applyFilter = () => {
      let result = [...datasets];

      // Apply filter conditions based on the selected filter
      if (filter === 1) {
        const twoDaysAgo = new Date();
        twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);
        result = result.filter(
          (dataset) => new Date(dataset.timestamp) >= twoDaysAgo
        );
      }

      // Sort datasets by timestamp, keep the newly uploaded first
      result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      if (filter === 2) {
        // Sort remaining datasets by quality in descending order
        result = result.sort((a, b) => b.quality - a.quality);
      }

      // Apply search filter
      if (searchVal.trim() !== "") {
        result = result.filter(
          (dataset) =>
            dataset.name.toLowerCase().includes(searchVal.toLowerCase()) ||
            dataset.owner.toLowerCase().includes(searchVal.toLowerCase())
        );
      }

      setFilteredDatasets(result);
    };

    applyFilter();
  }, [datasets, filter, searchVal]);

  const handleFilter = (val) => {
    setFilter(val);
  };

  return (
    <DataContext.Provider
      value={{
        filter,
        handleFilter,
        datasets: filteredDatasets,
        setSearchVal,
        loading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
