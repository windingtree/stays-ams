import type { BigNumber, providers } from 'ethers';
import type { IPFS } from '@windingtree/ipfs-apis';
import type { LodgingFacility, Space } from 'stays-data-models';
import type { EthRioStays } from 'stays-smart-contracts';
import type { MethodOverrides, TxHashCallbackFn } from './utils/sendHelper';
import { ethers } from 'ethers';
import { EthRioStaysContract } from 'stays-smart-contracts';
import { regexp }  from '@windingtree/org.id-utils';

// API
import { getLodgingFacilityIds } from './api/getLodgingFacilityIds';
import { getSpaceIds } from './api/getSpaceIds';
import { getAvailability } from './api/getAvailability';
import { getLodgingFacility } from './api/getLodgingFacility';
import { getSpace } from './api/getSpace';

export type KnownProvider =
  | providers.ExternalProvider
  | providers.JsonRpcProvider
  | providers.Web3Provider
  | providers.Provider
  | string;

  export class EthRioContract {
    readonly address: string;
    readonly provider: providers.Provider;
    readonly contract: EthRioStays;
    readonly ipfsNode: IPFS;

    constructor(
      contractAddress: string,
      providerOrUri: KnownProvider,
      ipfsNode: IPFS
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
      this.ipfsNode = ipfsNode;

      this.contract = new ethers.Contract(
        this.address,
        EthRioStaysContract.abi,
        this.provider
      ) as EthRioStays;
    }

    getLodgingFacilityIds(active: boolean): Promise<string[]> {
      return getLodgingFacilityIds(this.contract, active);
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
        this.ipfsNode,
        lodgingFacilityId
      );
    }

    getSpace(spaceId: string): Promise<Space | null> {
      return getSpace(
        this.contract,
        this.ipfsNode,
        spaceId
      );
    }
  }