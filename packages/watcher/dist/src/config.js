"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.APP_FILE_WEB3STORAGE_KEY ||
    process.env.APP_FILE_WEB3STORAGE_KEY === '') {
    throw new Error('APP_FILE_WEB3STORAGE_KEY must be provided in the ENV');
}
if (!process.env.APP_CONTRACT_ADDRESS ||
    process.env.APP_CONTRACT_ADDRESS === '') {
    throw new Error('APP_CONTRACT_ADDRESS must be provided in the ENV');
}
if (!process.env.APP_NETWORK_PROVIDER ||
    process.env.APP_NETWORK_PROVIDER === '') {
    throw new Error('APP_NETWORK_PROVIDER must be provided in the ENV');
}
if (!process.env.SENDGRID_API_KEY ||
    process.env.SENDGRID_API_KEY === '') {
    throw new Error('SENDGRID_API_KEY must be provided in the ENV');
}
if (!process.env.SENDRID_EMAIL_FROM ||
    process.env.SENDRID_EMAIL_FROM === '') {
    throw new Error('SENDRID_EMAIL_FROM must be provided in the ENV');
}
//# sourceMappingURL=config.js.map