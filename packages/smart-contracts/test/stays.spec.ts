/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-template */
import {
  ethers,
  deployments,
  getUnnamedAccounts,
  getNamedAccounts,
  network,
} from "hardhat";
import { BytesLike, BigNumber, ContractTransaction } from "ethers";
import { expect } from "./utils/chai-setup";

import { Stays } from "../typechain";
import { setupUser, setupUsers } from "./utils";
import { decodeDataUri } from './utils/dataUri';
import { extractEventFromTx } from './utils';
import { createVoucher } from '../src/voucher';

const COMMUNITY_MULTI_SIG = '0x07AED86bda7B36079296C1D94C12d6F48Beeb86C'
const PROXY = '0xEcfF1da7acD4025c532C04db3B57b454bAB95b4E'

const setup = deployments.createFixture(async () => {
  await deployments.fixture("Stays", {keepExistingDeployments: true});
  const { deployer, alice, bob, carol } = await getNamedAccounts();
  const contracts = {
    staysContract: <Stays>await ethers.getContractAt("Stays", PROXY),
  };
  const users = await setupUsers(await getUnnamedAccounts(), contracts);

  await network.provider.send('hardhat_impersonateAccount', [
    COMMUNITY_MULTI_SIG
  ])

  return {
    users,
    deployer: await setupUser(deployer, contracts),
    alice: await setupUser(alice, contracts),
    bob: await setupUser(bob, contracts),
    carol: await setupUser(carol, contracts),
    gov: await setupUser(COMMUNITY_MULTI_SIG, contracts),
    ...contracts,
  };
});

