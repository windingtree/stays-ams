import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const COMMUNITY_MULTISIG = '0x07AED86bda7B36079296C1D94C12d6F48Beeb86C'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer, ...users } = await getNamedAccounts()

  // --- Account listing ---
  console.log(`Deployer: ${deployer}`)
  console.log(`Test users: ${users}`)

  // --- Deploy the contracts ---
  const staysDeploy = await deploy("Stays", {
    from: deployer,
    log: true,
    autoMine: true,
    proxy: {
      owner: COMMUNITY_MULTISIG,
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
