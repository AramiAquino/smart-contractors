const hre = require("hardhat");

async function main() {
  console.log(" Deploying WorkEscrow to hardhat...");

  try {
    // Get the contract factory
    const WorkEscrow = await hre.ethers.getContractFactory("WorkEscrow");
    const MockERC20 = await hre.ethers.getContractFactory("MockERC20");

    // Deploy MockERC20 first
    console.log(" Deploying MockERC20...");
    const mockUSDC = await MockERC20.deploy(
      "USD Coin",
      "USDC",
      6 // 6 decimals like real USDC
    );
    await mockUSDC.waitForDeployment();
    console.log("✅ MockERC20 deployed to:", await mockUSDC.getAddress());

    // Deploy WorkEscrow
    console.log(" Deploying WorkEscrow...");
    const workEscrow = await WorkEscrow.deploy(await mockUSDC.getAddress());
    await workEscrow.waitForDeployment();
    console.log("✅ WorkEscrow deployed to:", await workEscrow.getAddress());

    console.log("🎉 Deployment completed successfully!");
    console.log(" Contract addresses:");
    console.log("  MockERC20:", await mockUSDC.getAddress());
    console.log("  WorkEscrow:", await workEscrow.getAddress());
  } catch (error) {
    console.error("❌ Error during deployment:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
