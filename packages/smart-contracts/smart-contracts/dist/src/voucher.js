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
exports.createVoucher = void 0;
const createVoucher = (signer, from, to, tokenId, verifyingContract, chainId) => __awaiter(void 0, void 0, void 0, function* () {
    const voucher = {
        from,
        to,
        tokenId
    };
    const domain = {
        name: 'Stay Amsterdam',
        version: '1',
        chainId,
        verifyingContract
    };
    const types = {
        Voucher: [
            {
                name: 'from',
                type: 'address'
            },
            {
                name: 'to',
                type: 'address'
            },
            {
                name: 'tokenId',
                type: 'uint256'
            }
        ]
    };
    const signature = yield signer._signTypedData(domain, types, voucher);
    return Object.assign(Object.assign({}, voucher), { signature });
});
exports.createVoucher = createVoucher;
//# sourceMappingURL=voucher.js.map