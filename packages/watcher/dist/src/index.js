"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const helpers_1 = require("./helpers");
dotenv_1.default.config(); //todo go to config
class NewBooks {
    constructor() {
        this.dayZero = new Date(1645567342 * 1000);
    }
    async process() {
        this.contract = await (0, helpers_1.makeContract)();
        if (!this.contract)
            throw new Error();
        await this.getTokens();
        await this.makeTokenEntities();
        await this.fillNeededFacilitiesAndSpaces();
    }
    async getTokens() {
        const contractIds = await this.contract.getNewBookingsTokenIds(0);
        let tokens = new Set();
        contractIds.map(v => {
            tokens.add(this.contract.getToken(v.toString()));
        });
        this.tokens = tokens;
    }
    async makeTokenEntities() {
        let tokenEntities = new Set();
        let tokens = await Promise.all(this.tokens);
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
    }
    async fillNeededFacilitiesAndSpaces() {
        const facilityIds = this.tokenEntities.map(e => e.facilityId || '');
        const facilities = await Promise.all(facilityIds.map(id => this.contract.getLodgingFacility(id)));
        const spaceIds = this.tokenEntities.map(e => e.spaceId || '');
        const spaces = await Promise.all(spaceIds.map(id => this.contract.getSpace(id)));
        this.tokenEntities.map(t => {
            t.facility = facilities.find(i => (i === null || i === void 0 ? void 0 : i.contractData.lodgingFacilityId) === t.facilityId) || undefined;
            t.space = spaces.find(i => (i === null || i === void 0 ? void 0 : i.contractData.spaceId) === t.spaceId) || undefined;
        });
    }
    addDaysAndParse(days, moreDays = 0) {
        const date = new Date(this.dayZero);
        date.setDate(date.getDate() + days + moreDays);
        return date;
    }
}
const a = async () => {
    // const books = new NewBooks();
    // await books.process().then(() => console.log(books, 12313132))
    const contract = await (0, helpers_1.makeContract)();
    if (!contract)
        return;
    console.log(contract.getDayZero());
};
a();
//# sourceMappingURL=index.js.map