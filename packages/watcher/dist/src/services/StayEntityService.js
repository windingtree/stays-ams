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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BlockRepository_1 = __importDefault(require("../repositories/BlockRepository"));
class StayEntityService {
    constructor(contract) {
        this.dayZero = new Date(1645567342 * 1000); //date from smart contract (getZeroDay)
        this.contract = contract;
    }
    process() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getTokens();
            yield this.makeTokenEntities();
            yield this.fillNeededFacilitiesAndSpaces();
            yield this.setLastBlockNumber();
        });
    }
    getTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            const blockNumber = yield (new BlockRepository_1.default()).getLastBlockNumber();
            console.log(123);
            const contractIds = yield this.contract.getNewBookingsTokenIds(blockNumber);
            console.log(213123123);
            let tokens = new Set();
            console.log(123123123);
            contractIds.map(v => {
                tokens.add(this.contract.getToken(v.toString()));
            });
            console.log(1231231212313);
            this.tokens = tokens;
        });
    }
    makeTokenEntities() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(99);
            let tokenEntities = new Set();
            let tokens = yield Promise.all(this.tokens);
            console.log(tokens);
            tokens.map(t => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                const startDay = ((_b = (_a = t.data.attributes) === null || _a === void 0 ? void 0 : _a.find(i => i.trait_type === 'startDay')) === null || _b === void 0 ? void 0 : _b.value) || '0';
                const numberOfDays = ((_d = (_c = t.data.attributes) === null || _c === void 0 ? void 0 : _c.find(i => i.trait_type === 'numberOfDays')) === null || _d === void 0 ? void 0 : _d.value) || '0';
                const tokenEntity = {
                    tokenId: t.tokenId,
                    name: t.data.name,
                    description: t.data.description,
                    image: t.data.image,
                    external_url: t.data.external_url,
                    facilityId: (_f = (_e = t.data.attributes) === null || _e === void 0 ? void 0 : _e.find(i => i.trait_type === 'facilityId')) === null || _f === void 0 ? void 0 : _f.value,
                    spaceId: (_h = (_g = t.data.attributes) === null || _g === void 0 ? void 0 : _g.find(i => i.trait_type === 'spaceId')) === null || _h === void 0 ? void 0 : _h.value,
                    startDay,
                    numberOfDays,
                    startDayParsed: this.addDaysAndParse(parseInt(startDay)),
                    endDayParsed: this.addDaysAndParse(parseInt(startDay), parseInt(numberOfDays)),
                    quantity: (_k = (_j = t.data.attributes) === null || _j === void 0 ? void 0 : _j.find(i => i.trait_type === 'quantity')) === null || _k === void 0 ? void 0 : _k.value,
                };
                if (t.status === 'booked' && tokenEntity.spaceId && tokenEntity.facilityId) {
                    tokenEntities.add(tokenEntity);
                }
            });
            this.tokenEntities = Array.from(tokenEntities);
        });
    }
    fillNeededFacilitiesAndSpaces() {
        return __awaiter(this, void 0, void 0, function* () {
            const facilityIds = this.tokenEntities.map(e => e.facilityId || '');
            const facilities = yield Promise.all(facilityIds.map(id => this.contract.getLodgingFacility(id)));
            const spaceIds = this.tokenEntities.map(e => e.spaceId || '');
            const spaces = yield Promise.all(spaceIds.map(id => this.contract.getSpace(id)));
            this.tokenEntities.map(t => {
                t.facility = facilities.find(i => (i === null || i === void 0 ? void 0 : i.contractData.lodgingFacilityId) === t.facilityId) || undefined;
                t.space = spaces.find(i => (i === null || i === void 0 ? void 0 : i.contractData.spaceId) === t.spaceId) || undefined;
            });
        });
    }
    addDaysAndParse(days, moreDays = 0) {
        const date = new Date(this.dayZero);
        date.setDate(date.getDate() + days + moreDays);
        return date;
    }
    getTokenEntities() {
        return this.tokenEntities;
    }
    setLastBlockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            const blockNumber = yield this.contract.provider.getBlockNumber();
            yield (new BlockRepository_1.default()).store(blockNumber);
        });
    }
}
exports.default = StayEntityService;
//# sourceMappingURL=StayEntityService.js.map