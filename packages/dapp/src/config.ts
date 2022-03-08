export interface NetworkInfo {
  name: string;
  chainId: number;
  address: string;
  blockExplorer: string;
}

export interface NetworkWithRpc extends NetworkInfo {
  rpc: string;
};

export interface Networks {
  [chainId: number]: NetworkWithRpc;
}

export interface ApiKeys {
  [name: string]: string;
}

export interface DappConfig {
  networks: Networks;
  apiKeys: ApiKeys;
}

export interface NetworkProviders {
  [chainId: number]: string;
}

if (
  !process.env.REACT_APP_NETWORK_PROVIDERS ||
  process.env.REACT_APP_NETWORK_PROVIDERS === ''
) {
  throw new Error('REACT_APP_NETWORK_PROVIDERS must be provided in the ENV');
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
    chainId: 331337,
    address: '',
    blockExplorer: ''
  },
  {
    name: 'Ropsten Testnet',
    chainId: 3,
    address: '',
    blockExplorer: 'https://ropsten.etherscan.io'
  },
  {
    name: 'Rinkeby Testnet',
    chainId: 4,
    address: '',
    blockExplorer: 'https://rinkeby.etherscan.io'
  },
  {
    name: 'Arbitrum Rinkeby',
    chainId: 421611,
    address: '',
    blockExplorer: 'https://rinkeby-explorer.arbitrum.io'
  },
  {
    name: 'Sokol Testnet (xDAI)',
    chainId: 77,
    address: '',
    blockExplorer: 'https://blockscout.com/poa/sokol'
  },
];

let networks: Networks;

try {
  const providers = JSON.parse(process.env.REACT_APP_NETWORK_PROVIDERS) as NetworkProviders;
  networks = allowedNetworks
    .map(
      (n: NetworkInfo): NetworkWithRpc =>
        ({
          ...n,
          rpc: providers[n.chainId] || ''
        })
    )
    .reduce(
      (a: Networks, v: NetworkWithRpc) => ({
        ...a,
        [v.chainId]: v
      }),
      {}
    );
} catch (_) {
  throw new Error('Unable to parse networks providers configuration');
}

// All networks must have RPC configured
Object
  .entries(networks)
  .forEach((n: [string, NetworkWithRpc]) => {
  if (!n[1].rpc || n[1].rpc === '') {
    throw new Error(`RPC URI not found for the ${n[1].name}`);
  }
});

const config: DappConfig = {
  networks,
  apiKeys: {
    web3Storage: process.env.REACT_APP_FILE_WEB3STORAGE_KEY
  }
};

export const getNetworks = (): Networks => config.networks;

export const getNetworksIds = (): number[] => Object
  .keys(config.networks)
  .map(chainId => Number(chainId));

export const getNetworksNames = (): string[] => Object
  .entries(config.networks)
  .map((n) => n[1].name);

export const getNetworkByChainId = (chainId: number | string) => {
  const network = config.networks[Number(chainId)];
  if (network === undefined) {
    throw new Error(`Network with chainId ${chainId} is not found`);
  }
  return network;
};

export const getNetworksRpcs = (): NetworkProviders => Object
  .entries(config.networks)
  .reduce(
    (a: NetworkProviders, v: [string, NetworkWithRpc]) => ({
      ...a,
      [Number(v[0])]: v[1].rpc
    }),
    {}
  );

export const getApiKey = (name: string): string => {
  if (!config.apiKeys[name]) {
    throw new Error(`${name} API key not found`);
  }
  return config.apiKeys[name];
};

export default config;
