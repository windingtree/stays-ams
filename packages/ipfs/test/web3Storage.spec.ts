import 'dotenv/config';
import { utils, Web3StorageApi } from '../src';
import chai, { expect, assert } from 'chai';
import chp from 'chai-as-promised';
chai.use(chp);

console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

describe('Web3Storage API', () => {
  let apiKey: string;
  let stor: Web3StorageApi;

  before(async () => {
    apiKey = process.env['WEB3_STORAGE_API_KEY'] as string;
    stor = new Web3StorageApi(apiKey);
  });

  describe('#constructor', () => {

    it('should throw API key not provided error', async () => {
      const apiKey = undefined as unknown as string;
      assert.throws(
        () => { new Web3StorageApi(apiKey) },
        Error,
        'Web3Storage Authorization API token must be provided'
      );
    });
  });

  describe('#add', () => {

    it('should add object as a file', async () => {
      const hello = Math.random();
      const cid = await stor.add(
        utils.obj2File({ hello }, 'hello.json')
      );
      const data = JSON.parse(await stor.get(cid) as string);
      expect(data).to.have.haveOwnProperty('hello').to.equal(hello);
    });
  });
});
