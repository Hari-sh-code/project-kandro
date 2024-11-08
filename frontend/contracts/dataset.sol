// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import the Strings library for converting uint256 to string
import "@openzeppelin/contracts/utils/Strings.sol";

contract DatasetStorage {
    using Strings for uint256; // Enable the use of Strings.toString for uint256

    struct Dataset {
        uint id;
        string name;
        string owner;
        string timestamp;
        string quality;  // Changed from uint256 to string
        string rating;   // Changed from uint256 to string
        string price;    // Changed from uint256 to string
        string description;
        string cidkey;   // Added cidkey to the struct
    }

    mapping(uint => Dataset) public datasets;
    uint public datasetCount = 0;

    event DatasetAdded(
        uint256 id,
        string name,
        string owner,
        string timestamp,
        string quality,   // Changed from uint256 to string
        string rating,    // Changed from uint256 to string
        string price,     // Changed from uint256 to string
        string description,
        string cidkey     // Added cidkey in the event
    );

    // Refactor to avoid stack too deep issue
    function addDataset(
        string memory _name,
        string memory _owner,
        string memory _cidkey,  // New input for cidkey
        string memory _quality, // Quality now taken as string
        string memory _rating,  // Rating now taken as string
        string memory _price,   // Price now taken as string
        string memory _description
    ) public {
        datasetCount++;

        // Convert block.timestamp to string using Strings.toString()
        string memory timestampString = _getTimestampString();

        // Store the dataset
        _storeDataset(
            datasetCount,
            _name,
            _owner,
            timestampString,
            _quality,
            _rating,
            _price,
            _description,
            _cidkey
        );

        // Emit the event
        _emitDatasetAdded(
            datasetCount,
            _name,
            _owner,
            timestampString,
            _quality,
            _rating,
            _price,
            _description,
            _cidkey
        );
    }

    // Helper function to get timestamp as string
    function _getTimestampString() internal view returns (string memory) {
        return block.timestamp.toString();
    }

    // Helper function to store dataset
    function _storeDataset(
        uint _id,
        string memory _name,
        string memory _owner,
        string memory _timestamp,
        string memory _quality,
        string memory _rating,
        string memory _price,
        string memory _description,
        string memory _cidkey
    ) internal {
        datasets[_id] = Dataset(
            _id,
            _name,
            _owner,
            _timestamp,
            _quality,
            _rating,
            _price,
            _description,
            _cidkey
        );
    }

    // Helper function to emit event
    function _emitDatasetAdded(
        uint _id,
        string memory _name,
        string memory _owner,
        string memory _timestamp,
        string memory _quality,
        string memory _rating,
        string memory _price,
        string memory _description,
        string memory _cidkey
    ) internal {
        emit DatasetAdded(
            _id,
            _name,
            _owner,
            _timestamp,
            _quality,
            _rating,
            _price,
            _description,
            _cidkey
        );
    }

    // Function to retrieve a dataset by id
    function getDataset(uint _id) public view returns (
        uint256 id,
        string memory name,
        string memory owner,
        string memory timestamp,
        string memory quality,   // Return quality as string
        string memory rating,    // Return rating as string
        string memory price,     // Return price as string
        string memory description,
        string memory cidkey     // Return cidkey
    ) {
        Dataset memory dataset = datasets[_id];
        return (
            dataset.id,
            dataset.name,
            dataset.owner,
            dataset.timestamp,
            dataset.quality,   // Return string quality
            dataset.rating,    // Return string rating
            dataset.price,     // Return string price
            dataset.description,
            dataset.cidkey // Return string cidkey
        );
    }

    // Function to get the number of datasets
    function getDatasetCount() public view returns (uint) {
        return datasetCount;
    }
}