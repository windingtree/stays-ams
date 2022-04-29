'use strict';
import dotenv from "dotenv"
import {Sequelize} from 'sequelize';

dotenv.config();

const db_host = process.env.DB_HOST || 'development.db';
const db_login = process.env.DB_LOGIN || '';
const db_pass = process.env.DB_PASSWORD || '';


export const sequelize = new Sequelize('sqlite', db_login, db_pass, {
  dialect: 'sqlite',
  host: db_host,
});

export default {
  sequelize: sequelize,
  Sequelize: Sequelize
};
