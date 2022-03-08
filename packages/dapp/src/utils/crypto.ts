import {AES, enc} from "crypto-js";

// Encrypts the data
export const encrypt = (data: string, password: string): string => {
  try {
    return AES
      .encrypt(data, password as string)
      .toString();
  } catch (error) {
    throw Error('Unable to encrypt');
  }
};

// Decrypts the data
export const decrypt = (encData: string, password: string): string => {
  let decrypted: string;
  try {
    decrypted = AES
      .decrypt(encData, password)
      .toString(enc.Utf8);
    if (decrypted === '') {
      throw Error('Decrypted data is empty');
    }
  } catch (error) {
    throw Error('Unable to decrypt');
  }
  return decrypted;
};
