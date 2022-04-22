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
const Stay = require('../../models/stay');
const { sequelize } = require('../../models/index');
class default_1 {
    constructor() {
        this.stayModel = Stay(sequelize);
    }
    getUnprocessed() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.stayModel.findAll({
                where: {
                    status: 0
                }
            });
        });
    }
    store(entities) {
        return __awaiter(this, void 0, void 0, function* () {
            const mappedEntities = this.mapEntity(entities);
            yield this.stayModel.bulkCreate(mappedEntities);
            return true;
        });
    }
    mapEntity(entities) {
        return entities.map(entity => {
            var _a, _b;
            return {
                facility_id: entity.facilityId,
                space_id: entity.spaceId,
                token_id: entity.tokenId,
                email: (_b = (_a = entity.facility) === null || _a === void 0 ? void 0 : _a.contact) === null || _b === void 0 ? void 0 : _b.email,
                quantity: entity.quantity,
                status: 0,
                start_date: entity.startDayParsed,
                end_date: entity.endDayParsed
            };
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=StaysRepository.js.map