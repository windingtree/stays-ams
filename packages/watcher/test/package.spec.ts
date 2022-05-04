import { expect } from 'chai';
import { Op } from 'sequelize';
import { sequelize } from '../models';
import { BlockNumberInit } from "../models/blocknumber";
import { StayInit } from "../models/stay";
import { makeContract } from "../src/helpers";
import StayEntityService from "../src/services/StayEntityService";
import StaysRepository from "../src/repositories/StaysRepository";
import StaysWorkerService from "../src/services/StaysWorkerService";

const blockNumberModel = BlockNumberInit(sequelize);
const StayModel = StayInit(sequelize);

describe('Test worker', async () => {
  let fromStayModelId: number;
  const stay = new StaysRepository();

  it('Remove all block numbers where id > 1', async () => {
    await blockNumberModel.destroy(
      {
        where: {
          id: {
            [ Op.gt ]: 1
          }
        }
      }
    );
  });

  it('Get last id from Stays table || 0', async () => {
    const fromStayModel = await StayModel.findOne({
      order: [
        [ 'id', 'desc' ]
      ]
    });

    if (fromStayModel) {
      fromStayModelId = fromStayModel.id;
    } else {
      fromStayModelId = 0;
    }

    expect(fromStayModelId).to.be.an('number');
  });

  it('Put data into DB', async () => {
    const contract = await makeContract();
    if (!contract) throw new Error();
    const books = new StayEntityService(contract);
    await books.process();
    await stay.store(books.getTokenEntities());
  }).timeout(20000);

  it('Check new records', async () => {
    const unprocessedStays = await stay.getUnprocessed();
    const lastItemId = unprocessedStays[ unprocessedStays.length - 1 ];
    expect(lastItemId.id).to.be.gt(fromStayModelId);
  });

  it('Send emails', async () => {
    await new StaysWorkerService(false).process();
  }).timeout(10000);

  it('Check all emails sent', async () => {
    const unprocessedStays = await stay.getUnprocessed();
    expect(unprocessedStays.length).to.be.equal(0);
  });
});
