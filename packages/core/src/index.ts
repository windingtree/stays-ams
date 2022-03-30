import type { providers } from 'ethers';
import type { Web3StorageApi } from '@windingtree/ipfs-apis';
import type {
  LodgingFacilityRaw,
  LodgingFacility,
  SpaceRaw,
  Space
} from 'stays-data-models';
import type { Stays, StaysVoucher } from 'stays-smart-contracts';
import type { MethodOverrides, TxHashCallbackFn } from './utils/sendHelper';
import type { StayToken } from './types';
import { ethers } from 'ethers';
import { StaysContract } from 'stays-smart-contracts';
import { regexp }  from '@windingtree/org.id-utils';

// API
import { getLodgingFacilityIds } from './api/getLodgingFacilityIds';
import { getNewAndUpdatedFacilityIds } from './api/getNewAndUpdatedFacilityIds';
import { getSpaceIds } from './api/getSpaceIds';
import { getAvailability } from './api/getAvailability';
import { getLodgingFacility } from './api/getLodgingFacility';
import { getSpace } from './api/getSpace';
import { registerLodgingFacility } from './api/registerLodgingFacility';
import { addSpace } from './api/addSpace';
import { book } from './api/book';
import { getTokensOfOwner, getToken } from './api/nft';
import { getDayZero } from './api/getDayZero';
import { checkIn } from './api/checkIn';
import { checkOut } from './api/checkOut';

export * from './types';

export type KnownProvider =
  | providers.ExternalProvider
  | providers.JsonRpcProvider
  | providers.Web3Provider
  | providers.Provider
  | string;

export class Contract {
  readonly address: string;
  readonly provider: providers.Provider;
  readonly contract: Stays;
  readonly web3Storage: Web3StorageApi;

  constructor(
    contractAddress: string,
    providerOrUri: KnownProvider,
    web3Storage: Web3StorageApi
  ) {
    if (regexp.ethereumAddress.exec(contractAddress)) {
      this.address = contractAddress;
    } else {
      throw new Error(
        `Invalid smart contract address: ${contractAddress}`
      );
    }

    if (typeof providerOrUri === 'string' && providerOrUri !== '') {
      this.provider = new ethers.providers.JsonRpcProvider(providerOrUri);
    } else if (typeof providerOrUri === 'object') {

      if ((providerOrUri as providers.ExternalProvider).isMetaMask) {
        // using window.ethereum provided as providerOrUri
        this.provider = new ethers.providers.Web3Provider(
          providerOrUri as providers.ExternalProvider
        );
      } else if (typeof (providerOrUri as providers.JsonRpcProvider).send === 'function') {
        // using raw provider
        this.provider = providerOrUri as providers.JsonRpcProvider;
      }
    }

    if (!this.provider) {
      throw new Error(
        `Unable to initialize provider': ${providerOrUri}`
      );
    }

    // @todo Implement ipfsNode validity check
    this.web3Storage = web3Storage;

    this.contract = new ethers.Contract(
      this.address,
      StaysContract.abi,
      this.provider
    ) as Stays;

    // Apply the default Signer
    this.contract = this.contract.connect(
      (this.provider as providers.Web3Provider).getSigner()
    );
  }

  getDayZero(): Promise<number> {
    return getDayZero(this.contract);
  }

  getLodgingFacilityIds(active: boolean): Promise<string[]> {
    return getLodgingFacilityIds(this.contract, active);
  }

  getNewAndUpdatedFacilityIds(fromBlock: number): Promise<string[]> {
    return getNewAndUpdatedFacilityIds(this.contract, fromBlock);
  }

  getSpaceIds(lodgingFacilityId: string, active: boolean): Promise<string[]> {
    return getSpaceIds(this.contract, lodgingFacilityId, active);
  }

  getAvailability(
    spaceId: string,
    startDay: number,
    numberOfDays: number
  ): Promise<number[]> {
    return getAvailability(
      this.contract,
      spaceId,
      startDay,
      numberOfDays
    );
  }

  getLodgingFacility(lodgingFacilityId: string): Promise<LodgingFacility | null> {
    return getLodgingFacility(
      this.contract,
      this.web3Storage,
      lodgingFacilityId
    );
  }

  getSpace(spaceId: string): Promise<Space | null> {
    return getSpace(
      this.contract,
      this.web3Storage,
      spaceId
    );
  }

  getTokensOfOwner(owner: string): Promise<string[]> {
    return getTokensOfOwner(this.contract, owner);
  }

  getToken(tokenId: string): Promise<StayToken> {
    return getToken(this.contract, tokenId);
  }

  registerLodgingFacility(
    profileData: LodgingFacilityRaw,
    active?: boolean,
    fren?: string, // address
    overrides?: MethodOverrides,
    transactionHashCb?: TxHashCallbackFn,
    confirmations?: number
  ): Promise<string> {
    return registerLodgingFacility(
      this.contract,
      this.web3Storage,
      profileData,
      active,
      fren,
      overrides,
      transactionHashCb,
      confirmations
    );
  }

  addSpace(
    profileData: SpaceRaw,
    lodgingFacilityId: string,
    capacity: number,
    pricePerNightWei: string,
    active?: boolean,
    overrides?: MethodOverrides,
    transactionHashCb?: TxHashCallbackFn,
    confirmations?: number
  ): Promise<string> {
    return addSpace(
      this.contract,
      this.web3Storage,
      profileData,
      lodgingFacilityId,
      capacity,
      pricePerNightWei,
      active,
      overrides,
      transactionHashCb,
      confirmations
    );
  }

  book(
    spaceId: string,
    startDay: number,
    numberOfDays: number,
    quantity: number,
    overrides?: MethodOverrides,
    transactionHashCb?: TxHashCallbackFn,
    confirmations?: number
  ): Promise<string> {
    return book(
      this.contract,
      spaceId,
      startDay,
      numberOfDays,
      quantity,
      overrides,
      transactionHashCb,
      confirmations
    );
  }

  checkIn(
    tokenId: string,
    voucher: StaysVoucher,
    overrides?: MethodOverrides,
    transactionHashCb?: TxHashCallbackFn,
    confirmations?: number
  ): Promise<void> {
    return checkIn(
      this.contract,
      tokenId,
      voucher,
      overrides,
      transactionHashCb,
      confirmations
    );
  }

  checkOut(
    tokenId: string,
    overrides?: MethodOverrides,
    transactionHashCb?: TxHashCallbackFn,
    confirmations?: number
  ): Promise<void> {
    return checkOut(
      this.contract,
      tokenId,
      overrides,
      transactionHashCb,
      confirmations
    );
  }
}
