
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { ethers, network } from 'hardhat'
import { utils } from 'ethers'

import { TransactionRequest } from '@ethersproject/providers'
import { getProxyAdminFactory } from '@openzeppelin/hardhat-upgrades/dist/utils'

const COMMUNITY_MULTI_SIG = '0x07AED86bda7B36079296C1D94C12d6F48Beeb86C'
const PROXY_ADMIN = '0xad92C566a8856bF298E35505294874F53b297f00'
const STAYS_PROXY = '0xEcfF1da7acD4025c532C04db3B57b454bAB95b4E'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer, alice, bob, carol, ...users } = await getNamedAccounts()

  // --- Account listing ---
  console.log(`Deployer: ${deployer}`)
  console.log('Test users:', users);

  // --- Deploy the contracts ---

  // stays implementation only
  const staysDeploy = await deploy("Stays", {
    from: deployer,
    autoMine: true,
  })

  const proxyAdminFactory = await getProxyAdminFactory(hre)

  const tx: TransactionRequest = {
    to: PROXY_ADMIN,
    value: 0,
    data: proxyAdminFactory.interface.encodeFunctionData('upgrade', [
      STAYS_PROXY,
      staysDeploy.address
    ])
  }

  console.log('Submit the following transaction via the community multi-sig:')
  console.log(tx)

  // if forked testnet, assume multisig isn't set as owner...
  if (network.config.tags.includes('forked') && network.name === 'hardhat') {
    await network.provider.send('hardhat_setBalance', [
      COMMUNITY_MULTI_SIG,
      '0xfffffffffffffffffffffffffffff' // set arbitrarily large amount of ETH in multi-sig
    ])

    await network.provider.send('hardhat_impersonateAccount', [COMMUNITY_MULTI_SIG])

    const signer = await ethers.getSigner(COMMUNITY_MULTI_SIG)

    // --- Manually handle the upgrade
    const signedTx = await signer.populateTransaction(tx)
    const upgradeTx = await signer.sendTransaction(signedTx)
    const receipt = await upgradeTx.wait()

    console.log(receipt)

    // setup test account
  }


}

export default func
func.tags = ["Stays"]