describe("Stays.sol", () => {
  // let users: ({ address: string } & { staysContract: Stays })[];
  let deployer: { address: string } & { staysContract: Stays };
  let alice: { address: string } & { staysContract: Stays };
  let bob: { address: string } & { staysContract: Stays };
  let carol: { address: string } & { staysContract: Stays };
  let gov: { address: string } & { staysContract: Stays };
  const testDataUri = "https://some.uri";

  beforeEach("load fixture", async () => {
    ({ deployer, alice, bob, carol, gov } = await setup());
  });

  describe("Correct Setup", () => {
    it("should have the right name and symbol", async () => {
      expect(await deployer.staysContract.name()).to.be.eq("Stay Amsterdam");
      expect(await deployer.staysContract.symbol()).to.be.eq("STAYAMS");
    });
    it("should have 0 facilities first", async () => {
      expect(
        await deployer.staysContract.getAllLodgingFacilityIds()
      ).to.be.of.length(0);
    });
  });

  describe('Pausable, Ownable', () => {
    describe('#pause()', () => {
      it('should throw if called not by an owner', async () => {
        await expect(
          alice.staysContract.pause()
        ).to.be.revertedWith('Ownable: caller is not the owner');
      });

      it('should pause contract', async () => {
        const tx = gov.staysContract.pause();
        await expect(tx)
          .to.emit(gov.staysContract, "Paused")
          .withArgs(gov.address);
        await gov.staysContract.unpause();
      });
    });
  });

  describe("registerLodgingFacility()", () => {
    let facilityId; 

    beforeEach(async () => {
      await alice.staysContract["registerLodgingFacility(string,bool)"](
        testDataUri,
        false
      );
      const facilities = await alice.staysContract.getAllLodgingFacilityIds()
      facilityId = facilities[facilities.length - 1]
    });

    it('should throw in paused mode', async () => {
      await gov.staysContract.pause();
      await expect(
        bob.staysContract["registerLodgingFacility(string,bool)"](
          testDataUri,
          true
        )
      ).to.be.revertedWith('Pausable: paused');
    });

    it("should have created facility with correct parameters", async () => {
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

    it("can deactivate/activate the facility", async () => {
      await expect(bob.staysContract.deactivateLodgingFacility(facilityId)).to.be.revertedWith('Only lodging facility owner is allowed')
      await expect(alice.staysContract.deactivateLodgingFacility(facilityId)).to.not.be.reverted
      await expect(alice.staysContract.activateLodgingFacility(facilityId)).to.not.be.reverted

      const {active} = await alice.staysContract.getLodgingFacilityById(facilityId)
      expect(active).to.be.equal(true)
    })

    it("can delete the facility", async () => {
      await expect(bob.staysContract.deleteLodgingFacility(facilityId)).to.be.revertedWith('Only lodging facility owner is allowed')
      await expect(alice.staysContract.deleteLodgingFacility(facilityId)).to.not.be.reverted
    })

    it("should transfer the facility's ownership to bob", async () => {
      const numFacilities_1 = (await alice.staysContract.getLodgingFacilityIdsByOwner(alice.address)).length
      await expect(alice.staysContract.yieldLodgingFacility(facilityId, bob.address)).to.not.be.reverted
      const facilities = await alice.staysContract.getLodgingFacilityIdsByOwner(alice.address)
      expect(facilities.length).to.be.equal(numFacilities_1 - 1)
    })

    it("can update the lodging facility's URI", async () => {
      await expect(alice.staysContract.updateLodgingFacility(facilityId, "")).to.be.revertedWith('Data URI must be provided')
      await expect(alice.staysContract.updateLodgingFacility(facilityId, "updatedUri")).to.not.be.reverted
      
      const { dataURI } = await alice.staysContract.getLodgingFacilityById(facilityId)
      expect(dataURI).to.be.equal("updatedUri")
    })
  });

  describe("getAllLodgingFacilityIds()", () => {
    it("should return an array of all lodging facility Ids", async () => {
      const initFacilitiesNumber = (await alice.staysContract.getActiveLodgingFacilityIds()).length;
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

      expect(
        await deployer.staysContract.getAllLodgingFacilityIds()
      ).to.be.of.length(initFacilitiesNumber + 3);
    });
  });

  describe("getMyLodgingFacilities()", () => {
    it("should return an array of Alice's loding facility Ids", async () => {
      const initFacilitiesNumber = (await alice.staysContract.getActiveLodgingFacilityIds()).length;

      await alice.staysContract["registerLodgingFacility(string,bool)"](
        testDataUri + 'aaa',
        true
      );
      await alice.staysContract["registerLodgingFacility(string,bool)"](
        testDataUri + "blaa",
        true
      );

      expect(
        await alice.staysContract.getAllLodgingFacilityIds()
      ).to.be.of.length(initFacilitiesNumber + 2);
    });
  });

  describe("addSpace()", () => {
    let facilityId: BytesLike;

    beforeEach(async () => {
      await alice.staysContract["registerLodgingFacility(string,bool)"](
        testDataUri + 'aaaa',
        true
      );
      // eslint-disable-next-line prefer-destructuring
      const facilities = await alice.staysContract.getAllLodgingFacilityIds()
      facilityId = facilities[facilities.length - 1]
    });

    it('should throw in paused mode', async () => {
      await gov.staysContract.pause();
      await expect(
        alice.staysContract["registerLodgingFacility(string,bool)"](
          testDataUri + 'werwerwerwerwe',
          true
        )
      ).to.be.revertedWith('Pausable: paused');
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
      let space = await alice.staysContract.spaces(spaceIds[0]);

      await expect(alice.staysContract.addSpace(facilityId, 1, 2, true, dataUri)).to.be.revertedWith('Space already exists')

      expect(spaceIds).to.be.of.length(1);
      expect(space.lodgingFacilityId).to.equal(facilityId);
      expect(space.capacity).to.equal(1);
      expect(space.pricePerNightWei).to.equal(2);
      expect(space.active).to.be.true;
      expect(space.exists).to.be.true;
      expect(space.dataURI).to.equal(dataUri);

      let activeSpaceIds = await alice.staysContract.getActiveSpaceIdsByFacilityId(facilityId)
      expect(activeSpaceIds.length).to.be.equal(1)
      expect(activeSpaceIds[0]).to.be.equal(spaceIds[0])

      await expect(bob.staysContract.deactivateSpace(spaceIds[0])).to.be.revertedWith('Only space owner is allowed')
      await alice.staysContract.deactivateSpace(spaceIds[0])
      
      activeSpaceIds = await alice.staysContract.getActiveSpaceIdsByFacilityId(facilityId)
      expect(activeSpaceIds.length).to.be.equal(0)

      await alice.staysContract.activateSpace(spaceIds[0])

      await alice.staysContract.updateSpace(
        spaceIds[0],
        69,
        10,
        "test"
      )

      space = await alice.staysContract.spaces(spaceIds[0]);

      expect(space.capacity).to.equal(69);
      expect(space.pricePerNightWei).to.equal(10);
      expect(space.dataURI).to.equal("test");

      const spaceGetter = await alice.staysContract.getSpaceById(spaceIds[0])
      expect(spaceGetter.exists).to.be.equal(true)
      expect(spaceGetter.lodgingFacilityId).to.be.equal(facilityId)
      expect(spaceGetter.capacity).to.be.equal(69)
      expect(spaceGetter.pricePerNightWei).to.be.equal(10)
      expect(spaceGetter.active).to.be.equal(true)
      expect(spaceGetter.dataURI).to.be.equal("test")

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

  describe("availability, bookings, checkin, checkout, cancel", () => {
      let fid;
      let f;
      let sid: BytesLike;
      let s;

      beforeEach(async () => {
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

      describe("newStay()", () => {
        it('should throw in paused mode', async () => {
          await gov.staysContract.pause();
          await expect(
            alice.staysContract.newStay(
              sid,
              10000,
              1,
              1,
              { value: 1000000 }
            )
          ).to.be.revertedWith('Pausable: paused');
        });

        it("should revert if payment is less than what's required", async () => {
          await expect(
            alice.staysContract.newStay(sid, 142, 1, 1, {
              value: 12344,
            })
          ).to.be.revertedWith("Need. More. Money!");
          alice.staysContract.newStay(sid, 142, 1, 1, {
            value: 12345,
          });
          await expect(
            bob.staysContract.newStay(sid, 142, 2, 5, {
              value: 123449,
            })
          ).to.be.revertedWith("Need. More. Money!");
          bob.staysContract.newStay(sid, 142, 2, 5, {
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
          const tokenId = await alice.staysContract.callStatic.newStay(
            sid,
            10000,
            1,
            1,
            { value: 1000000 }
          );
          await alice.staysContract.newStay(
            sid,
            10000,
            1,
            1,
            { value: 1000000 }
          );

          const tokensForCheckIn = await alice.staysContract.getTokensBySpaceId(sid, 0)

          const { exists } = await alice.staysContract.getSpaceByTokenId(tokenId)
          expect(exists).to.be.equal(true)

          expect(await deployer.staysContract.balanceOf(alice.address))
            .to.equal(initialBalance.add(BigNumber.from(1)));
          expect(await deployer.staysContract.ownerOf(tokenId)).to.equal(alice.address);

          const dataUri = decodeDataUri(await deployer.staysContract.tokenURI(tokenId), true) as any;

          // console.log(JSON.stringify(dataUri, null, 2));

          expect(dataUri.name).to.equal('Stay Amsterdam #1');
          // @todo add all props
        });

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

  describe("interfaces", () => {
    it("supports erc165", async () => {
      expect(await bob.staysContract.supportsInterface('0x80ac58cd')).to.be.equal(true)
    })
  })

  describe("modifications", () => {
    const valuePerNight = 100;
    let fid;
    let f;
    let sid: BytesLike;
    let s;

    beforeEach(async () => {
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

    describe("check in, check out", () => {

      describe("checkIn()", () => {
        const startDay = 100;
        const numDays = 3;
        let tokenId;
        let initialBalanceBob: BigNumber;
        let eventNewStay;
        let eventCheckIn;
        let txCheckIn: ContractTransaction;
        let brokenVoucher;
        let forbiddenVoucher;
        let voucher;

        beforeEach(async () => {
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
          const deposit = await alice.staysContract.depositOf(alice.address, sid, tokenId);

          expect(deposit.toNumber()).to.equal(valuePerNight * numDays);

          const { chainId } = await alice.staysContract.provider.getNetwork();
          brokenVoucher = await createVoucher(
            deployer.staysContract.signer,
            alice.address,
            bob.address,
            tokenId.toString(),
            alice.staysContract.address,
            chainId
          );
          forbiddenVoucher = await createVoucher(
            deployer.staysContract.signer,
            deployer.address,
            bob.address,
            tokenId.toString(),
            alice.staysContract.address,
            chainId
          );
          voucher = await createVoucher(
            alice.staysContract.signer,
            alice.address,
            bob.address,
            tokenId.toString(),
            alice.staysContract.address,
            chainId
          );
        });

        it("should throw if voucher signed with unknown signer", async () => {
          await expect(
            alice.staysContract.checkIn(tokenId, brokenVoucher)
          ).to.revertedWith('Broken voucher');
        });

        it("should throw if voucher signed by not allowed party", async () => {
          await expect(
            deployer.staysContract.checkIn(tokenId, forbiddenVoucher)
          ).to.revertedWith('Voucher signer is not allowed');
        });

        it("should throw if transaction sent by unknown sender", async () => {
          await expect(
            deployer.staysContract.checkIn(tokenId, voucher)
          ).to.revertedWith('Wrong caller');
        });

        it("should check in", async () => {
          txCheckIn = await bob.staysContract.checkIn(tokenId, voucher);
          const receipt = await txCheckIn.wait();
          const txCost = receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice);
          eventCheckIn = await extractEventFromTx(txCheckIn, 'CheckIn');
          expect(eventCheckIn.tokenId).to.equal(tokenId);

          // check balance. should be + valuePerNight
          const checkInBalance = await bob.staysContract.provider.getBalance(bob.address);
          expect(checkInBalance).to.equal(
            initialBalanceBob
              .add(BigNumber.from(valuePerNight))
              .sub(txCost)
          );

          // already checked in
          await expect(
            alice.staysContract.checkIn(tokenId, voucher)
          ).to.revertedWith('Already checked in');
          // change of deposit state
          expect(
            await alice.staysContract.depositState(tokenId)
          ).to.equal(1);
        });

        /*
         This is to check the following attack vector:

         1. alice books a stay at bob's hotel.
         2. bob now increases the price of room that alice is staying in.
         3. when alice checks in, instead of taking the first night's fee, bob takes the whole lot
         */
        it("should protect against malicious bob hotel operator", async () => {
          // bob gets sneaky and ready to steal from alice
          const attackTx = await bob.staysContract.updateSpace(sid, 10, valuePerNight * numDays, testDataUri + "space3453")
          const attackReceipt = await attackTx.wait();
          const attackTxCost = attackReceipt.cumulativeGasUsed.mul(attackReceipt.effectiveGasPrice);

          // alice checks in
          txCheckIn = await bob.staysContract.checkIn(tokenId, voucher);
          const receipt = await txCheckIn.wait();
          const txCost = receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice);
          eventCheckIn = await extractEventFromTx(txCheckIn, 'CheckIn');
          expect(eventCheckIn.tokenId).to.equal(tokenId);

          // alice has not had her entire trip taken from her deposit
          expect(await alice.staysContract.depositOf(alice.address, sid, tokenId)).to.be.equal(valuePerNight * (numDays - 1))

          // check balance. should be + valuePerNight
          const checkInBalance = await bob.staysContract.provider.getBalance(bob.address);
          expect(checkInBalance).to.equal(
            initialBalanceBob
              .add(BigNumber.from(valuePerNight))
              .sub(txCost.add(attackTxCost))
          );

          // already checked in
          await expect(
            alice.staysContract.checkIn(tokenId, voucher)
          ).to.revertedWith('Already checked in');
          // change of deposit state
          expect(
            await alice.staysContract.depositState(tokenId)
          ).to.equal(1);
        });
      });

      describe("checkOut()", () => {
        const startDay = 100;
        const numDays = 3;
        let tokenId;
        let voucher;
        let chainId;

        beforeEach(async () => {
          let tx = await alice.staysContract.newStay(
            sid,
            startDay,
            numDays,
            1,
            { value: valuePerNight * numDays }
          );
          const eventNewStay = await extractEventFromTx(tx, 'NewStay');
          tokenId = eventNewStay.tokenId;
          ({ chainId } = await alice.staysContract.provider.getNetwork());
          voucher = await createVoucher(
            alice.staysContract.signer,
            alice.address,
            bob.address,
            tokenId.toString(),
            alice.staysContract.address,
            chainId
          );
        });

        it('successfully checks in', async () => {
          const txCheckIn = await bob.staysContract.checkIn(tokenId, voucher);
          await txCheckIn.wait();
        })

        it('should throw if called not by an owner', async () => {
          await expect(
            alice.staysContract.checkOut(tokenId)
          ).to.revertedWith('Only space owner is allowed');
        });

        it('should throw unless checkout date', async () => {
          await expect(
            bob.staysContract.checkOut(tokenId)
          ).to.revertedWith('Forbidden unless checkout date');
        });

        it('should not be able to checkout a non-existant stay', async () => {
          await expect(bob.staysContract.checkOut(9849823)).to.be.revertedWith('Stay not found')
        })

        it('should checkout', async () => {
          const txCheckIn = await bob.staysContract.checkIn(tokenId, voucher);
          await txCheckIn.wait();
          const initialBalanceBob = await bob.staysContract.provider.getBalance(bob.address);
          await ethers.provider.send('evm_increaseTime', [(startDay + 1) * 86400]);
          const txCheckOut = await bob.staysContract.checkOut(tokenId);
          const receipt = await txCheckOut.wait();
          // console.log('RECEIPT', receipt);
          const checkoutTxCost = receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice);
          const eventCheckOut = await extractEventFromTx(txCheckOut, 'CheckOut');
          expect(eventCheckOut.tokenId).to.equal(tokenId);

          const finalBalanceBob = await bob.staysContract.provider.getBalance(bob.address);
          expect(finalBalanceBob).to.equal(
            initialBalanceBob
              .add(BigNumber.from(valuePerNight).mul(BigNumber.from(numDays-1)))
              .sub(checkoutTxCost)
          );

          await expect(bob.staysContract.checkOut(tokenId)).to.be.revertedWith('Already checked out')
        });

        it('can send stay as a gift and not have the giftee steal', async () => {
          // alice checks the deposit that she has made
          const deposit = await alice.staysContract.depositOf(alice.address, sid, tokenId)

          // alice gifts carol a stay
          await alice.staysContract.transferFrom(alice.address, carol.address, tokenId)
          expect(await alice.staysContract.depositOf(alice.address, sid, tokenId)).to.be.eq(0)
          expect(await carol.staysContract.depositOf(carol.address, sid, tokenId)).to.be.eq(deposit)

          // alice is mean and tries to check-in to bob's hotel using carol's gift
          await expect(bob.staysContract.checkIn(tokenId, voucher)).to.be.revertedWith('Voucher signer is not allowed')

          // carol generates her voucher
          voucher = await createVoucher(
            carol.staysContract.signer,
            carol.address,
            bob.address,
            tokenId.toString(),
            carol.staysContract.address,
            chainId
          );

          // carol checks into bob's hotel
          await expect(bob.staysContract.checkIn(tokenId, voucher)).to.not.be.reverted

          const initialBalanceBob = await bob.staysContract.provider.getBalance(bob.address);
          await ethers.provider.send('evm_increaseTime', [(startDay + 1) * 86400]);
          const txCheckOut = await bob.staysContract.checkOut(tokenId);
          const receipt = await txCheckOut.wait();
          // console.log('RECEIPT', receipt);
          const checkoutTxCost = receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice);
          const eventCheckOut = await extractEventFromTx(txCheckOut, 'CheckOut');
          expect(eventCheckOut.tokenId).to.equal(tokenId);

          const finalBalanceBob = await bob.staysContract.provider.getBalance(bob.address);
          expect(finalBalanceBob).to.equal(
            initialBalanceBob
              .add(BigNumber.from(valuePerNight).mul(BigNumber.from(numDays-1)))
              .sub(checkoutTxCost)
          );

          await expect(bob.staysContract.checkOut(tokenId)).to.be.revertedWith('Already checked out')
        });
      });

      // describe('cancel()', () => {
      //   const params = [
      //     {
      //       startDay: 200,
      //       numDays: 1
      //     },
      //     {
      //       startDay: 210,
      //       numDays: 2
      //     },
      //     {
      //       startDay: 220,
      //       numDays: 3
      //     }
      //   ];
      //   let chainId: number;
      //   let tokens: string[];

      //   const createStay = async (sid, startDay, numDays) => {
      //     let tx = await alice.staysContract.newStay(
      //       sid,
      //       startDay,
      //       numDays,
      //       1,
      //       { value: valuePerNight * numDays }
      //     );
      //     const eventNewStay = await extractEventFromTx(tx, 'NewStay');
      //     return eventNewStay.tokenId.toString();
      //   };

      //   before(async () => {
      //     const res = await alice.staysContract.provider.getNetwork();
      //     chainId = res.chainId;
      //     tokens = await Promise.all(
      //       params.map(
      //         p => createStay(sid, p.startDay, p.numDays)
      //       )
      //     );
      //   });

      //   it('should throw if called not by a token owner', async () => {
      //     await expect(
      //       bob.staysContract.cancel(tokens[0])
      //     ).to.revertedWith('Only stay token owner is allowed');
      //   });

      //   it('should throw if token already checked in', async () => {
      //     const voucher = await createVoucher(
      //       alice.staysContract.signer,
      //       alice.address,
      //       bob.address,
      //       tokens[0],
      //       alice.staysContract.address,
      //       chainId
      //     );
      //     const tx = await bob.staysContract.checkIn(tokens[0], voucher);
      //     await tx.wait();
      //     await expect(
      //       alice.staysContract.cancel(tokens[0])
      //     ).to.revertedWith('Refund not allowed in current state');
      //   });

      //   it('should cancel a stay', async () => {
      //     const weiAmount = BigNumber.from(valuePerNight)
      //       .mul(BigNumber.from(params[1].numDays));
      //     const initialBalanceAlice = await alice.staysContract.provider.getBalance(alice.address);
      //     const tx = await alice.staysContract.cancel(tokens[1]);
      //     const receipt = await tx.wait();
      //     const txCost = receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice);
      //     const cancelBalance = await alice.staysContract.provider.getBalance(alice.address);
      //     expect(cancelBalance).to.equal(
      //       initialBalanceAlice
      //         .add(weiAmount)
      //         .sub(txCost)
      //     );
      //     const refundEvent = await extractEventFromTx(tx, 'Refund');
      //     const cancelEvent = await extractEventFromTx(tx, 'Cancel');
      //     expect(refundEvent.payee).to.equal(alice.address);
      //     expect(refundEvent.weiAmount).to.equal(weiAmount);
      //     expect(refundEvent.spaceId).to.equal(sid);
      //     expect(refundEvent.tokenId.toString()).to.equal(tokens[1]);
      //     expect(cancelEvent.tokenId.toString()).to.equal(tokens[1]);
      //     await expect(
      //       alice.staysContract.ownerOf(tokens[1])
      //     ).to.revertedWith('ERC721: owner query for nonexistent token');
      //   });

      //   it('should throw if token already cancelled', async () => {
      //     await expect(
      //       alice.staysContract.cancel(tokens[1])
      //     ).to.revertedWith('ERC721: owner query for nonexistent token');
      //   });

      //   it('should throw if token already checked out', async () => {
      //     const voucher = await createVoucher(
      //       alice.staysContract.signer,
      //       alice.address,
      //       bob.address,
      //       tokens[2],
      //       alice.staysContract.address,
      //       chainId
      //     );
      //     const tx = await bob.staysContract.checkIn(tokens[2], voucher);
      //     await tx.wait();
      //     await ethers.provider.send('evm_increaseTime', [(params[2].startDay + 1) * 86400]);
      //     const txCheckOut = await bob.staysContract.checkOut(tokens[2]);
      //     await txCheckOut.wait();
      //     await expect(
      //       alice.staysContract.cancel(tokens[2])
      //     ).to.revertedWith('Refund not allowed in current state');
      //   });
      // });

    });
  });
});
