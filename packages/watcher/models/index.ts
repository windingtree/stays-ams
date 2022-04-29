'use strict';
import dotenv from "dotenv";
import { Sequelize } from 'sequelize';

dotenv.config();

const db_host = process.env.DB_HOST || 'development.db';

export const sequelize = new Sequelize('sqlite', '', 'db_pass', {
  dialect: 'sqlite',
  host: db_host,
});

export default {
  sequelize: sequelize,
  Sequelize: Sequelize
};
