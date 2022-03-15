import 'dotenv/config';
import { HardhatUserConfig } from 'hardhat/types';
import '@nomiclabs/hardhat-ethers';
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
          },
          metadata: {
            bytecodeHash: 'none',
          }
        }
      }
    ]
  },
  networks: {
    local: {
      chainId: 1337,
      url: 'http://127.0.0.1:8545/'
    }
  }
}

export default config
