# Contracts Deployment Setup


## Overview

In this quick tutorial, you'll learn how to deploy your smart contract to the local and live network, using both Hardhat localhost network and  Sepolia testnet. By using Hardhat and the Alchemy platform. The same steps can be applied for deploying to other platforms like Infura, as well as other testnets or mainnets such as Ethereum.

## Deploy To Hardhat Local Network
- **Run the Hardhat Nood**: To deploy the smart contract to a Hardhat local network, start the Hardhat node on port 3000:
  `npx hardhat node --hostname 0.0.0.0 --port 3000`

- **Deploy the martcontract to the local network**: After starting the node, deploy the smart contract using the following command:
```bash
npx hardhat ignition deploy ./ignition/modules/NFTMarketplace.js --network <network-name>
```
Since we are using the Hardhat local network, set the network name to "localhost" as specified in the hardhat.config.js file:
```bash
npx hardhat ignition deploy ./ignition/modules/NFTMarketplace.js --network localhost
```

## Setup Vars In Hardhat Config

- **Set ALCHEMY API KEY**: Begin by setting the necessary variables using the following command. 
`
npx hardhat vars set <variable-name>
`
In this example, the variable name is `ALCHEMY_API_KEY`. Enter the API Key you receive from the **Alchemy App**.

```bash
Output
Path\to\NFT_Marketplace_backend> npx hardhat vars set ALCHEMY_API_KEY
√ Enter value: · ********************************
```
- **Set SEPOLIA PRIVATE KEY**: The `SEPOLIA_PRIVATE_KEY` is the ***private key of the test wallet*** we will use to test our backend. This step is **optional** if you are using it with the **NFT Marketplace front-end**. The process is similar to setting the `ALCHEMY_API_KEY`, but instead, we use `SEPOLIA_PRIVATE_KEY`.

```bash
Output
Path\to\NFT_Marketplace_backend> npx hardhat vars set SEPOLIA_PRIVATE_KEY
√ Enter value: · ****************************************************************
```
You can add multiple wallets for testing by including them in the hardhat.config.js file and setting their variable values in the terminal.

- **Vars**:You can easily update the **Hardhat variables** by editing the vars.json file located at `.\hardhat-nodejs\Config\vars.json.` The file structure will look something like this:

```bash
{
  .....
  "vars": {
    "SEPOLIA_PRIVATE_KEY": {
      "value": ****************************************************************
    },
    "ALCHEMY_API_KEY": {
      "value": ********************************
    },
    "SEPOLIA_SECENDARY_PRIVATE_KEY": {
      "value": ****************************************************************
    },
    "INFURA_API_KEY": {
      "value": ********************************
    }
    ....
  }
}
```


## Deploy Smart Contract To Alchemy Platform


- **Deploy to alchemy platform**: Deploying to the **Alchemy platform** is straightforward if everything is set up correctly. Simply run the following command. 

```bash
npx hardhat ignition deploy ./ignition/modules/NFTMarketplace.js --network <network-name>
```
In this project, we are using the Sepolia testnet, so the network name is "sepolia." However, you can use any other testnet that is similar to the Ethereum mainnet.


## Update Deployment Script

If you add a new smart contract, you need to update the deployment script. Edit the `ignition/modules/deployedSmartContract.js` file. In this example, it's `NFTMarketplace.js`. Alternatively, you can create a new deployment script to deploy the new smart contract to the testnet.

For example, to update the existing script, ensure `ignition/modules/deployedSmartContract.js` includes the new contract details. If creating a new script, add a file like `ignition/modules/NewSmartContract.js` with the necessary deployment logic.

Make sure to configure the new script to match the deployment requirements of your new smart contract.





