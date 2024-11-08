const DatasetStorageABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_owner",
        type: "string",
      },
      {
        internalType: "string",
        name: "_cidkey",
        type: "string",
      },
      {
        internalType: "string",
        name: "_quality",
        type: "string",
      },
      {
        internalType: "string",
        name: "_price",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "string",
        name: "_useraddress",
        type: "string",
      },
    ],
    name: "addDataset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "owner",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "timestamp",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "quality",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "useraddress",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "price",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "cidkey",
        type: "string",
      },
    ],
    name: "DatasetAdded",
    type: "event",
  },
  {
    inputs: [],
    name: "datasetCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "datasets",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "owner",
        type: "string",
      },
      {
        internalType: "string",
        name: "timestamp",
        type: "string",
      },
      {
        internalType: "string",
        name: "quality",
        type: "string",
      },
      {
        internalType: "string",
        name: "useraddress",
        type: "string",
      },
      {
        internalType: "string",
        name: "price",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "string",
        name: "cidkey",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "getDataset",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "owner",
        type: "string",
      },
      {
        internalType: "string",
        name: "timestamp",
        type: "string",
      },
      {
        internalType: "string",
        name: "quality",
        type: "string",
      },
      {
        internalType: "string",
        name: "price",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "string",
        name: "cidkey",
        type: "string",
      },
      {
        internalType: "string",
        name: "useraddress",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getDatasetCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export default DatasetStorageABI;
