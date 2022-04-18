import dotenv from "dotenv"
dotenv.config();

if (
  !process.env.APP_FILE_WEB3STORAGE_KEY ||
  process.env.APP_FILE_WEB3STORAGE_KEY === ''
) {
  throw new Error('APP_FILE_WEB3STORAGE_KEY must be provided in the ENV');
}

if (
  !process.env.APP_CONTRACT_ADDRESS ||
  process.env.APP_CONTRACT_ADDRESS === ''
) {
  throw new Error('APP_CONTRACT_ADDRESS must be provided in the ENV');
}

if (
  !process.env.APP_NETWORK_PROVIDER ||
  process.env.APP_NETWORK_PROVIDER === ''
) {
  throw new Error('APP_NETWORK_PROVIDER must be provided in the ENV');
}
