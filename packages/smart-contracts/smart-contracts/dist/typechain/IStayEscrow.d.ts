import { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";
export interface IStayEscrowInterface extends utils.Interface {
    contractName: "IStayEscrow";
    functions: {
        "deposit(address,bytes32,uint256)": FunctionFragment;
        "depositOf(address,bytes32,uint256)": FunctionFragment;
        "depositState(uint256)": FunctionFragment;
    };
    encodeFunctionData(functionFragment: "deposit", values: [string, BytesLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "depositOf", values: [string, BytesLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "depositState", values: [BigNumberish]): string;
    decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "depositOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "depositState", data: BytesLike): Result;
    events: {
        "Deposited(address,uint256,bytes32,uint256)": EventFragment;
        "Refund(address,uint256,bytes32,uint256)": EventFragment;
        "Withdraw(address,address,uint256,bytes32,uint256)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "Deposited"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Refund"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Withdraw"): EventFragment;
}
export declare type DepositedEvent = TypedEvent<[
    string,
    BigNumber,
    string,
    BigNumber
], {
    payee: string;
    weiAmount: BigNumber;
    spaceId: string;
    tokenId: BigNumber;
}>;
export declare type DepositedEventFilter = TypedEventFilter<DepositedEvent>;
export declare type RefundEvent = TypedEvent<[
    string,
    BigNumber,
    string,
    BigNumber
], {
    payee: string;
    weiAmount: BigNumber;
    spaceId: string;
    tokenId: BigNumber;
}>;
export declare type RefundEventFilter = TypedEventFilter<RefundEvent>;
export declare type WithdrawEvent = TypedEvent<[
    string,
    string,
    BigNumber,
    string,
    BigNumber
], {
    payer: string;
    payee: string;
    weiAmount: BigNumber;
    spaceId: string;
    tokenId: BigNumber;
}>;
export declare type WithdrawEventFilter = TypedEventFilter<WithdrawEvent>;
export interface IStayEscrow extends BaseContract {
    contractName: "IStayEscrow";
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: IStayEscrowInterface;
    queryFilter<TEvent extends TypedEvent>(event: TypedEventFilter<TEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TEvent>>;
    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
    functions: {
        deposit(payer: string, spaceId: BytesLike, tokenId: BigNumberish, overrides?: PayableOverrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        depositOf(payer: string, spaceId: BytesLike, tokenId: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber]>;
        depositState(tokenId: BigNumberish, overrides?: CallOverrides): Promise<[number]>;
    };
    deposit(payer: string, spaceId: BytesLike, tokenId: BigNumberish, overrides?: PayableOverrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    depositOf(payer: string, spaceId: BytesLike, tokenId: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    depositState(tokenId: BigNumberish, overrides?: CallOverrides): Promise<number>;
    callStatic: {
        deposit(payer: string, spaceId: BytesLike, tokenId: BigNumberish, overrides?: CallOverrides): Promise<void>;
        depositOf(payer: string, spaceId: BytesLike, tokenId: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
        depositState(tokenId: BigNumberish, overrides?: CallOverrides): Promise<number>;
    };
    filters: {
        "Deposited(address,uint256,bytes32,uint256)"(payee?: string | null, weiAmount?: null, spaceId?: null, tokenId?: null): DepositedEventFilter;
        Deposited(payee?: string | null, weiAmount?: null, spaceId?: null, tokenId?: null): DepositedEventFilter;
        "Refund(address,uint256,bytes32,uint256)"(payee?: string | null, weiAmount?: null, spaceId?: null, tokenId?: null): RefundEventFilter;
        Refund(payee?: string | null, weiAmount?: null, spaceId?: null, tokenId?: null): RefundEventFilter;
        "Withdraw(address,address,uint256,bytes32,uint256)"(payer?: string | null, payee?: string | null, weiAmount?: null, spaceId?: null, tokenId?: null): WithdrawEventFilter;
        Withdraw(payer?: string | null, payee?: string | null, weiAmount?: null, spaceId?: null, tokenId?: null): WithdrawEventFilter;
    };
    estimateGas: {
        deposit(payer: string, spaceId: BytesLike, tokenId: BigNumberish, overrides?: PayableOverrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        depositOf(payer: string, spaceId: BytesLike, tokenId: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
        depositState(tokenId: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        deposit(payer: string, spaceId: BytesLike, tokenId: BigNumberish, overrides?: PayableOverrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        depositOf(payer: string, spaceId: BytesLike, tokenId: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        depositState(tokenId: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}