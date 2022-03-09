import "dotenv/config"

import { HardhatUserConfig } from "hardhat/types"

import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-solhint"
import "@typechain/hardhat"
import "hardhat-deploy"
import "hardhat-gas-reporter"
import "solidity-coverage"
import { nodeUrl, accounts, getKey } from "./utils/network"

import './scripts/tasks';
import './scripts/testSetup';

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  namedAccounts: {
    deployer: 0,
    alice: 1,
    bob: 2,
    carlos: 3,
  },
  networks: {
    hardhat: {
      // process.env.HARDHAT_FORK will specify the network that the fork is made from.
      // this line ensure the use of the corresponding accounts
      accounts: accounts(process.env.HARDHAT_FORK),
      hardfork: "london",
      // gasPrice: 11000000000,
      forking: process.env.HARDHAT_FORK
        ? {
          // TODO once PR merged : network: process.env.HARDHAT_FORK,
          url: nodeUrl(process.env.HARDHAT_FORK),
          blockNumber: process.env.HARDHAT_FORK_NUMBER
            ? parseInt(process.env.HARDHAT_FORK_NUMBER)
            : undefined
        }
        : undefined,
      saveDeployments: true,
      tags: ["local", "forked"],
    },
    localhost: {
      chainId: 1337,
      url: nodeUrl("localhost"),
      accounts: accounts(),
      saveDeployments: true,
      tags: ["local"]
    },
    staging: {
      url: nodeUrl("rinkeby"),
      accounts: accounts("rinkeby"),
      tags: ["staging"]
    },
    production: {
      url: nodeUrl("mainnet"),
      accounts: accounts("mainnet"),
      tags: ["production"]
    },
    mainnet: {
      url: nodeUrl("mainnet"),
      accounts: accounts("mainnet"),
      tags: ["production"]
    },
    rinkeby: {
      url: nodeUrl("rinkeby"),
      accounts: [ getKey("rinkeby") ],
      tags: ["staging"]
    },
    kovan: {
      url: nodeUrl("kovan"),
      accounts: accounts("kovan"),
      tags: ["staging"]
    },
    goerli: {
      url: nodeUrl("goerli"),
      accounts: accounts("goerli"),
      tags: ["staging"]
    },
    arbitrum_mainnet: {
      url: nodeUrl("arbitrum_mainnet"),
      accounts: accounts("arbitrum_mainnet"),
      tags: ["production", "arbitrum"],
      timeout: 60000,
      loggingEnabled: true,
      gasPrice: 2000000000 // ram to 1 gwei
    },
    arbitrum_rinkeby: {
      url: nodeUrl("arbitrum_rinkeby"),
      accounts: accounts("arbitrum_rinkeby"),
      tags: ["staging", "arbitrum"]
    }
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 100,
    enabled: true,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    maxMethodDiff: 10
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5"
  }
}

export default config
