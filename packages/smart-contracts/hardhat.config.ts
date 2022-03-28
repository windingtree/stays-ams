import 'dotenv/config';
import { HardhatUserConfig } from 'hardhat/types';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
// import '@nomiclabs/hardhat-solhint';
import '@typechain/hardhat';
import 'hardhat-deploy';
import '@nomiclabs/hardhat-etherscan';
// import 'hardhat-gas-reporter';
// import 'solidity-coverage';
import { nodeUrl, accounts, getKey } from './utils/network';

// import './scripts/tasks';
import './scripts/testSetup';

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.7',
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
      hardfork: 'london',
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
      tags: ['local', 'forked'],
    },
    sokol: {
      url: 'https://sokol.poa.network',
      accounts: [process.env.PRIVATE_KEY_SOKOL as string],
      gasPrice: 40000000000,
    },
  },
  // gasReporter: {
  //   currency: 'USD',
  //   gasPrice: 100,
  //   enabled: true,
  //   coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  //   maxMethodDiff: 10
  // },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5'
  },
  etherscan: {
    apiKey: 'abc'
  }
}

export default config
