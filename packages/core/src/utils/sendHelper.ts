import type { EthRioStays } from 'stays-smart-contracts';
import type {
  ContractReceipt,
  Signer,
  BigNumber,
  CallOverrides,
  PayableOverrides
} from 'ethers';
import { BigNumber as BN, Signer as SignerObject } from 'ethers';

export type MethodOverrides = CallOverrides | PayableOverrides;

export type TxHashCallbackFn = (txHash: string) => void;

export const sendHelper = async (
  contract: EthRioStays,
  method: string,
  args: unknown[],
  sender: Signer,
  overrides?: MethodOverrides,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  transactionHashCb?: TxHashCallbackFn,
  confirmations = 1
): Promise<ContractReceipt> => {

  if (sender instanceof SignerObject === false) {
    throw new Error('Invalid transaction signer');
  }

  // Assign sender as a Signer
  const contractWithSigner = contract.connect(sender);

  // Add overrides to arguments
  if (overrides) {
    args.push(overrides);
  }

  // Transaction gas estimation
  const gasAmount: BigNumber = await contractWithSigner
    .estimateGas[method](...args);

  // Validate available gas
  if (overrides && overrides.gasPrice) {
    const balance = await sender.getBalance();

    if (!BN.isBigNumber(overrides.gasPrice)) {
      overrides.gasPrice = BN.from(overrides.gasPrice);
    }

    if (overrides.gasPrice.mul(gasAmount).gt(balance)) {
      throw new Error('Insufficient gas or always failing transaction');
    }
  }

  // Send transaction
  const tx = await contractWithSigner[method](...args);

  if (typeof transactionHashCb === 'function') {
    transactionHashCb(tx.hash);
  }

  // Wait for specified number of tx confirmations
  return await tx.wait(confirmations);
}
