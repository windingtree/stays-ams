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
const { sequelize } = require('../../models/index');
const BlockNumber = require('../../models/blocknumber');
class default_1 {
    constructor() {
        this.model = BlockNumber(sequelize);
    }
    getLastBlockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            const lastModel = yield this.model.findOne({
                order: [
                    ['id', 'desc']
                ]
            });
            return lastModel.block_number;
        });
    }
    store(id) {
        this.model.create({
            "block_number": id
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=BlockRepository.js.map