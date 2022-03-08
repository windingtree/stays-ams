import { createFakeLodgingFacility, createFakeSpace } from '../src/faker';
import { validateLodgingFacilityData, validateSpaceData } from '../src/validators';
import { expect } from 'chai';

describe('Data models package', () => {

  describe('Faker', () => {

    it('should create a valid lodging facility data', async () => {
      const data = createFakeLodgingFacility();
      expect(() => validateLodgingFacilityData(data)).not.to.throw;
    });

    it('should create a valid space data', async () => {
      const data = createFakeSpace();
      expect(() => validateSpaceData(data)).not.to.throw;
    });
  });
});