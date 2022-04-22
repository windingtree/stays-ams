'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize) => {
    class BlockNumber extends sequelize_1.Model {
    }
    BlockNumber.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        block_number: sequelize_1.DataTypes.BIGINT
    }, {
        sequelize,
        modelName: 'BlockNumber',
    });
    return BlockNumber;
};
//# sourceMappingURL=blocknumber.js.map