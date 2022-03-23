import type { Stays } from '../typechain';
import { task } from 'hardhat/config';
import { Web3Storage } from 'web3.storage';
import { Blob } from '@web-std/blob';
import { File } from '@web-std/file';
import { faker } from 'stays-data-models';

const makeFileObject = (obj: {}, name: string) => {
  const blob = new Blob([JSON.stringify(obj)], { type : 'application/json' });
  const files = [
   new File([blob as BlobPart], name)
  ];
  return files;
}

const deployObjectsToIpfs = async (
  ipfsApi: Web3Storage,
  objects: {}[],
  name: string
): Promise<string[]> =>
Promise.all(
  objects.map(
    obj => ipfsApi.put(makeFileObject(obj, name), { wrapWithDirectory: false })
  )
);

const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const setupNewSpace = async (contract: Stays, ipfsApi: Web3Storage, facilityId: string) => {
  console.log('🚀 Start generation and deployment of space profile...');
  const space = faker.createFakeSpace();
  const spacesUris = await deployObjectsToIpfs(
    ipfsApi,
    [space],
    'space.json'
  );
  console.log(
    `✅ Uploaded profiles for spaces of the ${facilityId} lodging facility:`, spacesUris
  );

  console.log('🚀 Start creation of the space...');
  console.log('Params:', {
    facilityId,
    capacity: getRandomInt(10, 50),
    price: space.price,
    active: true,
    uri: `ipfs://${spacesUris[0]}`
  });
  const tx = await contract.addSpace(
    facilityId,
    getRandomInt(10, 50),
    space.price,
    true,
    `ipfs://${spacesUris[0]}`
  );
  const receipt = await tx.wait();
  const event = receipt.events?.find(e => e.event == 'SpaceAdded');
  console.log(
    `✅ Added space:`, event?.args
  );
  console.log('✅ spaceId', event?.args?.spaceId);
};

const setupOneLodgingFacility = async (contract: Stays, ipfsApi: Web3Storage) => {
  console.log('🚀 Start generation and deployment of lodging facility profile...');
  const lodgingFacility = faker.createFakeLodgingFacility();
  const lfUris = await deployObjectsToIpfs(
    ipfsApi,
    [lodgingFacility],
    'lodgingFacility.json'
  );
  console.log('✅ Lodging facilities profiles uploaded to IPFS:', lfUris);

  const lfTx = await contract['registerLodgingFacility(string,bool)'](`ipfs://${lfUris[0]}`, true);
  const receipt = await lfTx.wait();
  const event = receipt.events?.find(e => e.event == 'LodgingFacilityCreated');
  const facilityId = event?.args?.facilityId;
  console.log('✅ Lodging facility Id:', facilityId);

  for (let i=0; i < 3; i++) {
    await setupNewSpace(contract, ipfsApi, facilityId);
  }
};

// Deployment task
task('testSetup', 'Deploys the Stays contract')
  .setAction(async (_, hre) => {
    const contractName = 'Stays';
    const contractFactory = await hre.ethers.getContractFactory(contractName);
    console.log(`🚀 Deploying the ${contractName}...`);
    const contract = await contractFactory.deploy() as Stays;
    await contract.deployed();
    console.log(`✅ ${contractName} deployed to:`, contract.address);
  });

task('addFacility', 'Add ONE lodging facility')
  .addParam('address', 'Contract address')
  .setAction(async (args, hre) => {
    const contractName = 'Stays';
    const contractFactory = await hre.ethers.getContractFactory(contractName);
    const contract = contractFactory.attach(args.address) as Stays;

    // Init ipfs API
    const apiKey = process.env['WEB3STORAGE_KEY'] as string;
    const ipfsApi = new Web3Storage({ token: apiKey });

    await setupOneLodgingFacility(contract, ipfsApi);
  });

task('addSpace', 'Add ONE space to lodging facility')
  .addParam('address', 'Contract address')
  .addParam('facility', 'Facility Id')
  .setAction(async (args, hre) => {
    const contractName = 'Stays';
    const contractFactory = await hre.ethers.getContractFactory(contractName);
    const contract = contractFactory.attach(args.address) as Stays;

    // Init ipfs API
    const apiKey = process.env['WEB3STORAGE_KEY'] as string;
    const ipfsApi = new Web3Storage({ token: apiKey });

    await setupNewSpace(contract, ipfsApi, args.facility);
  });

// task('call', 'Call function')
//   .addParam('address', 'Contract address')
//   .setAction(async (args, hre) => {
//     const contractName = 'EthRioStays';
//     const contractFactory = await hre.ethers.getContractFactory(contractName);
//     console.log(`Deploying the ${contractName}...`);
//     const contract = contractFactory.attach(args.address);
//     console.log(
//       '@@@',
//       await contract.getAllLodgingFacilityIds()
//     );
//   });
