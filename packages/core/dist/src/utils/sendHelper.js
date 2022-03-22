"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendHelper = void 0;
const ethers_1 = require("ethers");
const sendHelper = (contract, method, args, sender, overrides, 
// eslint-disable-next-line @typescript-eslint/no-empty-function
transactionHashCb, confirmations = 1) => __awaiter(void 0, void 0, void 0, function* () {
    if (sender &&
        (sender instanceof ethers_1.Signer === false ||
            sender instanceof ethers_1.providers.JsonRpcSigner === false)) {
        throw new Error('Invalid transaction signer');
    }
    // Assign sender as a Signer
    const contractWithSigner = sender ? contract.connect(sender) : contract;
    // Add overrides to arguments
    if (overrides) {
        args.push(overrides);
    }
    // Transaction gas estimation
    const gasAmount = yield contractWithSigner
        .estimateGas[method](...args);
    // Validate available gas
    if (overrides && overrides.gasPrice) {
        const balance = yield contract.provider
            .getSigner()
            .getBalance();
        if (!ethers_1.BigNumber.isBigNumber(overrides.gasPrice)) {
            overrides.gasPrice = ethers_1.BigNumber.from(overrides.gasPrice);
        }
        if (overrides.gasPrice.mul(gasAmount).gt(balance)) {
            throw new Error('Insufficient gas or always failing transaction');
        }
    }
    // Send transaction
    const tx = yield contractWithSigner[method](...args);
    if (typeof transactionHashCb === 'function') {
        transactionHashCb(tx.hash);
    }
    // Wait for specified number of tx confirmations
    return yield tx.wait(confirmations);
});
exports.sendHelper = sendHelper;
//# sourceMappingURL=sendHelper.js.map