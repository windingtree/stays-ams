"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CCContract = void 0;
const ethers_1 = require("ethers");
const token_1 = require("@crypto-cossacks/token");
// Token methods:
// getTokens(cursor: number, count: number, includeMinted: boolean): Promise<TokenData[]>
const getTokenById_1 = require("./api/getTokenById");
const getTokenMetadataById_1 = require("./api/getTokenMetadataById");
const getOwnedTokens_1 = require("./api/getOwnedTokens");
const isTokenMintable_1 = require("./api/isTokenMintable");
const mintToken_1 = require("./api/mintToken");
const isPaused_1 = require("./api/isPaused");
const getPrice_1 = require("./api/getPrice");
const estimateMinting_1 = require("./api/estimateMinting");
const isFounder_1 = require("./api/isFounder");
const getNickName_1 = require("./api/getNickName");
class CCContract {
    constructor(contractAddress, providerOrUri) {
        if (regexp.ethereumAddress.exec(contractAddress)) {
            this.address = contractAddress;
        }
        else {
            throw new Error(`cryptoCossacksContract: Invalid smart contract address: ${contractAddress}`);
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
            throw new Error(`cryptoCossacksContract: Unable to initialize provider': ${providerOrUri}`);
        }
        this.contract = new ethers_1.ethers.Contract(this.address, token_1.CryptoCossacks.abi, this.provider);
    }
    // Returns a token information
    getTokenById(tokenId) {
        return (0, getTokenById_1.getTokenById)(this.contract, tokenId);
    }
    // Returns a token information (not minted token)
    getTokenMetadataById(tokenId) {
        return (0, getTokenMetadataById_1.getTokenMetadataById)(this.contract, tokenId);
    }
    // Check is token mintable
    isTokenMintable(tokenId) {
        return (0, isTokenMintable_1.isTokenMintable)(this.contract, tokenId);
    }
    // Return all the tokens that owned by an address
    getOwnedTokens(ownerAddress) {
        return (0, getOwnedTokens_1.getOwnedTokens)(this.contract, ownerAddress);
    }
    // Mint token
    mintToken(tokenId, overrides, 
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    transactionHashCb, confirmations) {
        return (0, mintToken_1.mintToken)(this.contract, tokenId, overrides, transactionHashCb, confirmations);
    }
    // Check is contract is paused
    isPaused() {
        return (0, isPaused_1.isPaused)(this.contract);
    }
    // Get configured token price
    getPrice() {
        return (0, getPrice_1.getPrice)(this.contract);
    }
    // Estimate minting
    estimateMinting(tokenId) {
        return (0, estimateMinting_1.estimateMinting)(this.contract, tokenId);
    }
    // Check is current account is the founder
    isFounder() {
        return (0, isFounder_1.isFounder)(this.contract);
    }
    getNickName(tokenId) {
        return (0, getNickName_1.getNickName)(this.contract, tokenId);
    }
    ;
}
exports.CCContract = CCContract;
//# sourceMappingURL=index%20copy.js.map