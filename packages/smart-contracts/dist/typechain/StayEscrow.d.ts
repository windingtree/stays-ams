import { BaseContract, BigNumber, BytesLike, CallOverrides, ContractTransaction, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";
export interface StayEscrowInterface extends utils.Interface {
    contractName: "StayEscrow";
    functions: {
        "deposit(address,bytes32)": FunctionFragment;
        "depositOf(address,bytes32)": FunctionFragment;
        "depositState(address,bytes32)": FunctionFragment;
    };
    encodeFunctionData(functionFragment: "deposit", values: [string, BytesLike]): string;
    encodeFunctionData(functionFragment: "depositOf", values: [string, BytesLike]): string;
    encodeFunctionData(functionFragment: "depositState", values: [string, BytesLike]): string;
    decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "depositOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "depositState", data: BytesLike): Result;
    events: {
        "Deposited(address,uint256,bytes32)": EventFragment;
        "Withdraw(address,address,uint256,bytes32)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "Deposited"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Withdraw"): EventFragment;
}
export declare type DepositedEvent = TypedEvent<[
    string,
    BigNumber,
    string
], {
    payee: string;
    weiAmount: BigNumber;
    spaceId: string;
}>;
export declare type DepositedEventFilter = TypedEventFilter<DepositedEvent>;
export declare type WithdrawEvent = TypedEvent<[
    string,
    string,
    BigNumber,
    string
], {
    payer: string;
    payee: string;
    weiAmount: BigNumber;
    spaceId: string;
}>;
export declare type WithdrawEventFilter = TypedEventFilter<WithdrawEvent>;
export interface StayEscrow extends BaseContract {
    contractName: "StayEscrow";
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: StayEscrowInterface;
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
        deposit(payer: string, spaceId: BytesLike, overrides?: PayableOverrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        depositOf(payer: string, spaceId: BytesLike, overrides?: CallOverrides): Promise<[BigNumber]>;
        depositState(payer: string, spaceId: BytesLike, overrides?: CallOverrides): Promise<[number]>;
    };
    deposit(payer: string, spaceId: BytesLike, overrides?: PayableOverrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    depositOf(payer: string, spaceId: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
    depositState(payer: string, spaceId: BytesLike, overrides?: CallOverrides): Promise<number>;
    callStatic: {
        deposit(payer: string, spaceId: BytesLike, overrides?: CallOverrides): Promise<void>;
        depositOf(payer: string, spaceId: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
        depositState(payer: string, spaceId: BytesLike, overrides?: CallOverrides): Promise<number>;
    };
    filters: {
        "Deposited(address,uint256,bytes32)"(payee?: string | null, weiAmount?: null, spaceId?: null): DepositedEventFilter;
        Deposited(payee?: string | null, weiAmount?: null, spaceId?: null): DepositedEventFilter;
        "Withdraw(address,address,uint256,bytes32)"(payer?: string | null, payee?: string | null, weiAmount?: null, spaceId?: null): WithdrawEventFilter;
        Withdraw(payer?: string | null, payee?: string | null, weiAmount?: null, spaceId?: null): WithdrawEventFilter;
    };
    estimateGas: {
        deposit(payer: string, spaceId: BytesLike, overrides?: PayableOverrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        depositOf(payer: string, spaceId: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
        depositState(payer: string, spaceId: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        deposit(payer: string, spaceId: BytesLike, overrides?: PayableOverrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        depositOf(payer: string, spaceId: BytesLike, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        depositState(payer: string, spaceId: BytesLike, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
