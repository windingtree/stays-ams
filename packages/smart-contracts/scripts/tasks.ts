import type { Stays } from '../typechain';
import { task } from 'hardhat/config';

// Deployment task
task('deploy', 'Deploys the Stays contract')
  .setAction(async (_, hre) => {
    const contractName = 'Stays';
    const contractFactory = await hre.ethers.getContractFactory(contractName);
    console.log(`🚀 Deploying the ${contractName}...`);
    const contract = await contractFactory.deploy() as Stays;
    await contract.deployed();
    console.log(`✅ ${contractName} deployed to:`, contract.address);
  });
