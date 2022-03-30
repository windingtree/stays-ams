import type { Stays } from 'stays-smart-contracts';
import type { MethodOverrides, TxHashCallbackFn } from '../utils/sendHelper';
import { sendHelper } from '../utils/sendHelper';

// Check out
export const checkOut = async (
  contract: Stays,
  tokenId: string,
  overrides?: MethodOverrides,
  transactionHashCb?: TxHashCallbackFn,
  confirmations = 1
): Promise<void> => {
  overrides = overrides ? overrides : {};

  const receipt = await sendHelper(
    contract,
    'checkOut',
    [
      tokenId
    ],
    undefined, // use already connected signer,
    overrides,
    transactionHashCb,
    confirmations
  );

  const event = receipt.events?.find(e => e.event == 'CheckOut');
  const checkedOutTokenId = event?.args?.tokenId;

  if (!tokenId === checkedOutTokenId.toString()) {
    throw new Error('Unable to find information about checked-out token');
  }
};
