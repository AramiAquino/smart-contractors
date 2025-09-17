const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WorkEscrow Simple Tests", function () {
  let workEscrow;
  let mockUSDC;
  let owner;
  let client;
  let worker;

  const WORK_AMOUNT = ethers.parseUnits("100", 6); // 100 USDC (6 decimals)
  const WORK_TITLE = "Build a dApp";
  const WORK_DESCRIPTION = "Create a decentralized application with React frontend";

  beforeEach(async function () {
    [owner, client, worker] = await ethers.getSigners();

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
    it("Should create a new work successfully", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
      
      const tx = await workEscrow.connect(client).createWork(
        ethers.ZeroAddress, // No specific worker assigned
        WORK_AMOUNT,
        WORK_TITLE,
        WORK_DESCRIPTION,
        deadline
      );

      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1); // Transaction successful

      const work = await workEscrow.works(1);
      expect(work.id).to.equal(1n);
      expect(work.client).to.equal(client.address);
      expect(work.worker).to.equal(ethers.ZeroAddress);
      expect(work.amount).to.equal(WORK_AMOUNT);
      expect(work.title).to.equal(WORK_TITLE);
      expect(work.description).to.equal(WORK_DESCRIPTION);
      expect(work.status).to.equal(0n); // Created
    });

    it("Should transfer USDC to escrow on work creation", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      
      const clientBalanceBefore = await mockUSDC.balanceOf(client.address);
      const escrowBalanceBefore = await mockUSDC.balanceOf(await workEscrow.getAddress());
      
      await workEscrow.connect(client).createWork(
        ethers.ZeroAddress,
        WORK_AMOUNT,
        WORK_TITLE,
        WORK_DESCRIPTION,
        deadline
      );

      const clientBalanceAfter = await mockUSDC.balanceOf(client.address);
      const escrowBalanceAfter = await mockUSDC.balanceOf(await workEscrow.getAddress());

      expect(clientBalanceBefore - clientBalanceAfter).to.equal(WORK_AMOUNT);
      expect(escrowBalanceAfter - escrowBalanceBefore).to.equal(WORK_AMOUNT);
    });
  });

  describe("Work Acceptance", function () {
    beforeEach(async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      await workEscrow.connect(client).createWork(
        ethers.ZeroAddress,
        WORK_AMOUNT,
        WORK_TITLE,
        WORK_DESCRIPTION,
        deadline
      );
    });

    it("Should allow worker to accept work", async function () {
      const tx = await workEscrow.connect(worker).acceptWork(1);
      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);

      const work = await workEscrow.works(1);
      expect(work.worker).to.equal(worker.address);
      expect(work.status).to.equal(1n); // InProgress
    });
  });

  describe("Work Submission", function () {
    beforeEach(async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      await workEscrow.connect(client).createWork(
        ethers.ZeroAddress,
        WORK_AMOUNT,
        WORK_TITLE,
        WORK_DESCRIPTION,
        deadline
      );
      await workEscrow.connect(worker).acceptWork(1);
    });

    it("Should allow worker to submit work", async function () {
      const deliveryData = "ipfs://QmHash123";
      const tx = await workEscrow.connect(worker).submitWork(1, deliveryData);
      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);

      const work = await workEscrow.works(1);
      expect(work.deliveryData).to.equal(deliveryData);
      expect(work.status).to.equal(2n); // Submitted
    });
  });

  describe("Work Approval", function () {
    beforeEach(async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      await workEscrow.connect(client).createWork(
        ethers.ZeroAddress,
        WORK_AMOUNT,
        WORK_TITLE,
        WORK_DESCRIPTION,
        deadline
      );
      await workEscrow.connect(worker).acceptWork(1);
      await workEscrow.connect(worker).submitWork(1, "ipfs://QmHash123");
    });

    it("Should allow client to approve and complete work", async function () {
      const workerBalanceBefore = await mockUSDC.balanceOf(worker.address);
      const escrowBalanceBefore = await mockUSDC.balanceOf(await workEscrow.getAddress());

      const tx = await workEscrow.connect(client).approveWork(1);
      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);

      const work = await workEscrow.works(1);
      expect(work.status).to.equal(3n); // Completed

      const workerBalanceAfter = await mockUSDC.balanceOf(worker.address);
      const escrowBalanceAfter = await mockUSDC.balanceOf(await workEscrow.getAddress());

      expect(workerBalanceAfter - workerBalanceBefore).to.equal(WORK_AMOUNT);
      expect(escrowBalanceBefore - escrowBalanceAfter).to.equal(WORK_AMOUNT);
    });
  });

  describe("Pausable Functionality", function () {
    it("Should allow owner to pause and unpause", async function () {
      await workEscrow.pause();
      expect(await workEscrow.paused()).to.be.true;

      await workEscrow.unpause();
      expect(await workEscrow.paused()).to.be.false;
    });
  });

  describe("Access Control", function () {
    it("Should allow owner to withdraw stuck tokens", async function () {
      // Send some tokens directly to the contract
      await mockUSDC.mint(await workEscrow.getAddress(), ethers.parseUnits("1000", 6));
      
      const ownerBalanceBefore = await mockUSDC.balanceOf(owner.address);
      
      await workEscrow.emergencyWithdraw(await mockUSDC.getAddress(), ethers.parseUnits("1000", 6));
      
      const ownerBalanceAfter = await mockUSDC.balanceOf(owner.address);
      expect(ownerBalanceAfter - ownerBalanceBefore).to.equal(ethers.parseUnits("1000", 6));
    });
  });
});
