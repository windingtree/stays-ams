import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer, ...users } = await getNamedAccounts()

  // --- Account listing ---
  console.log(`Deployer: ${deployer}`)
  console.log(`Test users: ${users}`)

  // --- Deploy the contracts ---
  await deploy("Stays", {
    from: deployer,
    log: true,
    autoMine: true,
    proxy: {
      proxyContract: 'OpenZeppelinTransparentProxy',
      execute: {
        init: {
          methodName: 'initialize',
          args: []
        }  
      }
    },
  })

}

export default func
func.tags = ["Stays"]
