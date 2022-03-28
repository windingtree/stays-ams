import { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";
export interface StaysInterface extends utils.Interface {
    contractName: "Stays";
    functions: {
        "activateLodgingFacility(bytes32)": FunctionFragment;
        "addSpace(bytes32,uint256,uint256,bool,string)": FunctionFragment;
        "approve(address,uint256)": FunctionFragment;
        "balanceOf(address)": FunctionFragment;
        "checkIn(uint256)": FunctionFragment;
        "checkOut(uint256)": FunctionFragment;
        "dayZero()": FunctionFragment;
        "deactivateLodgingFacility(bytes32)": FunctionFragment;
        "deleteLodgingFacility(bytes32)": FunctionFragment;
        "deleteSpace(bytes32)": FunctionFragment;
        "deposit(address,bytes32)": FunctionFragment;
        "depositOf(address,bytes32)": FunctionFragment;
        "depositState(address,bytes32)": FunctionFragment;
        "getActiveLodgingFacilityIds()": FunctionFragment;
        "getActiveSpaceIdsByFacilityId(bytes32)": FunctionFragment;
        "getAllLodgingFacilityIds()": FunctionFragment;
        "getApproved(uint256)": FunctionFragment;
        "getAvailability(bytes32,uint256,uint256)": FunctionFragment;
        "getCurrentStayIdsByFacilityId(bytes32)": FunctionFragment;
        "getFutureStayIdsByFacilityId(bytes32)": FunctionFragment;
        "getLodgingFacilityById(bytes32)": FunctionFragment;
        "getLodgingFacilityIdsByOwner(address)": FunctionFragment;
        "getSpaceById(bytes32)": FunctionFragment;
        "getSpaceIdsByFacilityId(bytes32)": FunctionFragment;
        "isApprovedForAll(address,address)": FunctionFragment;
        "lodgingFacilities(bytes32)": FunctionFragment;
        "lodgingFacilitySchemaURI()": FunctionFragment;
        "name()": FunctionFragment;
        "newStay(bytes32,uint256,uint256,uint256)": FunctionFragment;
        "ownerOf(uint256)": FunctionFragment;
        "registerLodgingFacility(string,bool)": FunctionFragment;
        "safeTransferFrom(address,address,uint256)": FunctionFragment;
        "serviceURI()": FunctionFragment;
        "setApprovalForAll(address,bool)": FunctionFragment;
        "spaceSchemaURI()": FunctionFragment;
        "spaces(bytes32)": FunctionFragment;
        "staySchemaURI()": FunctionFragment;
        "supportsInterface(bytes4)": FunctionFragment;
        "symbol()": FunctionFragment;
        "tokenByIndex(uint256)": FunctionFragment;
        "tokenOfOwnerByIndex(address,uint256)": FunctionFragment;
        "tokenURI(uint256)": FunctionFragment;
        "totalSupply()": FunctionFragment;
        "transferFrom(address,address,uint256)": FunctionFragment;
        "updateLodgingFacility(bytes32,string)": FunctionFragment;
        "updateSpace(bytes32,uint256,uint256,bool,string)": FunctionFragment;
        "yieldLodgingFacility(bytes32,address)": FunctionFragment;
    };
    encodeFunctionData(functionFragment: "activateLodgingFacility", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "addSpace", values: [BytesLike, BigNumberish, BigNumberish, boolean, string]): string;
    encodeFunctionData(functionFragment: "approve", values: [string, BigNumberish]): string;
    encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
    encodeFunctionData(functionFragment: "checkIn", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "checkOut", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "dayZero", values?: undefined): string;
    encodeFunctionData(functionFragment: "deactivateLodgingFacility", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "deleteLodgingFacility", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "deleteSpace", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "deposit", values: [string, BytesLike]): string;
    encodeFunctionData(functionFragment: "depositOf", values: [string, BytesLike]): string;
    encodeFunctionData(functionFragment: "depositState", values: [string, BytesLike]): string;
    encodeFunctionData(functionFragment: "getActiveLodgingFacilityIds", values?: undefined): string;
    encodeFunctionData(functionFragment: "getActiveSpaceIdsByFacilityId", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "getAllLodgingFacilityIds", values?: undefined): string;
    encodeFunctionData(functionFragment: "getApproved", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "getAvailability", values: [BytesLike, BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "getCurrentStayIdsByFacilityId", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "getFutureStayIdsByFacilityId", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "getLodgingFacilityById", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "getLodgingFacilityIdsByOwner", values: [string]): string;
    encodeFunctionData(functionFragment: "getSpaceById", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "getSpaceIdsByFacilityId", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "isApprovedForAll", values: [string, string]): string;
    encodeFunctionData(functionFragment: "lodgingFacilities", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "lodgingFacilitySchemaURI", values?: undefined): string;
    encodeFunctionData(functionFragment: "name", values?: undefined): string;
    encodeFunctionData(functionFragment: "newStay", values: [BytesLike, BigNumberish, BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "ownerOf", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "registerLodgingFacility", values: [string, boolean]): string;
    encodeFunctionData(functionFragment: "safeTransferFrom", values: [string, string, BigNumberish]): string;
    encodeFunctionData(functionFragment: "serviceURI", values?: undefined): string;
    encodeFunctionData(functionFragment: "setApprovalForAll", values: [string, boolean]): string;
    encodeFunctionData(functionFragment: "spaceSchemaURI", values?: undefined): string;
    encodeFunctionData(functionFragment: "spaces", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "staySchemaURI", values?: undefined): string;
    encodeFunctionData(functionFragment: "supportsInterface", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
    encodeFunctionData(functionFragment: "tokenByIndex", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "tokenOfOwnerByIndex", values: [string, BigNumberish]): string;
    encodeFunctionData(functionFragment: "tokenURI", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "totalSupply", values?: undefined): string;
    encodeFunctionData(functionFragment: "transferFrom", values: [string, string, BigNumberish]): string;
    encodeFunctionData(functionFragment: "updateLodgingFacility", values: [BytesLike, string]): string;
    encodeFunctionData(functionFragment: "updateSpace", values: [BytesLike, BigNumberish, BigNumberish, boolean, string]): string;
    encodeFunctionData(functionFragment: "yieldLodgingFacility", values: [BytesLike, string]): string;
    decodeFunctionResult(functionFragment: "activateLodgingFacility", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addSpace", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "checkIn", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "checkOut", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "dayZero", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deactivateLodgingFacility", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deleteLodgingFacility", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deleteSpace", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "depositOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "depositState", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getActiveLodgingFacilityIds", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getActiveSpaceIdsByFacilityId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getAllLodgingFacilityIds", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getApproved", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getAvailability", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getCurrentStayIdsByFacilityId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getFutureStayIdsByFacilityId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getLodgingFacilityById", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getLodgingFacilityIdsByOwner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSpaceById", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSpaceIdsByFacilityId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isApprovedForAll", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lodgingFacilities", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lodgingFacilitySchemaURI", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "newStay", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "registerLodgingFacility", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "safeTransferFrom", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "serviceURI", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setApprovalForAll", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "spaceSchemaURI", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "spaces", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "staySchemaURI", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "supportsInterface", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "tokenByIndex", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "tokenOfOwnerByIndex", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "tokenURI", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalSupply", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferFrom", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "updateLodgingFacility", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "updateSpace", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "yieldLodgingFacility", data: BytesLike): Result;
    events: {
        "Approval(address,address,uint256)": EventFragment;
        "ApprovalForAll(address,address,bool)": EventFragment;
        "CheckIn(uint256)": EventFragment;
        "CheckOut(uint256)": EventFragment;
        "Deposited(address,uint256,bytes32)": EventFragment;
        "LodgingFacilityActiveState(bytes32,bool)": EventFragment;
        "LodgingFacilityCreated(bytes32,address,string)": EventFragment;
        "LodgingFacilityOwnershipTransfer(bytes32,address,address)": EventFragment;
        "LodgingFacilityRemoved(bytes32)": EventFragment;
        "LodgingFacilityUpdated(bytes32,string)": EventFragment;
        "NewStay(bytes32,uint256)": EventFragment;
        "SpaceAdded(bytes32,bytes32,uint256,uint256,bool,string)": EventFragment;
        "SpaceRemoved(bytes32)": EventFragment;
        "SpaceUpdated(bytes32,bytes32,uint256,uint256,bool,string)": EventFragment;
        "Transfer(address,address,uint256)": EventFragment;
        "Withdraw(address,address,uint256,bytes32)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "ApprovalForAll"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "CheckIn"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "CheckOut"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Deposited"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "LodgingFacilityActiveState"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "LodgingFacilityCreated"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "LodgingFacilityOwnershipTransfer"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "LodgingFacilityRemoved"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "LodgingFacilityUpdated"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "NewStay"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "SpaceAdded"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "SpaceRemoved"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "SpaceUpdated"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Withdraw"): EventFragment;
}
export declare type ApprovalEvent = TypedEvent<[
    string,
    string,
    BigNumber
], {
    owner: string;
    approved: string;
    tokenId: BigNumber;
}>;
export declare type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;
export declare type ApprovalForAllEvent = TypedEvent<[
    string,
    string,
    boolean
], {
    owner: string;
    operator: string;
    approved: boolean;
}>;
export declare type ApprovalForAllEventFilter = TypedEventFilter<ApprovalForAllEvent>;
export declare type CheckInEvent = TypedEvent<[BigNumber], {
    tokenId: BigNumber;
}>;
export declare type CheckInEventFilter = TypedEventFilter<CheckInEvent>;
export declare type CheckOutEvent = TypedEvent<[BigNumber], {
    tokenId: BigNumber;
}>;
export declare type CheckOutEventFilter = TypedEventFilter<CheckOutEvent>;
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
export declare type LodgingFacilityActiveStateEvent = TypedEvent<[
    string,
    boolean
], {
    facilityId: string;
    active: boolean;
}>;
export declare type LodgingFacilityActiveStateEventFilter = TypedEventFilter<LodgingFacilityActiveStateEvent>;
export declare type LodgingFacilityCreatedEvent = TypedEvent<[
    string,
    string,
    string
], {
    facilityId: string;
    owner: string;
    dataURI: string;
}>;
export declare type LodgingFacilityCreatedEventFilter = TypedEventFilter<LodgingFacilityCreatedEvent>;
export declare type LodgingFacilityOwnershipTransferEvent = TypedEvent<[
    string,
    string,
    string
], {
    facilityId: string;
    prevOwner: string;
    newOwner: string;
}>;
export declare type LodgingFacilityOwnershipTransferEventFilter = TypedEventFilter<LodgingFacilityOwnershipTransferEvent>;
export declare type LodgingFacilityRemovedEvent = TypedEvent<[
    string
], {
    facilityId: string;
}>;
export declare type LodgingFacilityRemovedEventFilter = TypedEventFilter<LodgingFacilityRemovedEvent>;
export declare type LodgingFacilityUpdatedEvent = TypedEvent<[
    string,
    string
], {
    facilityId: string;
    dataURI: string;
}>;
export declare type LodgingFacilityUpdatedEventFilter = TypedEventFilter<LodgingFacilityUpdatedEvent>;
export declare type NewStayEvent = TypedEvent<[
    string,
    BigNumber
], {
    spaceId: string;
    tokenId: BigNumber;
}>;
export declare type NewStayEventFilter = TypedEventFilter<NewStayEvent>;
export declare type SpaceAddedEvent = TypedEvent<[
    string,
    string,
    BigNumber,
    BigNumber,
    boolean,
    string
], {
    spaceId: string;
    facilityId: string;
    capacity: BigNumber;
    pricePerNightWei: BigNumber;
    active: boolean;
    dataURI: string;
}>;
export declare type SpaceAddedEventFilter = TypedEventFilter<SpaceAddedEvent>;
export declare type SpaceRemovedEvent = TypedEvent<[string], {
    spaceId: string;
}>;
export declare type SpaceRemovedEventFilter = TypedEventFilter<SpaceRemovedEvent>;
export declare type SpaceUpdatedEvent = TypedEvent<[
    string,
    string,
    BigNumber,
    BigNumber,
    boolean,
    string
], {
    spaceId: string;
    facilityId: string;
    capacity: BigNumber;
    pricePerNightWei: BigNumber;
    active: boolean;
    dataURI: string;
}>;
export declare type SpaceUpdatedEventFilter = TypedEventFilter<SpaceUpdatedEvent>;
export declare type TransferEvent = TypedEvent<[
    string,
    string,
    BigNumber
], {
    from: string;
    to: string;
    tokenId: BigNumber;
}>;
export declare type TransferEventFilter = TypedEventFilter<TransferEvent>;
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
export interface Stays extends BaseContract {
    contractName: "Stays";
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: StaysInterface;
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
        activateLodgingFacility(_lodgingFacilityId: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        addSpace(_lodgingFacilityId: BytesLike, _capacity: BigNumberish, _pricePerNightWei: BigNumberish, _active: boolean, _dataURI: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        approve(to: string, tokenId: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        balanceOf(owner: string, overrides?: CallOverrides): Promise<[BigNumber]>;
        checkIn(_tokenId: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        checkOut(_tokenId: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        dayZero(overrides?: CallOverrides): Promise<[number]>;
        deactivateLodgingFacility(_lodgingFacilityId: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        deleteLodgingFacility(_lodgingFacilityId: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        deleteSpace(_spaceId: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        deposit(payee: string, spaceId: BytesLike, overrides?: PayableOverrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        depositOf(payer: string, spaceId: BytesLike, overrides?: CallOverrides): Promise<[BigNumber]>;
        depositState(payer: string, spaceId: BytesLike, overrides?: CallOverrides): Promise<[number]>;
        getActiveLodgingFacilityIds(overrides?: CallOverrides): Promise<[string[]] & {
            activeLodgingFacilityIds: string[];
        }>;
        getActiveSpaceIdsByFacilityId(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<[string[]] & {
            activeSpacesIds: string[];
        }>;
        getAllLodgingFacilityIds(overrides?: CallOverrides): Promise<[string[]]>;
        getApproved(tokenId: BigNumberish, overrides?: CallOverrides): Promise<[string]>;
        getAvailability(_spaceId: BytesLike, _startDay: BigNumberish, _numberOfDays: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber[]]>;
        getCurrentStayIdsByFacilityId(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<[string[]]>;
        getFutureStayIdsByFacilityId(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<[string[]]>;
        getLodgingFacilityById(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<[
            boolean,
            string,
            boolean,
            string
        ] & {
            exists: boolean;
            owner: string;
            active: boolean;
            dataURI: string;
        }>;
        getLodgingFacilityIdsByOwner(_owner: string, overrides?: CallOverrides): Promise<[string[]]>;
        getSpaceById(_spaceId: BytesLike, overrides?: CallOverrides): Promise<[
            boolean,
            string,
            BigNumber,
            BigNumber,
            boolean,
            string
        ] & {
            exists: boolean;
            lodgingFacilityId: string;
            capacity: BigNumber;
            pricePerNightWei: BigNumber;
            active: boolean;
            dataURI: string;
        }>;
        getSpaceIdsByFacilityId(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<[string[]]>;
        isApprovedForAll(owner: string, operator: string, overrides?: CallOverrides): Promise<[boolean]>;
        lodgingFacilities(arg0: BytesLike, overrides?: CallOverrides): Promise<[
            string,
            boolean,
            boolean,
            string,
            string
        ] & {
            owner: string;
            active: boolean;
            exists: boolean;
            dataURI: string;
            fren: string;
        }>;
        lodgingFacilitySchemaURI(overrides?: CallOverrides): Promise<[string]>;
        name(overrides?: CallOverrides): Promise<[string]>;
        newStay(_spaceId: BytesLike, _startDay: BigNumberish, _numberOfDays: BigNumberish, _quantity: BigNumberish, overrides?: PayableOverrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        ownerOf(tokenId: BigNumberish, overrides?: CallOverrides): Promise<[string]>;
        "registerLodgingFacility(string,bool)"(_dataURI: string, _active: boolean, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        "registerLodgingFacility(string,bool,address)"(_dataURI: string, _active: boolean, _fren: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        "safeTransferFrom(address,address,uint256)"(from: string, to: string, tokenId: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        "safeTransferFrom(address,address,uint256,bytes)"(from: string, to: string, tokenId: BigNumberish, _data: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        serviceURI(overrides?: CallOverrides): Promise<[string]>;
        setApprovalForAll(operator: string, approved: boolean, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        spaceSchemaURI(overrides?: CallOverrides): Promise<[string]>;
        spaces(arg0: BytesLike, overrides?: CallOverrides): Promise<[
            string,
            BigNumber,
            BigNumber,
            boolean,
            boolean,
            string
        ] & {
            lodgingFacilityId: string;
            capacity: BigNumber;
            pricePerNightWei: BigNumber;
            active: boolean;
            exists: boolean;
            dataURI: string;
        }>;
        staySchemaURI(overrides?: CallOverrides): Promise<[string]>;
        supportsInterface(interfaceId: BytesLike, overrides?: CallOverrides): Promise<[boolean]>;
        symbol(overrides?: CallOverrides): Promise<[string]>;
        tokenByIndex(index: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber]>;
        tokenOfOwnerByIndex(owner: string, index: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber]>;
        tokenURI(tokenId: BigNumberish, overrides?: CallOverrides): Promise<[string]>;
        totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;
        transferFrom(from: string, to: string, tokenId: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        updateLodgingFacility(_lodgingFacilityId: BytesLike, _newDataURI: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        updateSpace(_spaceId: BytesLike, _capacity: BigNumberish, _pricePerNightWei: BigNumberish, _active: boolean, _dataURI: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        yieldLodgingFacility(_lodgingFacilityId: BytesLike, _newOwner: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
    };
    activateLodgingFacility(_lodgingFacilityId: BytesLike, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    addSpace(_lodgingFacilityId: BytesLike, _capacity: BigNumberish, _pricePerNightWei: BigNumberish, _active: boolean, _dataURI: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    approve(to: string, tokenId: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;
    checkIn(_tokenId: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    checkOut(_tokenId: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    dayZero(overrides?: CallOverrides): Promise<number>;
    deactivateLodgingFacility(_lodgingFacilityId: BytesLike, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    deleteLodgingFacility(_lodgingFacilityId: BytesLike, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    deleteSpace(_spaceId: BytesLike, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    deposit(payee: string, spaceId: BytesLike, overrides?: PayableOverrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    depositOf(payer: string, spaceId: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
    depositState(payer: string, spaceId: BytesLike, overrides?: CallOverrides): Promise<number>;
    getActiveLodgingFacilityIds(overrides?: CallOverrides): Promise<string[]>;
    getActiveSpaceIdsByFacilityId(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<string[]>;
    getAllLodgingFacilityIds(overrides?: CallOverrides): Promise<string[]>;
    getApproved(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;
    getAvailability(_spaceId: BytesLike, _startDay: BigNumberish, _numberOfDays: BigNumberish, overrides?: CallOverrides): Promise<BigNumber[]>;
    getCurrentStayIdsByFacilityId(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<string[]>;
    getFutureStayIdsByFacilityId(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<string[]>;
    getLodgingFacilityById(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<[
        boolean,
        string,
        boolean,
        string
    ] & {
        exists: boolean;
        owner: string;
        active: boolean;
        dataURI: string;
    }>;
    getLodgingFacilityIdsByOwner(_owner: string, overrides?: CallOverrides): Promise<string[]>;
    getSpaceById(_spaceId: BytesLike, overrides?: CallOverrides): Promise<[
        boolean,
        string,
        BigNumber,
        BigNumber,
        boolean,
        string
    ] & {
        exists: boolean;
        lodgingFacilityId: string;
        capacity: BigNumber;
        pricePerNightWei: BigNumber;
        active: boolean;
        dataURI: string;
    }>;
    getSpaceIdsByFacilityId(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<string[]>;
    isApprovedForAll(owner: string, operator: string, overrides?: CallOverrides): Promise<boolean>;
    lodgingFacilities(arg0: BytesLike, overrides?: CallOverrides): Promise<[
        string,
        boolean,
        boolean,
        string,
        string
    ] & {
        owner: string;
        active: boolean;
        exists: boolean;
        dataURI: string;
        fren: string;
    }>;
    lodgingFacilitySchemaURI(overrides?: CallOverrides): Promise<string>;
    name(overrides?: CallOverrides): Promise<string>;
    newStay(_spaceId: BytesLike, _startDay: BigNumberish, _numberOfDays: BigNumberish, _quantity: BigNumberish, overrides?: PayableOverrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    ownerOf(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;
    "registerLodgingFacility(string,bool)"(_dataURI: string, _active: boolean, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    "registerLodgingFacility(string,bool,address)"(_dataURI: string, _active: boolean, _fren: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    "safeTransferFrom(address,address,uint256)"(from: string, to: string, tokenId: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    "safeTransferFrom(address,address,uint256,bytes)"(from: string, to: string, tokenId: BigNumberish, _data: BytesLike, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    serviceURI(overrides?: CallOverrides): Promise<string>;
    setApprovalForAll(operator: string, approved: boolean, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    spaceSchemaURI(overrides?: CallOverrides): Promise<string>;
    spaces(arg0: BytesLike, overrides?: CallOverrides): Promise<[
        string,
        BigNumber,
        BigNumber,
        boolean,
        boolean,
        string
    ] & {
        lodgingFacilityId: string;
        capacity: BigNumber;
        pricePerNightWei: BigNumber;
        active: boolean;
        exists: boolean;
        dataURI: string;
    }>;
    staySchemaURI(overrides?: CallOverrides): Promise<string>;
    supportsInterface(interfaceId: BytesLike, overrides?: CallOverrides): Promise<boolean>;
    symbol(overrides?: CallOverrides): Promise<string>;
    tokenByIndex(index: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    tokenOfOwnerByIndex(owner: string, index: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    tokenURI(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;
    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
    transferFrom(from: string, to: string, tokenId: BigNumberish, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    updateLodgingFacility(_lodgingFacilityId: BytesLike, _newDataURI: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    updateSpace(_spaceId: BytesLike, _capacity: BigNumberish, _pricePerNightWei: BigNumberish, _active: boolean, _dataURI: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    yieldLodgingFacility(_lodgingFacilityId: BytesLike, _newOwner: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        activateLodgingFacility(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<void>;
        addSpace(_lodgingFacilityId: BytesLike, _capacity: BigNumberish, _pricePerNightWei: BigNumberish, _active: boolean, _dataURI: string, overrides?: CallOverrides): Promise<void>;
        approve(to: string, tokenId: BigNumberish, overrides?: CallOverrides): Promise<void>;
        balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;
        checkIn(_tokenId: BigNumberish, overrides?: CallOverrides): Promise<void>;
        checkOut(_tokenId: BigNumberish, overrides?: CallOverrides): Promise<void>;
        dayZero(overrides?: CallOverrides): Promise<number>;
        deactivateLodgingFacility(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<void>;
        deleteLodgingFacility(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<void>;
        deleteSpace(_spaceId: BytesLike, overrides?: CallOverrides): Promise<void>;
        deposit(payee: string, spaceId: BytesLike, overrides?: CallOverrides): Promise<void>;
        depositOf(payer: string, spaceId: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
        depositState(payer: string, spaceId: BytesLike, overrides?: CallOverrides): Promise<number>;
        getActiveLodgingFacilityIds(overrides?: CallOverrides): Promise<string[]>;
        getActiveSpaceIdsByFacilityId(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<string[]>;
        getAllLodgingFacilityIds(overrides?: CallOverrides): Promise<string[]>;
        getApproved(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;
        getAvailability(_spaceId: BytesLike, _startDay: BigNumberish, _numberOfDays: BigNumberish, overrides?: CallOverrides): Promise<BigNumber[]>;
        getCurrentStayIdsByFacilityId(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<string[]>;
        getFutureStayIdsByFacilityId(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<string[]>;
        getLodgingFacilityById(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<[
            boolean,
            string,
            boolean,
            string
        ] & {
            exists: boolean;
            owner: string;
            active: boolean;
            dataURI: string;
        }>;
        getLodgingFacilityIdsByOwner(_owner: string, overrides?: CallOverrides): Promise<string[]>;
        getSpaceById(_spaceId: BytesLike, overrides?: CallOverrides): Promise<[
            boolean,
            string,
            BigNumber,
            BigNumber,
            boolean,
            string
        ] & {
            exists: boolean;
            lodgingFacilityId: string;
            capacity: BigNumber;
            pricePerNightWei: BigNumber;
            active: boolean;
            dataURI: string;
        }>;
        getSpaceIdsByFacilityId(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<string[]>;
        isApprovedForAll(owner: string, operator: string, overrides?: CallOverrides): Promise<boolean>;
        lodgingFacilities(arg0: BytesLike, overrides?: CallOverrides): Promise<[
            string,
            boolean,
            boolean,
            string,
            string
        ] & {
            owner: string;
            active: boolean;
            exists: boolean;
            dataURI: string;
            fren: string;
        }>;
        lodgingFacilitySchemaURI(overrides?: CallOverrides): Promise<string>;
        name(overrides?: CallOverrides): Promise<string>;
        newStay(_spaceId: BytesLike, _startDay: BigNumberish, _numberOfDays: BigNumberish, _quantity: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
        ownerOf(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;
        "registerLodgingFacility(string,bool)"(_dataURI: string, _active: boolean, overrides?: CallOverrides): Promise<void>;
        "registerLodgingFacility(string,bool,address)"(_dataURI: string, _active: boolean, _fren: string, overrides?: CallOverrides): Promise<void>;
        "safeTransferFrom(address,address,uint256)"(from: string, to: string, tokenId: BigNumberish, overrides?: CallOverrides): Promise<void>;
        "safeTransferFrom(address,address,uint256,bytes)"(from: string, to: string, tokenId: BigNumberish, _data: BytesLike, overrides?: CallOverrides): Promise<void>;
        serviceURI(overrides?: CallOverrides): Promise<string>;
        setApprovalForAll(operator: string, approved: boolean, overrides?: CallOverrides): Promise<void>;
        spaceSchemaURI(overrides?: CallOverrides): Promise<string>;
        spaces(arg0: BytesLike, overrides?: CallOverrides): Promise<[
            string,
            BigNumber,
            BigNumber,
            boolean,
            boolean,
            string
        ] & {
            lodgingFacilityId: string;
            capacity: BigNumber;
            pricePerNightWei: BigNumber;
            active: boolean;
            exists: boolean;
            dataURI: string;
        }>;
        staySchemaURI(overrides?: CallOverrides): Promise<string>;
        supportsInterface(interfaceId: BytesLike, overrides?: CallOverrides): Promise<boolean>;
        symbol(overrides?: CallOverrides): Promise<string>;
        tokenByIndex(index: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
        tokenOfOwnerByIndex(owner: string, index: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
        tokenURI(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;
        totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
        transferFrom(from: string, to: string, tokenId: BigNumberish, overrides?: CallOverrides): Promise<void>;
        updateLodgingFacility(_lodgingFacilityId: BytesLike, _newDataURI: string, overrides?: CallOverrides): Promise<void>;
        updateSpace(_spaceId: BytesLike, _capacity: BigNumberish, _pricePerNightWei: BigNumberish, _active: boolean, _dataURI: string, overrides?: CallOverrides): Promise<void>;
        yieldLodgingFacility(_lodgingFacilityId: BytesLike, _newOwner: string, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "Approval(address,address,uint256)"(owner?: string | null, approved?: string | null, tokenId?: BigNumberish | null): ApprovalEventFilter;
        Approval(owner?: string | null, approved?: string | null, tokenId?: BigNumberish | null): ApprovalEventFilter;
        "ApprovalForAll(address,address,bool)"(owner?: string | null, operator?: string | null, approved?: null): ApprovalForAllEventFilter;
        ApprovalForAll(owner?: string | null, operator?: string | null, approved?: null): ApprovalForAllEventFilter;
        "CheckIn(uint256)"(tokenId?: null): CheckInEventFilter;
        CheckIn(tokenId?: null): CheckInEventFilter;
        "CheckOut(uint256)"(tokenId?: null): CheckOutEventFilter;
        CheckOut(tokenId?: null): CheckOutEventFilter;
        "Deposited(address,uint256,bytes32)"(payee?: string | null, weiAmount?: null, spaceId?: null): DepositedEventFilter;
        Deposited(payee?: string | null, weiAmount?: null, spaceId?: null): DepositedEventFilter;
        "LodgingFacilityActiveState(bytes32,bool)"(facilityId?: null, active?: null): LodgingFacilityActiveStateEventFilter;
        LodgingFacilityActiveState(facilityId?: null, active?: null): LodgingFacilityActiveStateEventFilter;
        "LodgingFacilityCreated(bytes32,address,string)"(facilityId?: null, owner?: string | null, dataURI?: null): LodgingFacilityCreatedEventFilter;
        LodgingFacilityCreated(facilityId?: null, owner?: string | null, dataURI?: null): LodgingFacilityCreatedEventFilter;
        "LodgingFacilityOwnershipTransfer(bytes32,address,address)"(facilityId?: null, prevOwner?: string | null, newOwner?: string | null): LodgingFacilityOwnershipTransferEventFilter;
        LodgingFacilityOwnershipTransfer(facilityId?: null, prevOwner?: string | null, newOwner?: string | null): LodgingFacilityOwnershipTransferEventFilter;
        "LodgingFacilityRemoved(bytes32)"(facilityId?: null): LodgingFacilityRemovedEventFilter;
        LodgingFacilityRemoved(facilityId?: null): LodgingFacilityRemovedEventFilter;
        "LodgingFacilityUpdated(bytes32,string)"(facilityId?: null, dataURI?: null): LodgingFacilityUpdatedEventFilter;
        LodgingFacilityUpdated(facilityId?: null, dataURI?: null): LodgingFacilityUpdatedEventFilter;
        "NewStay(bytes32,uint256)"(spaceId?: null, tokenId?: null): NewStayEventFilter;
        NewStay(spaceId?: null, tokenId?: null): NewStayEventFilter;
        "SpaceAdded(bytes32,bytes32,uint256,uint256,bool,string)"(spaceId?: null, facilityId?: null, capacity?: null, pricePerNightWei?: null, active?: null, dataURI?: null): SpaceAddedEventFilter;
        SpaceAdded(spaceId?: null, facilityId?: null, capacity?: null, pricePerNightWei?: null, active?: null, dataURI?: null): SpaceAddedEventFilter;
        "SpaceRemoved(bytes32)"(spaceId?: null): SpaceRemovedEventFilter;
        SpaceRemoved(spaceId?: null): SpaceRemovedEventFilter;
        "SpaceUpdated(bytes32,bytes32,uint256,uint256,bool,string)"(spaceId?: null, facilityId?: null, capacity?: null, pricePerNightWei?: null, active?: null, dataURI?: null): SpaceUpdatedEventFilter;
        SpaceUpdated(spaceId?: null, facilityId?: null, capacity?: null, pricePerNightWei?: null, active?: null, dataURI?: null): SpaceUpdatedEventFilter;
        "Transfer(address,address,uint256)"(from?: string | null, to?: string | null, tokenId?: BigNumberish | null): TransferEventFilter;
        Transfer(from?: string | null, to?: string | null, tokenId?: BigNumberish | null): TransferEventFilter;
        "Withdraw(address,address,uint256,bytes32)"(payer?: string | null, payee?: string | null, weiAmount?: null, spaceId?: null): WithdrawEventFilter;
        Withdraw(payer?: string | null, payee?: string | null, weiAmount?: null, spaceId?: null): WithdrawEventFilter;
    };
    estimateGas: {
        activateLodgingFacility(_lodgingFacilityId: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        addSpace(_lodgingFacilityId: BytesLike, _capacity: BigNumberish, _pricePerNightWei: BigNumberish, _active: boolean, _dataURI: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        approve(to: string, tokenId: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;
        checkIn(_tokenId: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        checkOut(_tokenId: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        dayZero(overrides?: CallOverrides): Promise<BigNumber>;
        deactivateLodgingFacility(_lodgingFacilityId: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        deleteLodgingFacility(_lodgingFacilityId: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        deleteSpace(_spaceId: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        deposit(payee: string, spaceId: BytesLike, overrides?: PayableOverrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        depositOf(payer: string, spaceId: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
        depositState(payer: string, spaceId: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
        getActiveLodgingFacilityIds(overrides?: CallOverrides): Promise<BigNumber>;
        getActiveSpaceIdsByFacilityId(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
        getAllLodgingFacilityIds(overrides?: CallOverrides): Promise<BigNumber>;
        getApproved(tokenId: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
        getAvailability(_spaceId: BytesLike, _startDay: BigNumberish, _numberOfDays: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
        getCurrentStayIdsByFacilityId(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
        getFutureStayIdsByFacilityId(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
        getLodgingFacilityById(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
        getLodgingFacilityIdsByOwner(_owner: string, overrides?: CallOverrides): Promise<BigNumber>;
        getSpaceById(_spaceId: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
        getSpaceIdsByFacilityId(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
        isApprovedForAll(owner: string, operator: string, overrides?: CallOverrides): Promise<BigNumber>;
        lodgingFacilities(arg0: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
        lodgingFacilitySchemaURI(overrides?: CallOverrides): Promise<BigNumber>;
        name(overrides?: CallOverrides): Promise<BigNumber>;
        newStay(_spaceId: BytesLike, _startDay: BigNumberish, _numberOfDays: BigNumberish, _quantity: BigNumberish, overrides?: PayableOverrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        ownerOf(tokenId: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
        "registerLodgingFacility(string,bool)"(_dataURI: string, _active: boolean, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        "registerLodgingFacility(string,bool,address)"(_dataURI: string, _active: boolean, _fren: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        "safeTransferFrom(address,address,uint256)"(from: string, to: string, tokenId: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        "safeTransferFrom(address,address,uint256,bytes)"(from: string, to: string, tokenId: BigNumberish, _data: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        serviceURI(overrides?: CallOverrides): Promise<BigNumber>;
        setApprovalForAll(operator: string, approved: boolean, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        spaceSchemaURI(overrides?: CallOverrides): Promise<BigNumber>;
        spaces(arg0: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
        staySchemaURI(overrides?: CallOverrides): Promise<BigNumber>;
        supportsInterface(interfaceId: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
        symbol(overrides?: CallOverrides): Promise<BigNumber>;
        tokenByIndex(index: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
        tokenOfOwnerByIndex(owner: string, index: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
        tokenURI(tokenId: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
        totalSupply(overrides?: CallOverrides): Promise<BigNumber>;
        transferFrom(from: string, to: string, tokenId: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        updateLodgingFacility(_lodgingFacilityId: BytesLike, _newDataURI: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        updateSpace(_spaceId: BytesLike, _capacity: BigNumberish, _pricePerNightWei: BigNumberish, _active: boolean, _dataURI: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        yieldLodgingFacility(_lodgingFacilityId: BytesLike, _newOwner: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        activateLodgingFacility(_lodgingFacilityId: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        addSpace(_lodgingFacilityId: BytesLike, _capacity: BigNumberish, _pricePerNightWei: BigNumberish, _active: boolean, _dataURI: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        approve(to: string, tokenId: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        balanceOf(owner: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        checkIn(_tokenId: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        checkOut(_tokenId: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        dayZero(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        deactivateLodgingFacility(_lodgingFacilityId: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        deleteLodgingFacility(_lodgingFacilityId: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        deleteSpace(_spaceId: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        deposit(payee: string, spaceId: BytesLike, overrides?: PayableOverrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        depositOf(payer: string, spaceId: BytesLike, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        depositState(payer: string, spaceId: BytesLike, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getActiveLodgingFacilityIds(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getActiveSpaceIdsByFacilityId(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getAllLodgingFacilityIds(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getApproved(tokenId: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getAvailability(_spaceId: BytesLike, _startDay: BigNumberish, _numberOfDays: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getCurrentStayIdsByFacilityId(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getFutureStayIdsByFacilityId(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getLodgingFacilityById(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getLodgingFacilityIdsByOwner(_owner: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getSpaceById(_spaceId: BytesLike, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getSpaceIdsByFacilityId(_lodgingFacilityId: BytesLike, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isApprovedForAll(owner: string, operator: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        lodgingFacilities(arg0: BytesLike, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        lodgingFacilitySchemaURI(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        name(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        newStay(_spaceId: BytesLike, _startDay: BigNumberish, _numberOfDays: BigNumberish, _quantity: BigNumberish, overrides?: PayableOverrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        ownerOf(tokenId: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        "registerLodgingFacility(string,bool)"(_dataURI: string, _active: boolean, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        "registerLodgingFacility(string,bool,address)"(_dataURI: string, _active: boolean, _fren: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        "safeTransferFrom(address,address,uint256)"(from: string, to: string, tokenId: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        "safeTransferFrom(address,address,uint256,bytes)"(from: string, to: string, tokenId: BigNumberish, _data: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        serviceURI(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        setApprovalForAll(operator: string, approved: boolean, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        spaceSchemaURI(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        spaces(arg0: BytesLike, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        staySchemaURI(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        supportsInterface(interfaceId: BytesLike, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        tokenByIndex(index: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        tokenOfOwnerByIndex(owner: string, index: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        tokenURI(tokenId: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        transferFrom(from: string, to: string, tokenId: BigNumberish, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        updateLodgingFacility(_lodgingFacilityId: BytesLike, _newDataURI: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        updateSpace(_spaceId: BytesLike, _capacity: BigNumberish, _pricePerNightWei: BigNumberish, _active: boolean, _dataURI: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        yieldLodgingFacility(_lodgingFacilityId: BytesLike, _newOwner: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
    };
}
