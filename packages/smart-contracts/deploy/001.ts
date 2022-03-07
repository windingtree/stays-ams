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
  await deploy("EthRioStays", {
    from: deployer,
    // args: ['TestToken', 'TEST'],
    log: true,
    autoMine: true
  })

}

export default func
func.tags = ["EthRioStays"]
