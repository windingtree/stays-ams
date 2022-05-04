// get statistics for stays
import { ethers } from "ethers";
import { Stays__factory } from "../typechain";
import chalk from 'chalk'

const log = console.log;

const RPC = 'https://poa-xdai.gateway.pokt.network/v1/lb/6255d2a0adb03f003800758d'
const STAYS = '0xEcfF1da7acD4025c532C04db3B57b454bAB95b4E'
const dayZero = 1645567342; // dayZero from the Stays.sol

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
  let bookingsByDay:any = []

  // iterate through all tokens
  for (let i = 1; i <= numTokens; i++) {
    const tokenURI = await stays.tokenURI(i)
    const owner = await stays.ownerOf(i)
    const metadata = JSON.parse(atob(tokenURI.substring(29)))

    const _startDay = parseInt(metadata.attributes[2].value)
    const _startDate = (new Date((dayZero + _startDay * 86400) * 1000)).getUTCDate()
    const _numDays = parseInt(metadata.attributes[3].value)
    const _quantity = parseInt(metadata.attributes[4].value)

    log(chalk.green(metadata.name))
    log(chalk.green(`Owner:      ${owner}`))
    log(chalk.green(`Facility:   ${metadata.attributes[0].value}`))
    log(chalk.green(`Space:      ${metadata.attributes[1].value}`))
    log(chalk.green(`Check-In:   ${_startDate}`))
    log(chalk.green(`# of days:  ${_numDays}`))
    log(chalk.green(`Check-Out:  ${_startDate + _numDays}`) )
    log(chalk.green(`# of rooms: ${_quantity}`))

    for (let x = _startDate; x < _startDate + _numDays; x++) {
      if (typeof(bookingsByDay[x]) === 'undefined') {
        bookingsByDay[x] = _quantity
      } else {
        bookingsByDay[x] = bookingsByDay[x] + _quantity
      }
    }

    numberOfDays += (_numDays * _quantity)

    log("")
  }

  log(chalk.green(`Total roomnights: ${numberOfDays}`))
  log("April")
  bookingsByDay.forEach((e, i) => {
    log(`${i}\t` + '█'.repeat(e) + `\t${e}`)
  });
}

main()