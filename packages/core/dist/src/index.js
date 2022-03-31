"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = void 0;
const ethers_1 = require("ethers");
const stays_smart_contracts_1 = require("stays-smart-contracts");
const org_id_utils_1 = require("@windingtree/org.id-utils");
// API
const getLodgingFacilityIds_1 = require("./api/getLodgingFacilityIds");
const getNewAndUpdatedFacilityIds_1 = require("./api/getNewAndUpdatedFacilityIds");
const getLodgingFacilityIdsByOwner_1 = require("./api/getLodgingFacilityIdsByOwner");
const getSpaceIds_1 = require("./api/getSpaceIds");
const getAvailability_1 = require("./api/getAvailability");
const getLodgingFacility_1 = require("./api/getLodgingFacility");
const getSpace_1 = require("./api/getSpace");
const getTokensBySpaceId_1 = require("./api/getTokensBySpaceId");
const registerLodgingFacility_1 = require("./api/registerLodgingFacility");
const addSpace_1 = require("./api/addSpace");
const book_1 = require("./api/book");
const nft_1 = require("./api/nft");
const getDayZero_1 = require("./api/getDayZero");
const checkIn_1 = require("./api/checkIn");
const checkOut_1 = require("./api/checkOut");
__exportStar(require("./types"), exports);
class Contract {
    constructor(contractAddress, providerOrUri, web3Storage) {
        if (org_id_utils_1.regexp.ethereumAddress.exec(contractAddress)) {
            this.address = contractAddress;
        }
        else {
            throw new Error(`Invalid smart contract address: ${contractAddress}`);
        }
        if (typeof providerOrUri === 'string' && providerOrUri !== '') {
            this.provider = new ethers_1.ethers.providers.JsonRpcProvider(providerOrUri);
        }
        else if (typeof providerOrUri === 'object') {
            if (providerOrUri.isMetaMask) {
                // using window.ethereum provided as providerOrUri
                this.provider = new ethers_1.ethers.providers.Web3Provider(providerOrUri);
            }
            else if (typeof providerOrUri.send === 'function') {
                // using raw provider
                this.provider = providerOrUri;
            }
        }
        if (!this.provider) {
            throw new Error(`Unable to initialize provider': ${providerOrUri}`);
        }
        // @todo Implement ipfsNode validity check
        this.web3Storage = web3Storage;
        this.contract = new ethers_1.ethers.Contract(this.address, stays_smart_contracts_1.StaysContract.abi, this.provider);
        // Apply the default Signer
        this.contract = this.contract.connect(this.provider.getSigner());
    }
    getDayZero() {
        return (0, getDayZero_1.getDayZero)(this.contract);
    }
    getLodgingFacilityIds(active) {
        return (0, getLodgingFacilityIds_1.getLodgingFacilityIds)(this.contract, active);
    }
    getLodgingFacilityIdsByOwner(owner) {
        return (0, getLodgingFacilityIdsByOwner_1.getLodgingFacilityIdsByOwner)(this.contract, owner);
    }
    getNewAndUpdatedFacilityIds(fromBlock) {
        return (0, getNewAndUpdatedFacilityIds_1.getNewAndUpdatedFacilityIds)(this.contract, fromBlock);
    }
    getSpaceIds(lodgingFacilityId, active) {
        return (0, getSpaceIds_1.getSpaceIds)(this.contract, lodgingFacilityId, active);
    }
    getAvailability(spaceId, startDay, numberOfDays) {
        return (0, getAvailability_1.getAvailability)(this.contract, spaceId, startDay, numberOfDays);
    }
    getLodgingFacility(lodgingFacilityId) {
        return (0, getLodgingFacility_1.getLodgingFacility)(this.contract, this.web3Storage, lodgingFacilityId);
    }
    getSpace(spaceId) {
        return (0, getSpace_1.getSpace)(this.contract, this.web3Storage, spaceId);
    }
    getTokensOfOwner(owner) {
        return (0, nft_1.getTokensOfOwner)(this.contract, owner);
    }
    getToken(tokenId) {
        return (0, nft_1.getToken)(this.contract, tokenId);
    }
    getTokensBySpaceId(spaceId, state) {
        return (0, getTokensBySpaceId_1.getTokensBySpaceId)(this.contract, spaceId, state);
    }
    registerLodgingFacility(profileData, active, fren, // address
    overrides, transactionHashCb, confirmations) {
        return (0, registerLodgingFacility_1.registerLodgingFacility)(this.contract, this.web3Storage, profileData, active, fren, overrides, transactionHashCb, confirmations);
    }
    addSpace(profileData, lodgingFacilityId, capacity, pricePerNightWei, active, overrides, transactionHashCb, confirmations) {
        return (0, addSpace_1.addSpace)(this.contract, this.web3Storage, profileData, lodgingFacilityId, capacity, pricePerNightWei, active, overrides, transactionHashCb, confirmations);
    }
    book(spaceId, startDay, numberOfDays, quantity, overrides, transactionHashCb, confirmations) {
        return (0, book_1.book)(this.contract, spaceId, startDay, numberOfDays, quantity, overrides, transactionHashCb, confirmations);
    }
    checkIn(tokenId, voucher, overrides, transactionHashCb, confirmations) {
        return (0, checkIn_1.checkIn)(this.contract, tokenId, voucher, overrides, transactionHashCb, confirmations);
    }
    checkOut(tokenId, overrides, transactionHashCb, confirmations) {
        return (0, checkOut_1.checkOut)(this.contract, tokenId, overrides, transactionHashCb, confirmations);
    }
}
exports.Contract = Contract;
//# sourceMappingURL=index.js.map