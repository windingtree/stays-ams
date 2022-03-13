"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthRioContract = void 0;
const ethers_1 = require("ethers");
const stays_smart_contracts_1 = require("stays-smart-contracts");
const org_id_utils_1 = require("@windingtree/org.id-utils");
// API
const getLodgingFacilityIds_1 = require("./api/getLodgingFacilityIds");
const getSpaceIds_1 = require("./api/getSpaceIds");
const getAvailability_1 = require("./api/getAvailability");
const getLodgingFacility_1 = require("./api/getLodgingFacility");
const getSpace_1 = require("./api/getSpace");
const registerLodgingFacility_1 = require("./api/registerLodgingFacility");
const addSpace_1 = require("./api/addSpace");
const book_1 = require("./api/book");
const nft_1 = require("./api/nft");
class EthRioContract {
    constructor(contractAddress, providerOrUri, ipfsNode) {
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
        this.ipfsNode = ipfsNode;
        this.contract = new ethers_1.ethers.Contract(this.address, stays_smart_contracts_1.EthRioStaysContract.abi, this.provider);
    }
    getLodgingFacilityIds(active) {
        return (0, getLodgingFacilityIds_1.getLodgingFacilityIds)(this.contract, active);
    }
    getSpaceIds(lodgingFacilityId, active) {
        return (0, getSpaceIds_1.getSpaceIds)(this.contract, lodgingFacilityId, active);
    }
    getAvailability(spaceId, startDay, numberOfDays) {
        return (0, getAvailability_1.getAvailability)(this.contract, spaceId, startDay, numberOfDays);
    }
    getLodgingFacility(lodgingFacilityId) {
        return (0, getLodgingFacility_1.getLodgingFacility)(this.contract, this.ipfsNode, lodgingFacilityId);
    }
    getSpace(spaceId) {
        return (0, getSpace_1.getSpace)(this.contract, this.ipfsNode, spaceId);
    }
    getTokensOfOwner(owner) {
        return (0, nft_1.getTokensOfOwner)(this.contract, owner);
    }
    getToken(tokenId) {
        return (0, nft_1.getToken)(this.contract, tokenId);
    }
    registerLodgingFacility(profileData, active, fren, // address
    overrides, transactionHashCb, confirmations) {
        return (0, registerLodgingFacility_1.registerLodgingFacility)(this.contract, this.ipfsNode, profileData, active, fren, overrides, transactionHashCb, confirmations);
    }
    addSpace(profileData, lodgingFacilityId, capacity, pricePerNightWei, active, overrides, transactionHashCb, confirmations) {
        return (0, addSpace_1.addSpace)(this.contract, this.ipfsNode, profileData, lodgingFacilityId, capacity, pricePerNightWei, active, overrides, transactionHashCb, confirmations);
    }
    book(spaceId, startDay, numberOfDays, quantity, overrides, transactionHashCb, confirmations) {
        return (0, book_1.book)(this.contract, spaceId, startDay, numberOfDays, quantity, overrides, transactionHashCb, confirmations);
    }
}
exports.EthRioContract = EthRioContract;
//# sourceMappingURL=index.js.map