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
exports.decodeDataUri = exports.fetchDataUri = void 0;
const ethers_1 = require("ethers");
const org_id_utils_1 = require("@windingtree/org.id-utils");
const ipfs_1 = require("../utils/ipfs");
const fetchDataUri = (ipfsNode, uri) => __awaiter(void 0, void 0, void 0, function* () {
    let tokenUriType;
    if (org_id_utils_1.regexp.ipfs.exec(uri)) {
        tokenUriType = 'ipfs';
    }
    else if (org_id_utils_1.regexp.uriHttp.exec(uri)) {
        tokenUriType = 'http';
    }
    let data;
    switch (tokenUriType) {
        case 'ipfs':
            data = yield (0, ipfs_1.ipfsCidResolver)(ipfsNode)(uri.replace('ipfs://', ''));
            break;
        case 'http':
            const response = yield org_id_utils_1.http.request(uri, 'GET');
            try {
                data = JSON.parse(response);
            }
            catch (error) {
                throw new Error(`Unable to parse data from the ${uri}`);
            }
            break;
        default:
            throw new Error('Unknown dataURI type');
    }
    return data;
});
exports.fetchDataUri = fetchDataUri;
const decodeDataUri = (dataUri, parse = false) => {
    const decodedData = new TextDecoder().decode(ethers_1.utils.base64.decode(dataUri.replace(/^data:\w+\/\w+;base64,/, '')));
    return parse ? JSON.parse(decodedData) : decodedData;
};
exports.decodeDataUri = decodeDataUri;
//# sourceMappingURL=dataUri.js.map