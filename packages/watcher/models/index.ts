'use strict';
import dotenv from "dotenv"

dotenv.config();

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

module.exports = {
  ...db,
  sequelize,
  Sequelize
};
