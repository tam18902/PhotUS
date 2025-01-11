// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

struct ReturnValue { 
    uint256 id; 
    string data; 
    address[] privilege;
}

contract Storage {
    struct Data { 
        address owner;
        string data;
        uint256 id;
        bool deleted;
        address[] privilege;
    }

    Data[] private database;
    mapping(string => uint256) private data2Id;
    mapping(address => uint256[]) private userAccess;

    modifier onlyOwner(uint256 id, address owner) {
        require(database[id].owner == owner, "Only owner can modify data.");
        require(id < database.length, "Id must be valid.");
        _;
    }

    constructor() {
        // Create an initial item if necessary
        create("404 Not Found Items");
    }
    
    function create(string memory data) public {
        require(data2Id[data] == 0, "CID already exists in storage.");

        uint256 index = database.length;
        address[] memory privilege = new address[](1);
        privilege[0] = msg.sender;

        database.push(Data({
            owner: msg.sender,
            data: data,
            id: index,
            deleted: false,
            privilege: privilege
        }));
        
        data2Id[data] = index;
        userAccess[msg.sender].push(index);
    }

    function remove(uint256 id) public onlyOwner(id, msg.sender) {
        database[id].deleted = true;
    }

    function grantAccess(uint256 id, address[] memory viewers) public onlyOwner(id, msg.sender) {
        for (uint256 i = 0; i < viewers.length; i++) {
            userAccess[viewers[i]].push(id);
            database[id].privilege.push(viewers[i]);
        }
    }

    function revokeAccess(uint256 id, address[] memory viewers) public onlyOwner(id, msg.sender) {
        for (uint256 i = 0; i < viewers.length; i++) {
            uint256[] storage userDataIndexes = userAccess[viewers[i]];
            for (uint256 j = 0; j < userDataIndexes.length; j++) {
                if (userDataIndexes[j] == id) {
                    userDataIndexes[j] = userDataIndexes[userDataIndexes.length - 1];
                    userDataIndexes.pop();
                    break;
                }
            }
            
            // Remove from privilege list in the Data struct
            address[] storage privileges = database[id].privilege;
            for (uint256 k = 0; k < privileges.length; k++) {
                if (privileges[k] == viewers[i]) {
                    privileges[k] = privileges[privileges.length - 1];
                    privileges.pop();
                    break;
                }
            }
        }
    }

    function getById(uint256 id) public view returns(ReturnValue memory) {
        require(id < database.length, "Id is out of bounds.");
        require(!database[id].deleted, "Data has been deleted.");
        for (uint256 index = 0; index < database[id].privilege.length; index++) {
            if (database[id].privilege[index] == msg.sender) {
                Data storage data = database[id];
                return ReturnValue(id, data.data, data.privilege);
            }
        }
        return ReturnValue(0, "Data not found or has been deleted", new address[](0));
    }

    function getData() public view returns (ReturnValue[] memory) {
        uint256[] memory userIndexes = userAccess[msg.sender];
        ReturnValue[] memory list = new ReturnValue[](userIndexes.length);

        for (uint256 i = 0; i < userIndexes.length; i++) {
            uint256 index = userIndexes[i];
            if (index < database.length && !database[index].deleted) {
                list[i] = ReturnValue(index, database[index].data, database[index].privilege);
            } else {
                // Optionally handle deleted data differently or skip it
                list[i] = ReturnValue(0, "Data not found or has been deleted", new address[](0));
            }
        }
        return list;
    }

    function createWithViewers(string memory data, address[] memory viewers) public returns (uint256) {
        create(data);
        uint256 index = data2Id[data];
        for (uint256 i = 0; i < viewers.length; i++) {
            userAccess[viewers[i]].push(index);
            database[index].privilege.push(viewers[i]);
        }
        return index;
    }
}
