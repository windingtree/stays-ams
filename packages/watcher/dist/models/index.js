'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db_host = process.env.DB_HOST || 'development.db';
const db_login = process.env.DB_LOGIN || '';
const db_pass = process.env.DB_PASSWORD || '';
const sequelize = new Sequelize('sqlite', db_login, db_pass, {
    dialect: 'sqlite',
    host: db_host,
});
const db = {};
fs
    .readdirSync(__dirname)
    .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
})
    .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
});
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
module.exports = Object.assign(Object.assign({}, db), { sequelize,
    Sequelize });
//# sourceMappingURL=index.js.map