import type { providers } from 'ethers';
import type { EthRioStays } from 'stays-smart-contracts';
import type { MethodOverrides, TxHashCallbackFn } from '../utils/sendHelper';
import { BigNumber as BN } from 'ethers';
import { sendHelper } from '../utils/sendHelper';

// Book a space
export const book = async (
  contract: EthRioStays,
  spaceId: string,
  startDay: number,
  numberOfDays: number,
  quantity: number,
  overrides?: MethodOverrides,
  transactionHashCb?: TxHashCallbackFn,
  confirmations = 1
): Promise<string> => {
  overrides = overrides ? overrides : {};

  const space = await contract.getSpaceById(spaceId);
  // value = pricePerNightWei * numberOfDays * quantity
  const value = space.pricePerNightWei
    .mul(BN.from(numberOfDays))
    .mul(BN.from(quantity));

  const receipt = await sendHelper(
    contract,
    'newStay',
    [
      spaceId,
      startDay,
      numberOfDays,
      quantity
    ],
    undefined, // use already connected signer
    {
      ...overrides,
      value
    },
    transactionHashCb,
    confirmations
  );

  const event = receipt.events?.find(e => e.event == 'NewStay');
  const tokenId = event?.args?.tokenId;

  if (!spaceId) {
    throw new Error(`Unable to find "tokenId" in the transaction receipt`);
  }

  return tokenId.toString();
};
