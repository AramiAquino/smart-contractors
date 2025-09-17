import { expect } from "chai";
import { network } from "hardhat";
import { WorkEscrow, MockERC20 } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

const { ethers } = await network.connect();

describe("WorkEscrow", function () {
  let workEscrow: WorkEscrow;
  let mockUSDC: MockERC20;
  let owner: SignerWithAddress;
  let client: SignerWithAddress;
  let worker: SignerWithAddress;
  let otherAccount: SignerWithAddress;

  const WORK_AMOUNT = ethers.parseUnits("100", 6); // 100 USDC (6 decimals)
  const WORK_TITLE = "Build a dApp";
  const WORK_DESCRIPTION = "Create a decentralized application with React frontend";
  const DELIVERY_DATA = "ipfs://QmHash123";

  beforeEach(async function () {
    [owner, client, worker, otherAccount] = await ethers.getSigners();

    // Deploy Mock USDC
    mockUSDC = await ethers.deployContract("MockERC20", [
      "USD Coin",
      "USDC",
      6, // 6 decimals like real USDC
    ]);

    // Deploy WorkEscrow
    workEscrow = await ethers.deployContract("WorkEscrow", [
      await mockUSDC.getAddress(),
    ]);

    // Mint USDC to client and approve escrow contract
    await mockUSDC.mint(client.address, ethers.parseUnits("10000", 6));
    await mockUSDC.connect(client).approve(
      await workEscrow.getAddress(), 
      ethers.parseUnits("10000", 6)
    );
  });

  describe("Deployment", function () {
    it("Should set the right USDC token", async function () {
      expect(await workEscrow.usdcToken()).to.equal(await mockUSDC.getAddress());
    });

    it("Should set the right owner", async function () {
      expect(await workEscrow.owner()).to.equal(owner.address);
    });
  });

  describe("Work Creation", function () {
    it("Should create work with assigned worker", async function () {
      const tx = await workEscrow.connect(client).createWork(
        worker.address,
        WORK_AMOUNT,
        WORK_TITLE,
        WORK_DESCRIPTION,
        0
      );

      await expect(tx)
        .to.emit(workEscrow, "WorkCreated")
        .withArgs(1, client.address, worker.address, WORK_AMOUNT, WORK_TITLE);

      const work = await workEscrow.getWork(1);
      expect(work.id).to.equal(1);
      expect(work.client).to.equal(client.address);
      expect(work.worker).to.equal(worker.address);
      expect(work.amount).to.equal(WORK_AMOUNT);
      expect(work.status).to.equal(0); // Created
    });

    it("Should create open work (no assigned worker)", async function () {
      await workEscrow.connect(client).createWork(
        ethers.ZeroAddress,
        WORK_AMOUNT,
        WORK_TITLE,
        WORK_DESCRIPTION,
        0
      );

      const work = await workEscrow.getWork(1);
      expect(work.worker).to.equal(ethers.ZeroAddress);
    });

    it("Should transfer USDC to escrow", async function () {
      const initialBalance = await mockUSDC.balanceOf(await workEscrow.getAddress());
      
      await workEscrow.connect(client).createWork(
        worker.address,
        WORK_AMOUNT,
        WORK_TITLE,
        WORK_DESCRIPTION,
        0
      );

      const finalBalance = await mockUSDC.balanceOf(await workEscrow.getAddress());
      expect(finalBalance - initialBalance).to.equal(WORK_AMOUNT);
    });

    it("Should revert with zero amount", async function () {
      await expect(
        workEscrow.connect(client).createWork(
          worker.address,
          0,
          WORK_TITLE,
          WORK_DESCRIPTION,
          0
        )
      ).to.be.revertedWith("Amount must be greater than 0");
    });

    it("Should revert with empty title", async function () {
      await expect(
        workEscrow.connect(client).createWork(
          worker.address,
          WORK_AMOUNT,
          "",
          WORK_DESCRIPTION,
          0
        )
      ).to.be.revertedWith("Title cannot be empty");
    });
  });

  describe("Work Acceptance", function () {
    beforeEach(async function () {
      await workEscrow.connect(client).createWork(
        worker.address,
        WORK_AMOUNT,
        WORK_TITLE,
        WORK_DESCRIPTION,
        0
      );
    });

    it("Should allow assigned worker to accept work", async function () {
      const tx = await workEscrow.connect(worker).acceptWork(1);

      await expect(tx)
        .to.emit(workEscrow, "WorkAccepted")
        .withArgs(1, worker.address);

      const work = await workEscrow.getWork(1);
      expect(work.status).to.equal(1); // InProgress
    });

    it("Should revert if wrong worker tries to accept", async function () {
      await expect(
        workEscrow.connect(otherAccount).acceptWork(1)
      ).to.be.revertedWith("Not the assigned worker");
    });

    it("Should revert if client tries to accept", async function () {
      await expect(
        workEscrow.connect(client).acceptWork(1)
      ).to.be.revertedWith("Not the assigned worker");
    });

    it("Should allow any worker to accept open work", async function () {
      // Create open work
      await workEscrow.connect(client).createWork(
        ethers.ZeroAddress,
        WORK_AMOUNT,
        WORK_TITLE,
        WORK_DESCRIPTION,
        0
      );

      await workEscrow.connect(otherAccount).acceptWork(2);

      const work = await workEscrow.getWork(2);
      expect(work.worker).to.equal(otherAccount.address);
      expect(work.status).to.equal(1); // InProgress
    });
  });

  describe("Work Submission", function () {
    beforeEach(async function () {
      await workEscrow.connect(client).createWork(
        worker.address,
        WORK_AMOUNT,
        WORK_TITLE,
        WORK_DESCRIPTION,
        0
      );
      await workEscrow.connect(worker).acceptWork(1);
    });

    it("Should allow worker to submit work", async function () {
      const tx = await workEscrow.connect(worker).submitWork(1, DELIVERY_DATA);

      await expect(tx)
        .to.emit(workEscrow, "WorkSubmitted")
        .withArgs(1, DELIVERY_DATA);

      const work = await workEscrow.getWork(1);
      expect(work.status).to.equal(2); // Submitted
      expect(work.deliveryData).to.equal(DELIVERY_DATA);
    });

    it("Should revert if non-worker tries to submit", async function () {
      await expect(
        workEscrow.connect(otherAccount).submitWork(1, DELIVERY_DATA)
      ).to.be.revertedWith("Only assigned worker can perform this action");
    });

    it("Should revert with empty delivery data", async function () {
      await expect(
        workEscrow.connect(worker).submitWork(1, "")
      ).to.be.revertedWith("Delivery data cannot be empty");
    });
  });

  describe("Work Approval", function () {
    beforeEach(async function () {
      await workEscrow.connect(client).createWork(
        worker.address,
        WORK_AMOUNT,
        WORK_TITLE,
        WORK_DESCRIPTION,
        0
      );
      await workEscrow.connect(worker).acceptWork(1);
      await workEscrow.connect(worker).submitWork(1, DELIVERY_DATA);
    });

    it("Should allow client to approve and pay worker", async function () {
      const initialWorkerBalance = await mockUSDC.balanceOf(worker.address);

      const tx = await workEscrow.connect(client).approveWork(1);

      await expect(tx)
        .to.emit(workEscrow, "WorkApproved")
        .withArgs(1, client.address, worker.address, WORK_AMOUNT);

      const work = await workEscrow.getWork(1);
      expect(work.status).to.equal(3); // Completed

      const finalWorkerBalance = await mockUSDC.balanceOf(worker.address);
      expect(finalWorkerBalance - initialWorkerBalance).to.equal(WORK_AMOUNT);
    });

    it("Should revert if non-client tries to approve", async function () {
      await expect(
        workEscrow.connect(otherAccount).approveWork(1)
      ).to.be.revertedWith("Only client can perform this action");
    });

    it("Should revert if work not submitted", async function () {
      // Create new work
      await workEscrow.connect(client).createWork(
        worker.address,
        WORK_AMOUNT,
        WORK_TITLE,
        WORK_DESCRIPTION,
        0
      );
      await workEscrow.connect(worker).acceptWork(2);

      await expect(
        workEscrow.connect(client).approveWork(2)
      ).to.be.revertedWith("Work not in required status");
    });
  });

  describe("Work Cancellation", function () {
    it("Should allow client to cancel Created work", async function () {
      await workEscrow.connect(client).createWork(
        worker.address,
        WORK_AMOUNT,
        WORK_TITLE,
        WORK_DESCRIPTION,
        0
      );

      const initialClientBalance = await mockUSDC.balanceOf(client.address);

      const tx = await workEscrow.connect(client).cancelWork(1);

      await expect(tx)
        .to.emit(workEscrow, "WorkCancelled")
        .withArgs(1, client.address);

      const work = await workEscrow.getWork(1);
      expect(work.status).to.equal(4); // Cancelled

      const finalClientBalance = await mockUSDC.balanceOf(client.address);
      expect(finalClientBalance - initialClientBalance).to.equal(WORK_AMOUNT);
    });

    it("Should allow client to cancel InProgress work", async function () {
      await workEscrow.connect(client).createWork(
        worker.address,
        WORK_AMOUNT,
        WORK_TITLE,
        WORK_DESCRIPTION,
        0
      );
      await workEscrow.connect(worker).acceptWork(1);

      await workEscrow.connect(client).cancelWork(1);

      const work = await workEscrow.getWork(1);
      expect(work.status).to.equal(4); // Cancelled
    });

    it("Should not allow cancellation of Submitted work", async function () {
      await workEscrow.connect(client).createWork(
        worker.address,
        WORK_AMOUNT,
        WORK_TITLE,
        WORK_DESCRIPTION,
        0
      );
      await workEscrow.connect(worker).acceptWork(1);
      await workEscrow.connect(worker).submitWork(1, DELIVERY_DATA);

      await expect(
        workEscrow.connect(client).cancelWork(1)
      ).to.be.revertedWith("Cannot cancel work in current status");
    });

    it("Should revert if non-client tries to cancel", async function () {
      await workEscrow.connect(client).createWork(
        worker.address,
        WORK_AMOUNT,
        WORK_TITLE,
        WORK_DESCRIPTION,
        0
      );

      await expect(
        workEscrow.connect(otherAccount).cancelWork(1)
      ).to.be.revertedWith("Only client can perform this action");
    });
  });

  describe("Access Control", function () {
    it("Should revert for non-existent work", async function () {
      await expect(
        workEscrow.getWork(999)
      ).to.be.revertedWith("Work does not exist");
    });

    it("Should return next work ID", async function () {
      expect(await workEscrow.getNextWorkId()).to.equal(1);
      
      await workEscrow.connect(client).createWork(
        worker.address,
        WORK_AMOUNT,
        WORK_TITLE,
        WORK_DESCRIPTION,
        0
      );
      
      expect(await workEscrow.getNextWorkId()).to.equal(2);
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow owner to pause/unpause", async function () {
      await workEscrow.connect(owner).pause();
      
      await expect(
        workEscrow.connect(client).createWork(
          worker.address,
          WORK_AMOUNT,
          WORK_TITLE,
          WORK_DESCRIPTION,
          0
        )
      ).to.be.revertedWith("Pausable: paused");

      await workEscrow.connect(owner).unpause();
      
      // Should work after unpause
      await workEscrow.connect(client).createWork(
        worker.address,
        WORK_AMOUNT,
        WORK_TITLE,
        WORK_DESCRIPTION,
        0
      );
    });

    it("Should revert pause from non-owner", async function () {
      await expect(
        workEscrow.connect(client).pause()
      ).to.be.revertedWith("OwnableUnauthorizedAccount");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle multiple works correctly", async function () {
      // Create multiple works
      await workEscrow.connect(client).createWork(
        worker.address,
        WORK_AMOUNT,
        "Work 1",
        WORK_DESCRIPTION,
        0
      );
      
      await workEscrow.connect(client).createWork(
        otherAccount.address,
        WORK_AMOUNT * 2n,
        "Work 2",
        WORK_DESCRIPTION,
        0
      );

      const work1 = await workEscrow.getWork(1);
      const work2 = await workEscrow.getWork(2);

      expect(work1.title).to.equal("Work 1");
      expect(work1.amount).to.equal(WORK_AMOUNT);
      expect(work2.title).to.equal("Work 2");
      expect(work2.amount).to.equal(WORK_AMOUNT * 2n);
    });

    it("Should handle work flow with deadline", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      
      await workEscrow.connect(client).createWork(
        worker.address,
        WORK_AMOUNT,
        WORK_TITLE,
        WORK_DESCRIPTION,
        deadline
      );

      const work = await workEscrow.getWork(1);
      expect(work.deadline).to.equal(deadline);
    });
  });
});
