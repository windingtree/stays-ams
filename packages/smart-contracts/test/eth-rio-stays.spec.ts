/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-template */
import {
  ethers,
  deployments,
  getUnnamedAccounts,
  getNamedAccounts,
} from "hardhat";
import chai from 'chai';
import { BytesLike, BigNumber, utils } from "ethers";
import { expect } from "./utils/chai-setup";

import { Stays } from "../typechain";
import { setupUser, setupUsers } from "./utils";
import { decodeDataUri } from './utils/dataUri';
import { extractEventFromTx } from './utils';

const setup = deployments.createFixture(async () => {
  await deployments.fixture("Stays");
  const { deployer, alice, bob } = await getNamedAccounts();
  const contracts = {
    staysContract: <Stays>await ethers.getContract("Stays"),
  };
  const users = await setupUsers(await getUnnamedAccounts(), contracts);

  return {
    users,
    deployer: await setupUser(deployer, contracts),
    alice: await setupUser(alice, contracts),
    bob: await setupUser(bob, contracts),
    ...contracts,
  };
});

describe("Stays.sol", () => {
  let users: ({ address: string } & { staysContract: Stays })[];
  let deployer: { address: string } & { staysContract: Stays };
  let alice: { address: string } & { staysContract: Stays };
  let bob: { address: string } & { staysContract: Stays };
  const testDataUri = "https://some.uri";

  before("load fixture", async () => {
    ({ users, deployer, alice, bob } = await setup());
    console.log('New setup');
  });

  describe("Correct Setup", () => {
    it("should have the right name and symbol", async () => {
      expect(await deployer.staysContract.name()).to.be.eq("StayToken");
      expect(await deployer.staysContract.symbol()).to.be.eq("ST22");
    });
    it("should have 0 facilities first", async () => {
      expect(
        await deployer.staysContract.getAllLodgingFacilityIds()
      ).to.be.of.length(0);
    });
  });

  describe("registerLodgingFacility()", () => {
    before(async () => {
      await alice.staysContract["registerLodgingFacility(string,bool)"](
        testDataUri,
        false
      );
    });

    it("should have created facility with correct parameters", async () => {
      const facilityId = (
        await alice.staysContract.getAllLodgingFacilityIds()
      )[0];
      const f = await alice.staysContract.lodgingFacilities(facilityId);

      expect(f.owner).to.equal(alice.address);
      expect(f.dataURI).to.equal(testDataUri);
      expect(f.exists).to.be.true;
      expect(f.active).to.be.false;
    });

    it("should emit LodgingFacilityCreated with the index of the added facility", async () => {
      let newId;
      const promise = bob.staysContract["registerLodgingFacility(string,bool)"](
        testDataUri,
        true
      );
      promise.then(async () => {
        const facilityId = (
          await bob.staysContract.getAllLodgingFacilityIds()
        )[0];
        newId = await bob.staysContract.lodgingFacilities(facilityId);

        await expect(promise)
          .to.emit(bob.staysContract, "LodgingFacilityCreated")
          .withArgs(newId, bob.address, testDataUri);
      });
    });

    it("should revert if no URI provided", async () => {
      await expect(
        alice.staysContract["registerLodgingFacility(string,bool)"]("", true)
      ).to.be.revertedWith("Data URI must be provided");
    });

    it("should revert if facility with the same owner/dataURI already exists", async () => {
      await expect(
        alice.staysContract["registerLodgingFacility(string,bool)"](
          testDataUri,
          true
        )
      ).to.be.revertedWith("Facility already exists");
    });
  });

  describe("getAllLodgingFacilityIds()", () => {
    let facilitiesNumber;
    before(async () => {
      facilitiesNumber = (await alice.staysContract.getActiveLodgingFacilityIds()).length + 1;
      await alice.staysContract["registerLodgingFacility(string,bool)"](
        testDataUri + 'alice',
        true
      );
      await alice.staysContract["registerLodgingFacility(string,bool)"](
        testDataUri + "bla",
        true
      );
      await bob.staysContract["registerLodgingFacility(string,bool)"](
        testDataUri + 'bob',
        true
      );
    });

    it("should return an array of all lodging facility Ids", async () => {
      expect(
        await deployer.staysContract.getAllLodgingFacilityIds()
      ).to.be.of.length(facilitiesNumber + 3);
    });
  });

  describe("getMyLodgingFacilities()", () => {
    let facilitiesNumber;
    before(async () => {
      facilitiesNumber = (await alice.staysContract.getActiveLodgingFacilityIds()).length + 1;

      await alice.staysContract["registerLodgingFacility(string,bool)"](
        testDataUri + 'aaa',
        true
      );
      await alice.staysContract["registerLodgingFacility(string,bool)"](
        testDataUri + "blaa",
        true
      );
    });

    it("should return an array of Alice's loding facility Ids", async () => {
      expect(
        await alice.staysContract.getAllLodgingFacilityIds()
      ).to.be.of.length(facilitiesNumber + 2);
    });
  });

  describe("addSpace()", () => {
    let facilityId: BytesLike;

    before(async () => {
      await alice.staysContract["registerLodgingFacility(string,bool)"](
        testDataUri + 'aaaa',
        true
      );
      // eslint-disable-next-line prefer-destructuring
      facilityId = (await alice.staysContract.getAllLodgingFacilityIds())[0];
    });

    it("should revert if non-owner tries to add a Space", async () => {
      await expect(
        bob.staysContract.addSpace(facilityId, 1, 2, true, testDataUri + 'add0')
      ).to.be.revertedWith("Only facility owner may add Spaces");
    });

    it("should revert if trying to add a Space to non-existing facility", async () => {
      await expect(
        alice.staysContract.addSpace(
          "0x0000000000000000000000000000000000000000000000000000000000000001",
          1,
          2,
          true,
          testDataUri
        )
      ).to.be.revertedWith("Facility does not exist");
    });

    it("should add a Space with correct parameters", async () => {
      const dataUri = testDataUri + 'add1';
      await alice.staysContract.addSpace(facilityId, 1, 2, true, dataUri);
      const spaceIds = await alice.staysContract.getSpaceIdsByFacilityId(
        facilityId
      );
      const space = await alice.staysContract.spaces(spaceIds[0]);

      expect(spaceIds).to.be.of.length(1);
      expect(space.lodgingFacilityId).to.equal(facilityId);
      expect(space.capacity).to.equal(1);
      expect(space.pricePerNightWei).to.equal(2);
      expect(space.active).to.be.true;
      expect(space.exists).to.be.true;
      expect(space.dataURI).to.equal(dataUri);
    });

    it("should emit SpaceAdded with correct params", async () => {
      const dataUri = testDataUri + 'add2';
      const txRaw = alice.staysContract.addSpace(facilityId, 1, 2, true, testDataUri + 'add2');
      const tx = await txRaw;
      const receipt = await tx.wait();
      const event = receipt?.events?.find(e => e.event === 'SpaceAdded');
      await expect(txRaw)
        .to.emit(alice.staysContract, "SpaceAdded")
        .withArgs(event?.args?.spaceId, facilityId, 1, 2, true, dataUri);
    });
  });

  describe("availability, bookings, checkin, checkout, modifications, cancellations", () => {
      let fid;
      let f;
      let sid: BytesLike;
      let s;

      before(async () => {
        let tx = await alice.staysContract["registerLodgingFacility(string,bool)"](
          testDataUri + 'aaa123',
          true
        );
        let event = await extractEventFromTx(tx, 'LodgingFacilityCreated');
        fid = event.facilityId;
        f = await alice.staysContract.lodgingFacilities(fid);

        tx = await alice.staysContract.addSpace(
          fid,
          10,
          12345,
          true,
          testDataUri + "space1"
        );
        event = await extractEventFromTx(tx, 'SpaceAdded');
        sid = event.spaceId;
        s = await alice.staysContract.spaces(sid);
      });

      describe("getAvailability()", async () => {
        it("should return correct initial values", async () => {
          expect(
            await alice.staysContract.getAvailability(sid, 100, 3)
          ).to.deep.equal([
            BigNumber.from(10), BigNumber.from(10), BigNumber.from(10)
          ]);
        });

        it("should return correct values", async () => {
          // Booking: spaceId, dayStart, numberOfDays, numberOfSpaces, tokenURI
          await alice.staysContract.newStay(
            sid,
            100,
            1,
            5,
            { value: 1000000 }
          );
          expect(
            await alice.staysContract.getAvailability(sid, 99, 5)
          ).to.deep.equal([
            BigNumber.from(10), BigNumber.from(5), BigNumber.from(10),
            BigNumber.from(10), BigNumber.from(10)
          ]);
          await alice.staysContract.newStay(
            sid,
            101,
            2,
            3,
            { value: 1000000 }
          );
          expect(
            await alice.staysContract.getAvailability(sid, 99, 5)
          ).to.deep.equal([
            BigNumber.from(10), BigNumber.from(5), BigNumber.from(7),
            BigNumber.from(7), BigNumber.from(10)
          ]);
          await alice.staysContract.newStay(
            sid,
            102,
            1,
            1,
            { value: 1000000 }
          );
          expect(
            await alice.staysContract.getAvailability(sid, 99, 5)
          ).to.deep.equal([
            BigNumber.from(10), BigNumber.from(5), BigNumber.from(7),
            BigNumber.from(6), BigNumber.from(10)
          ]);
          await alice.staysContract.newStay(
            sid, 99, 2, 2,
             {
            value: 1000000,
          });
          expect(
            await alice.staysContract.getAvailability(sid, 99, 5)
          ).to.deep.equal([
            BigNumber.from(8), BigNumber.from(3), BigNumber.from(7),
            BigNumber.from(6), BigNumber.from(10)]);
          await alice.staysContract.newStay(sid, 99, 5, 3, {
            value: 1000000,
          });
          expect(
            await alice.staysContract.getAvailability(sid, 99, 5)
          ).to.deep.equal([
            BigNumber.from(5), BigNumber.from(0), BigNumber.from(4),
            BigNumber.from(3), BigNumber.from(7)
          ]);
        });
      });

      describe("newStay()", async () => {
        it("should revert if payment is less than what's required", async () => {
          await expect(
            alice.staysContract.newStay(sid, 42, 1, 1, {
              value: 12344,
            })
          ).to.be.revertedWith("Need. More. Money!");
          alice.staysContract.newStay(sid, 42, 1, 1, {
            value: 12345,
          });
          await expect(
            bob.staysContract.newStay(sid, 42, 2, 5, {
              value: 123449,
            })
          ).to.be.revertedWith("Need. More. Money!");
          bob.staysContract.newStay(sid, 42, 2, 5, {
            value: 123450,
          });
        });

        it("should revert if trying to book for further than one day in the past", async () => {
          const dayZero = await alice.staysContract.dayZero();
          const now = Math.floor(+new Date() / 1000);
          const testDay = Math.floor((now - dayZero) / 86400);

          // This is fine
          await alice.staysContract.newStay(
            sid,
            testDay - 1,
            1,
            1,
            { value: 1000000 }
          );

          // This is not
          await expect(
            alice.staysContract.newStay(
              sid,
              testDay - 2,
              1,
              1,
              { value: 1000000 }
            )
          ).to.be.revertedWith("Don't stay in the past");
        });

        it("should send user a Stay NFT", async () => {
          const initialBalance = await deployer.staysContract.balanceOf(alice.address);
          await alice.staysContract.newStay(
            sid,
            10000,
            1,
            1,
            { value: 1000000 }
          );
          expect(await deployer.staysContract.balanceOf(alice.address))
            .to.equal(initialBalance.add(BigNumber.from(1)));
          expect(await deployer.staysContract.ownerOf(1)).to.equal(alice.address);

          const dataUri = decodeDataUri(await deployer.staysContract.tokenURI(1), true) as any;

          // console.log(JSON.stringify(dataUri, null, 2));

          expect(dataUri.name).to.equal('StayToken #1');
          // @todo add all props
        });

        // it("should send the money to the facility escrow", async () => {
        //   expect(false).to.be.true
        // })

        it("should emit NewStay", async () => {
          const promise = alice.staysContract.newStay(
            sid,
            100,
            1,
            1,
            { value: 1000000 }
          );
          promise.then(async (tid) => {
            await expect(promise)
              .to.emit(alice.staysContract, "NewStay")
              .withArgs(sid, tid);
          });
        });
      });
    }
  );

  describe("modifications, cancellations", async () => {
    const valuePerNight = 100;
    let fid;
    let f;
    let sid: BytesLike;
    let s;

    before(async () => {
      let tx = await bob.staysContract["registerLodgingFacility(string,bool)"](
        testDataUri + '9769768',
        true
      );
      let event = await extractEventFromTx(tx, 'LodgingFacilityCreated');
      fid = event.facilityId;
      f = await bob.staysContract.lodgingFacilities(fid);

      tx = await bob.staysContract.addSpace(
        fid,
        10,
        valuePerNight,
        true,
        testDataUri + "space3453"
      );
      event = await extractEventFromTx(tx, 'SpaceAdded');
      sid = event.spaceId;
      s = await bob.staysContract.spaces(sid);
    });

    describe("check in, check out", async () => {

      describe("checkIn()", async () => {
        const startDay = 100;
        const numDays = 3;
        let tokenId;
        let initialBalanceBob;
        let eventNewStay;
        let eventCheckIn;
        let txCheckIn;

        before(async () => {
          initialBalanceBob = await bob.staysContract.provider.getBalance(bob.address);
          let tx = await alice.staysContract.newStay(
            sid,
            startDay,
            numDays,
            1,
            { value: valuePerNight * numDays }
          );

          eventNewStay = await extractEventFromTx(tx, 'NewStay');
          tokenId = eventNewStay.tokenId;
          const deposit = await alice.staysContract.depositOf(alice.address, sid);

          expect(deposit.toNumber()).to.equal(valuePerNight * numDays);

          txCheckIn = await alice.staysContract.checkIn(tokenId);
          eventCheckIn = await extractEventFromTx(txCheckIn, 'CheckIn');
          expect(eventCheckIn.tokenId).to.equal(tokenId);

          // check balance. should be + valuePerNight
          const signInBalance = await bob.staysContract.provider.getBalance(bob.address);
          expect(signInBalance).to.equal(
            initialBalanceBob.add(BigNumber.from(valuePerNight))
          );

          await expect(
            alice.staysContract.checkIn(tokenId)
          ).to.revertedWith('Already checked in');
        });

        it("should change Stay status to 'checked_in'", async () => {
          expect(
            await alice.staysContract.depositState(alice.address, sid)
          ).to.equal(1);
        })

        it("should send the first day escrow amount to the facility address", async () => {
          const {
            payer,
            payee,
            weiAmount,
            spaceId
          } = await extractEventFromTx(txCheckIn, 'Withdraw');
          expect(payer).to.equal(alice.address);
          expect(payee).to.equal(bob.address);
          expect(weiAmount).to.equal(BigNumber.from(valuePerNight));
          expect(spaceId).to.equal(sid);
          const newBalanceBob = await bob.staysContract.provider.getBalance(bob.address);
          expect(newBalanceBob).to.equal(initialBalanceBob.add(BigNumber.from(valuePerNight)));
        });
      });

      describe("checkOut()", async () => {
        const startDay = 100;
        const numDays = 3;
        let tokenId;
        let initialBalanceBob;

        before(async () => {
          initialBalanceBob = await bob.staysContract.provider.getBalance(bob.address);
          let tx = await alice.staysContract.newStay(
            sid,
            startDay,
            numDays,
            1,
            { value: valuePerNight * numDays }
          );
          const eventNewStay = await extractEventFromTx(tx, 'NewStay');
          tokenId = eventNewStay.tokenId;
          const txCheckIn = await alice.staysContract.checkIn(tokenId);
          await txCheckIn.wait();
        });

        it('should throw if called not by an owner', async () => {
          await expect(
            alice.staysContract.checkOut(tokenId)
          ).to.revertedWith('Only space owner is allowed');
        });

        // it('should throw unless checkout date', async () => {
        //   console.log('@@@ bob address', bob.address);
        //   await expect(
        //     bob.staysContract.checkOut(tokenId)
        //   ).to.revertedWith('Forbidden unless checkout date');
        // });

        // it('should checkout', async () => {
        //   await ethers.provider.send('evm_increaseTime', [(startDay + 1) * 86400]);
        //   const txCheckOut = await bob.staysContract.checkOut(tokenId);
        //   const eventCheckOut = await extractEventFromTx(txCheckOut, 'CheckOut');
        //   expect(eventCheckOut.tokenId).to.equal(tokenId);

        //   const finalBalanceBob = await bob.staysContract.provider.getBalance(bob.address);
        //   expect(finalBalanceBob).to.equal(
        //     initialBalanceBob
        //       .add(
        //         BigNumber.from(valuePerNight)
        //           .mul(BigNumber.from(numDays))
        //       )
        //   );
        // });
      });

    });

  });

});
