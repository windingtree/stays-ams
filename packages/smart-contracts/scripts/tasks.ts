import { task } from 'hardhat/config';

// Deployment task
task('deploy', 'Deploys the EthRioStays contract')
  .setAction(async (_, hre) => {
    const contractName = 'EthRioStays';
    const contractFactory = await hre.ethers.getContractFactory(contractName);
    console.log(`Deploying the ${contractName}...`);
    const contract = await contractFactory.deploy();
    await contract.deployed();
    console.log(`${contractName} deployed to:`, contract.address);
  });