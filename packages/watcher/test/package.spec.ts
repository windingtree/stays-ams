import * as index from '../src/index'
import {expect} from 'chai';

describe('testing', () => {

  it('test', async () => {
    const a = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    const result = index.testing(a, b);
    expect(result).to.be.an('number');
    expect(result).to.equal(a + b);
  });

  it('event service test', async () => {
    const [result, sent] = index.testEventServiceWork();
    expect(result).to.be.an('array')
    expect(sent).to.be.an('boolean')
    expect(sent).to.equal(true);  });

  it('send mail service test', async () => {
    const result = index.testSendEmailServiceWork();
    expect(result).to.equal(true);
  });
});
