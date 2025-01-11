import Web3 from 'web3';
// Connect to the Ganache local blockchain
const web3  = new Web3(window.ethereum);

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

// Read the ABI from the build/contracts/SimpleStorage.json file
// const contractJson = await fetch('build/contracts/SimpleStorage.json').then(response => response.json());
const abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "data",
        "type": "string"
      }
    ],
    "name": "create",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "remove",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "viewers",
        "type": "address[]"
      }
    ],
    "name": "grantAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "viewers",
        "type": "address[]"
      }
    ],
    "name": "revokeAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "getById",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "data",
            "type": "string"
          },
          {
            "internalType": "address[]",
            "name": "privilege",
            "type": "address[]"
          }
        ],
        "internalType": "struct ReturnValue",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getData",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "data",
            "type": "string"
          },
          {
            "internalType": "address[]",
            "name": "privilege",
            "type": "address[]"
          }
        ],
        "internalType": "struct ReturnValue[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "data",
        "type": "string"
      },
      {
        "internalType": "address[]",
        "name": "viewers",
        "type": "address[]"
      }
    ],
    "name": "createWithViewers",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

const contract = new web3.eth.Contract(abi, contractAddress);

export const storeDataOnBlockchain = async (metadata, fromAddress) => {
    try {
    // console.log(metadata);
    
    const gasPrice = await web3.eth.getGasPrice();

    const receipt = await contract.methods.create(metadata).send({ 
        from: fromAddress,
        gasPrice: gasPrice, 
        gas: 3000000 
    });
    return receipt;
    } catch (error) {
        return null;
    }
}

export const getDataFromBlockchain = async function (fromAddress) {
    try {
        const data = await contract.methods.getData().call({ from: fromAddress });
        const parsedData = data.map(item => {
          // console.log(item)
          if (item.data && item.id) {
            // const [title, about, category, user, key, cid] = item.data.split('\0');                
            // return { _id: item.id ,title, about, category, user, key, cid};
            const parseData = JSON.parse(item.data);
            return {...parseData, id: item.id};
          } 
          else {
            return null;
          }
        });
        return parsedData;
    } catch (error) {
        console.error('Error retrieving data:', error);
        return null;
    }
};
  
export const getDataByIdFromBlockchain = async function (pinId, fromAddress) {
  try {
      const data = await contract.methods.getById(pinId).call({ from: fromAddress });
      const { id: dataId, data: dataString, privilege } = data;
      if (dataString && dataId) {
        // const [title, about, category, user, key, cid] = dataString.split('\0');     
        const parseData = JSON.parse(dataString);
        return {...parseData, id: dataId, privilege};
        // return { _id: dataId ,title, about, category, user, key, cid, privilege};
      } 
  } catch (error) {
      return null;
  }
};

export const grantAccessOnBlockchain = async (id, fromAddress, viewers) => {
  try {
  const gasPrice = await web3.eth.getGasPrice();
  const receipt = await contract.methods.grantAccess(id, viewers).send({ 
      from: fromAddress,
      gasPrice: gasPrice,
      gas: 3000000
  });
  return receipt;
  } catch (error) {
      return null;
  }
}

export const revokeAccessOnBlockchain = async (id, fromAddress, viewers) => {
  try {
  const gasPrice = await web3.eth.getGasPrice();
  const receipt = await contract.methods.revokeAccess(id, viewers).send({ 
      from: fromAddress,
      gasPrice: gasPrice, 
      gas: 3000000
  });
  return receipt;
  } catch (error) {
      return null;
  }
}

export const removeDataOnBlockchain = async (id, fromAddress) => {
  try {
  const gasPrice = await web3.eth.getGasPrice();
  const receipt = await contract.methods.remove(id).send({ 
      from: fromAddress,
      gasPrice: gasPrice,
      gas: 3000000
  });
    return receipt;
  } catch (error) {
      return null;
  }
}