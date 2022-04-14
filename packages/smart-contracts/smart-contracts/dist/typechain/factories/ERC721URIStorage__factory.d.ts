import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ERC721URIStorage, ERC721URIStorageInterface } from "../ERC721URIStorage";
export declare class ERC721URIStorage__factory {
    static readonly abi: ({
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
        outputs?: undefined;
        stateMutability?: undefined;
    } | {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
    })[];
    static createInterface(): ERC721URIStorageInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): ERC721URIStorage;
}
