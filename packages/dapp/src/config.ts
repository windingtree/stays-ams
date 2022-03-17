export interface NetworkInfo {
  name: string;
  chainId: number;
  address: string;
  blockExplorer: string;
}

export interface NetworkWithRpc extends NetworkInfo {
  rpc: string;
};

export interface ApiKeys {
  [name: string]: string;
}

export interface DappConfig {
  network: NetworkWithRpc;
  apiKeys: ApiKeys;
}

export interface NetworkProviders {
  [chainId: number]: string;
}

if (
  !process.env.REACT_APP_NETWORK_PROVIDER ||
  process.env.REACT_APP_NETWORK_PROVIDER === ''
) {
  throw new Error('REACT_APP_NETWORK_PROVIDER must be provided in the ENV');
}

if (
  !process.env.REACT_APP_NETWORK_ID ||
  process.env.REACT_APP_NETWORK_ID === ''
) {
  throw new Error('REACT_APP_NETWORK_ID must be provided in the ENV');
}

if (
  !process.env.REACT_APP_CONTRACT_ADDRESS ||
  process.env.REACT_APP_CONTRACT_ADDRESS === ''
) {
  throw new Error('REACT_APP_CONTRACT_ADDRESS must be provided in the ENV');
}

if (
  !process.env.REACT_APP_FILE_WEB3STORAGE_KEY ||
  process.env.REACT_APP_FILE_WEB3STORAGE_KEY === ''
) {
  throw new Error('REACT_APP_FILE_WEB3STORAGE_KEY must be provided in the ENV');
}

const allowedNetworks: NetworkInfo[] = [
  {
    name: 'Hardhat Testnet',
    chainId: 1337,
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    blockExplorer: "",
  },
  {
    name: 'Ropsten Testnet',
    chainId: 3,
    address: '',
    blockExplorer: 'https://ropsten.etherscan.io',
  },
  {
    name: 'Rinkeby Testnet',
    chainId: 4,
    address: "",
    blockExplorer: 'https://rinkeby.etherscan.io',
  },
  {
    name: 'Arbitrum Rinkeby',
    chainId: 421611,
    address: '',
    blockExplorer: 'https://rinkeby-explorer.arbitrum.io',
  },
  {
    name: 'Sokol Testnet (xDAI)',
    chainId: 77,
    address: '',
    blockExplorer: 'https://blockscout.com/poa/sokol',
  },
];

const network = allowedNetworks.find(
  n => n.chainId === Number(process.env.REACT_APP_NETWORK_ID)
) as NetworkWithRpc;

if (network === undefined) {
  throw new Error(
    `Network with Id: ${process.env.REACT_APP_NETWORK_ID} is not allowed`
  );
}

network.address = process.env.REACT_APP_CONTRACT_ADDRESS;
network.rpc = process.env.REACT_APP_NETWORK_PROVIDER;

const config: DappConfig = {
  network,
  apiKeys: {
    web3Storage: process.env.REACT_APP_FILE_WEB3STORAGE_KEY
  }
};

export const getNetwork = (): NetworkWithRpc => config.network;

export const getApiKey = (name: string): string => {
  if (!config.apiKeys[name]) {
    throw new Error(`${name} API key not found`);
  }
  return config.apiKeys[name];
};

export default config;
