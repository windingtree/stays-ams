import type { EthRioStays } from '../typechain';
import { task } from 'hardhat/config';
import { Web3Storage } from 'web3.storage';
import { Blob } from '@web-std/blob';
import { File } from '@web-std/file';
import { faker } from 'stays-data-models';

const weiEndPad = '000000000000000000';

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

// Deployment task
task('testSetup', 'Deploys the EthRioStays contract')
  .setAction(async (_, hre) => {
    const contractName = 'EthRioStays';
    const contractFactory = await hre.ethers.getContractFactory(contractName);
    console.log(`🚀 Deploying the ${contractName}...`);
    const contract = await contractFactory.deploy() as EthRioStays;
    await contract.deployed();
    console.log(`✅ ${contractName} deployed to:`, contract.address);

    // Init ipfs API
    const apiKey = process.env['WEB3STORAGE_KEY'] as string;
    const ipfsApi = new Web3Storage({ token: apiKey });

    // Generate and upload 3 lodging facilities
    console.log('🚀 Start generation and deployment of lodging facilities profiles...');
    const lodgingFacilities = faker.iterator(3, faker.createFakeLodgingFacility);
    const lfUris = await deployObjectsToIpfs(
      ipfsApi,
      lodgingFacilities,
      'lodgingFacility.json'
    );

    console.log('✅ Lodging facilities profiles uploaded to IPFS:', lfUris);

    // Registering of Lodging facilities
    console.log('🚀 Registering of Lodging facilities...');
    const registeredLf = await Promise.all(
      lfUris.map(
        async uri => {
          const tx = await contract['registerLodgingFacility(string,bool)'](`ipfs://${uri}`, true);
          const receipt = await tx.wait();
          const event = receipt.events?.find(e => e.event == 'LodgingFacilityCreated');
          return event?.args?.facilityId;
        }
      )
    );
    console.log('✅ Registered Lodging Facilities:', registeredLf);

    // Spaces
    console.log('🚀 Adding spaces to Lodging facilities...');
    await Promise.all(
      registeredLf.map(
        async facilityId => {
          const spaces = faker.iterator(3, faker.createFakeSpace);
          const spacesUris = await deployObjectsToIpfs(
            ipfsApi,
            spaces,
            'space.json'
          );
          console.log(
            `✅ Uploaded profiles for spaces of the ${facilityId} lodging facility:`, spacesUris
          );

          return spacesUris.map(
            async uri => {
              const tx = await contract.addSpace(
                facilityId,
                getRandomInt(10, 50),
                `${getRandomInt(35, 70)}${weiEndPad}`,
                true,
                `ipfs://${uri}`
              );
              const receipt = await tx.wait();
              const event = receipt.events?.find(e => e.event == 'SpaceAdded');
              console.log(
                `✅ Added space:`, event?.args
              );

              return event?.args?.spaceId;
            }
          )
        }
      )
    );
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