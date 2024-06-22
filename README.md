# Blockchain integrated backend architecture


## Overview

Blockchain integrated backend is the Hybrid backend of the NFT Marketplace decentralized application (dApp) designed to create a cost-efficient and secure marketplace for Non-Fungible Tokens (NFTs). This project integrates both centralized and decentralized backends to optimize cost without compromising security. The smart contracts used in this project are developed with a focus on cost efficiency while ensuring the security of the marketplace. Additionally, this project serves as an educational resource for anyone interested in learning about building dApps and NFT marketplaces.

## Features

- **Decentralized and Centralized Backend**: Combines the strengths of both decentralized and centralized systems to balance cost and performance.
- **Cost-Efficient Smart Contracts**: Designed to minimize gas fees and other costs associated with blockchain transactions.
- **Secure Transactions**: Emphasis on maintaining the security and integrity of the NFT store.
- **Technology Stack**: Utilizes Node.js with Express for the backend, and various databases, including MongoDB, to manage and store data efficiently.

## Technology Stack

- **Decentralized Backend (Blockchain)**: Smart contracts developed using Hardhat and OpenZeppelin, deployed on a blockchain platform
- **Centralized Backend**: Node.js, Express, Graphql, Ethers.js, and more...
- **InterPlanetary File System**: This project leverages Pinata for storing and retrieving media on IPFS, enhancing its decentralized architecture. Additionally, it’s designed to facilitate a smooth transition to a fully serverless backend. However, you have the option to modify the project to store all data on a central server instead of IPFS
- **Databases**: This project is initially designed to work seamlessly with `MongoDB` by default. However, it can easily be adapted to integrate with other centralized or decentralized database solutions

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/AnasElii/blockchain-integrated-backend-architecture.git
   cd blockchain-integrated-backend-architecture
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - Create a `.env` file in the root directory.
   - add `MONGODB_URI` to hold the MONGODB URI
   - add the `COUNTERS_CONTRACT_ADDRESS` to hold the Counters address
   - add the `NFT_MARKETPLACE_CONTRACT_ADDRESS` to hold the NFT Marketplace address
   - add `PORT` with the desired port value as example `4000`. If you need another value you need to update it in the mintNFT API
   -  add `ALCHEMY_API_KEY` to hold the Alchemy API key of the project or if you are using Infura use `INFURA_API_KEY`
   - Visit `Pinata Cloud` to sign up for a new free account.
   - add the `PINATA_JWT_TOKEN` and `NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS` fields
   - Add necessary configuration settings (database credentials, blockchain network settings, etc.).
  
4. **Run the Hardhat Nood**
   If you are going to deploy the smart contract to a hardhat local network
   deploy it in the port 3000
   `npx hardhat node --hostname 0.0.0.0 --port 3000`

1. **Run the Application**
   ```bash
   node ./index.js
   ```

## Usage

1. **Deploy Smart Contracts**
  Follow the instructions in the `contracts/` directory to deploy smart contracts using Hardhat and OpenZeppelin to your preferred blockchain network.
  

1. **Start the Backend Server**
   Ensure your PHP server is configured correctly and running.


1. **Access the Marketplace**
   - Open your browser and navigate to `http://localhost:3001` to start using the NFT Marketplace.

## Educational Resource

This project is designed to be an educational resource. Whether you are a beginner or an experienced developer, you can use this project as a starting point to learn about building decentralized applications and NFT marketplaces.

## Contributing

We welcome contributions to enhance the NFT Marketplace. To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request to the `main` branch.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Contact

For any questions or feedback, please open an issue on GitHub or reach out to us directly.

---

We hope you enjoy using the NFT Marketplace! If you have any suggestions or encounter any issues, please don't hesitate to let us know.
