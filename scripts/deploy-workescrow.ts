import { network, ethers } from "hardhat";

// USDC addresses por red
const USDC_ADDRESSES = {
  sepolia: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // USDC on Sepolia
  mainnet: "0xA0b86a33E6441c8C47E6B6c68B3e6d4B7D7F8e3e", // Real USDC (example)
  hardhat: "", // Will be deployed locally
};

async function main() {
  const networkName = network.name;
  console.log(`\n🚀 Deploying WorkEscrow to ${networkName}...`);

  const [deployer] = await ethers.getSigners();
  console.log(`📝 Deploying with account: ${deployer.address}`);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Account balance: ${ethers.formatEther(balance)} ETH`);

  let usdcAddress: string;

  // Determinar dirección del USDC según la red
  if (networkName === "hardhat" || networkName === "localhost") {
    // Deploy MockERC20 for local testing
    console.log("\n🔧 Deploying MockERC20 for local testing...");
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const mockUSDC = await MockERC20.deploy("USD Coin", "USDC", 6);
    await mockUSDC.waitForDeployment();
    
    usdcAddress = await mockUSDC.getAddress();
    console.log(`📄 MockERC20 USDC deployed to: ${usdcAddress}`);
    
    // Mint some tokens for testing
    const mintAmount = ethers.parseUnits("10000", 6); // 10,000 USDC
    await mockUSDC.mint(deployer.address, mintAmount);
    console.log(`💸 Minted ${ethers.formatUnits(mintAmount, 6)} USDC to deployer`);
  } else {
    usdcAddress = USDC_ADDRESSES[networkName as keyof typeof USDC_ADDRESSES];
    if (!usdcAddress) {
      throw new Error(`USDC address not configured for network: ${networkName}`);
    }
    console.log(`📄 Using existing USDC at: ${usdcAddress}`);
  }

  // Deploy WorkEscrow
  console.log("\n🏗️ Deploying WorkEscrow contract...");
  const WorkEscrow = await ethers.getContractFactory("WorkEscrow");
  const workEscrow = await WorkEscrow.deploy(usdcAddress);
  
  await workEscrow.waitForDeployment();
  const workEscrowAddress = await workEscrow.getAddress();
  
  console.log(`✅ WorkEscrow deployed to: ${workEscrowAddress}`);
  console.log(`📄 USDC token address: ${usdcAddress}`);
  console.log(`👤 Contract owner: ${await workEscrow.owner()}`);

  // Verify contract configuration
  console.log("\n🔍 Verifying deployment...");
  const configuredUSDC = await workEscrow.usdcToken();
  const nextWorkId = await workEscrow.getNextWorkId();
  
  console.log(`✓ USDC token configured: ${configuredUSDC}`);
  console.log(`✓ Next work ID: ${nextWorkId}`);
  console.log(`✓ Contract is ${(await workEscrow.paused()) ? "PAUSED" : "ACTIVE"}`);

  // Additional verification for testnet
  if (networkName === "sepolia") {
    console.log("\n⚠️ IMPORTANT: To interact with the contract on Sepolia:");
    console.log(`1. Get Sepolia ETH from faucet: https://sepoliafaucet.com/`);
    console.log(`2. Get Sepolia USDC from Circle faucet or DEX`);
    console.log(`3. Approve the WorkEscrow contract to spend your USDC`);
    console.log(`4. Contract address for frontend: ${workEscrowAddress}`);
  }

  // Save deployment info
  const deploymentInfo = {
    network: networkName,
    workEscrow: workEscrowAddress,
    usdcToken: usdcAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
  };

  console.log("\n📋 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  return deploymentInfo;
}

main()
  .then((result) => {
    console.log("\n🎉 Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });
