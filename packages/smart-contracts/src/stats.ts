// get statistics for stays
import { BigNumber, ethers } from "ethers";
import { Stays__factory } from "../typechain";
import chalk from 'chalk'

const log = console.log;

const RPC = 'https://poa-xdai.gateway.pokt.network/v1/lb/6255d2a0adb03f003800758d'
const STAYS = '0xEcfF1da7acD4025c532C04db3B57b454bAB95b4E'

/**
 * Initial statistics reporting for Stays
 */
async function main() {
  const provider = new ethers.providers.JsonRpcProvider(RPC)
  const stays = Stays__factory.connect(STAYS, provider)
  
  // get list of all tokens (ie. number of tokens)
  // NB: only suppors number of tokens limited by MAX_SAFE_INTEGER
  const numTokens = (await stays.totalSupply()).toNumber()

  let numberOfDays = 0

  // iterate through all tokens
  for (let i = 1; i <= numTokens; i++) {
    const tokenURI = await stays.tokenURI(i)
    const owner = await stays.ownerOf(i)
    const metadata = JSON.parse(atob(tokenURI.substring(29)))

    const _numDays = metadata.attributes[3].value
    const _quantity = metadata.attributes[4].value

    log(chalk.black(metadata.name))
    log(chalk.black(`Owner:      ${owner}`))
    log(chalk.black(`Facility:   ${metadata.attributes[0].value}`))
    log(chalk.black(`Space:      ${metadata.attributes[1].value}`))
    log(chalk.black(`Start day:  ${metadata.attributes[2].value}`))
    log(chalk.black(`# of days:  ${_numDays}`))
    log(chalk.black(`# of rooms: ${_quantity}`))

    numberOfDays += (_numDays * _quantity)

    log("")
  }

  log(chalk.black(`Total number of days booked: ${numberOfDays}`))
}

main()