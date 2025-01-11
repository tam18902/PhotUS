# Image and File Sharing Application

This decentralized application (DApp) allows users to upload, share, and manage images or any file types securely. The application integrates blockchain technology and IPFS for distributed storage, ensuring data is secure, transparent, and accessible.

---

## Features
- Upload and share images or other file types with secure and decentralized storage.
- Blockchain technology for immutable and transparent file management.
- Distributed storage system powered by **IPFS**.
- Integrated with MetaMask for blockchain network interaction.
- Modern user interface built with React and Tailwind CSS.

---

## Prerequisites
To build and run the application, you will need:
1. **Node.js**: For package management and development server.
2. **Truffle Suite**: For smart contract development, testing, and deployment.
3. **Ganache**: Simulate a local blockchain network for development.
4. **MetaMask**: Digital wallet for blockchain interactions.
5. **IPFS**: For distributed file storage. Install and configure a Kubo RPC node.
6. **React**: Framework for building the web application.

---

## How to Build and Run

### 1. Setup Environment
1. **Blockchain Configuration**:
   - Install **Truffle Suite** and **Ganache**:
     - Truffle Suite: [Truffle Documentation](https://trufflesuite.com/docs/)
     - Ganache: [Ganache Documentation](https://trufflesuite.com/ganache/)
   - Clone the repository and navigate to the `contracts/` folder.
   - Follow the instructions in the `contracts/README.md` to set up and deploy migrations for the Solidity smart contracts.

2. **IPFS Configuration**:
   - Install and set up an IPFS Kubo node: [Kubo Installation Guide](https://docs.ipfs.tech/install/).
   - Configure the Kubo node with an RPC API endpoint.
   - Ensure the RPC endpoint is accessible to the application by enabling necessary CORS policies.

3. **MetaMask Setup**:
   - Install the **MetaMask** browser extension: [MetaMask Download](https://metamask.io/download.html).
   - Connect MetaMask to your local blockchain network simulated by Ganache.
   - Import the account private key from Ganache into MetaMask to enable blockchain interaction.

### 2. Start the Web Application
1. Navigate to the project’s root directory.
2. Install dependencies:
   ```bash
   npm install

## Demo

![Demo](/public/Demo.mp4)
