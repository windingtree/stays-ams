"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeContract = void 0;
const stays_core_1 = require("stays-core");
const ipfs_apis_1 = require("@windingtree/ipfs-apis");
async function makeContract() {
    const key = process.env.APP_FILE_WEB3STORAGE_KEY || '';
    try {
        const ipfs = await ipfs_apis_1.utils.startIpfsGateway();
        const web3Storage = new ipfs_apis_1.Web3StorageApi(key, ipfs);
        return new stays_core_1.Contract('0xAD4B90b5053F7382A1313812559E044219BAE523', //todo env
        'https://sokol.poa.network/', web3Storage);
    }
    catch (e) {
        //todo errors logger
    }
}
exports.makeContract = makeContract;
//# sourceMappingURL=helpers.js.map