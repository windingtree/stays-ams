import type { Stays } from 'stays-smart-contracts';
import type { MethodOverrides, TxHashCallbackFn } from '../utils/sendHelper';
import { sendHelper } from '../utils/sendHelper';

// Cancel stay token
export const cancel = async (
  contract: Stays,
  tokenId: string,
  overrides?: MethodOverrides,
  transactionHashCb?: TxHashCallbackFn,
  confirmations = 1
): Promise<void> => {
  overrides = overrides ? overrides : {};

  const receipt = await sendHelper(
    contract,
    'cancel',
    [
      tokenId
    ],
    undefined, // use already connected signer,
    overrides,
    transactionHashCb,
    confirmations
  );

  const event = receipt.events?.find(e => e.event == 'Cancel');
  const cancelledTokenId = event?.args?.tokenId;

  if (!tokenId === cancelledTokenId.toString()) {
    throw new Error('Unable to find information about cancelled token');
  }
};
