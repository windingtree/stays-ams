import type { Stays, StaysVoucher } from 'stays-smart-contracts';
import type { MethodOverrides, TxHashCallbackFn } from '../utils/sendHelper';
import { sendHelper } from '../utils/sendHelper';

// Check in
export const checkIn = async (
  contract: Stays,
  tokenId: string,
  voucher: StaysVoucher,
  overrides?: MethodOverrides,
  transactionHashCb?: TxHashCallbackFn,
  confirmations = 1
): Promise<void> => {
  overrides = overrides ? overrides : {};

  const receipt = await sendHelper(
    contract,
    'checkIn',
    [
      tokenId,
      voucher
    ],
    undefined, // use already connected signer,
    overrides,
    transactionHashCb,
    confirmations
  );

  const event = receipt.events?.find(e => e.event == 'CheckIn');
  const checkedInTokenId = event?.args?.tokenId;

  if (!tokenId === checkedInTokenId.toString()) {
    throw new Error('Unable to find information about checked-in token');
  }
};
