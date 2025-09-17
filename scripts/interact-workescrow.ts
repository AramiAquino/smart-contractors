import { network, ethers } from "hardhat";

// Configuración del contrato deployado
const DEPLOYED_CONTRACTS = {
  // Actualizar estas direcciones después del deploy
  sepolia: {
    workEscrow: "", // Agregar después del deploy
    usdcToken: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  },
  hardhat: {
    workEscrow: "", // Se detectará automáticamente
    usdcToken: "", // Se detectará automáticamente  
  }
};

async function main() {
  const networkName = network.name;
  console.log(`\n🔗 Interacting with WorkEscrow on ${networkName}...`);

  const [deployer, client, worker] = await ethers.getSigners();
  console.log(`👤 Deployer: ${deployer.address}`);
  console.log(`👤 Client: ${client.address}`);
  console.log(`👤 Worker: ${worker.address}`);

  // Para este ejemplo, vamos a usar direcciones desde los argumentos o deployar localmente
  let workEscrowAddress = process.argv[2]; // Pasar como argumento: npx hardhat run scripts/interact-workescrow.ts --network sepolia <ADDRESS>
  let usdcAddress = process.argv[3];

  if (!workEscrowAddress) {
    if (networkName === "hardhat" || networkName === "localhost") {
      console.log("📄 Deploying contracts locally for testing...");
      
      // Deploy MockERC20
      const MockERC20 = await ethers.getContractFactory("MockERC20");
      const mockUSDC = await MockERC20.deploy("USD Coin", "USDC", 6);
      await mockUSDC.waitForDeployment();
      usdcAddress = await mockUSDC.getAddress();
      
      // Deploy WorkEscrow
      const WorkEscrow = await ethers.getContractFactory("WorkEscrow");
      const workEscrow = await WorkEscrow.deploy(usdcAddress);
      await workEscrow.waitForDeployment();
      workEscrowAddress = await workEscrow.getAddress();
      
      // Mint USDC to client
      await mockUSDC.mint(client.address, ethers.parseUnits("1000", 6));
      
      console.log(`✅ Deployed locally:`);
      console.log(`   WorkEscrow: ${workEscrowAddress}`);
      console.log(`   USDC: ${usdcAddress}`);
    } else {
      throw new Error("Please provide WorkEscrow contract address as argument");
    }
  }

  if (!usdcAddress) {
    usdcAddress = DEPLOYED_CONTRACTS[networkName as keyof typeof DEPLOYED_CONTRACTS]?.usdcToken;
    if (!usdcAddress) {
      throw new Error("Please provide USDC contract address as second argument");
    }
  }

  // Get contract instances
  const WorkEscrow = await ethers.getContractFactory("WorkEscrow");
  const workEscrow = WorkEscrow.attach(workEscrowAddress);

  const IERC20 = await ethers.getContractFactory("MockERC20"); // Using MockERC20 as it has the same interface
  const usdc = IERC20.attach(usdcAddress);

  console.log(`\n📊 Contract Status:`);
  console.log(`WorkEscrow: ${workEscrowAddress}`);
  console.log(`USDC Token: ${usdcAddress}`);
  console.log(`Owner: ${await workEscrow.owner()}`);
  console.log(`Next Work ID: ${await workEscrow.getNextWorkId()}`);
  console.log(`Is Paused: ${await workEscrow.paused()}`);

  // Ejemplo de flujo completo
  console.log(`\n🚀 Starting complete work flow example...`);

  // 1. Check balances
  const clientBalance = await usdc.balanceOf(client.address);
  console.log(`\n💰 Client USDC balance: ${ethers.formatUnits(clientBalance, 6)}`);

  if (clientBalance === 0n && networkName !== "hardhat" && networkName !== "localhost") {
    console.log("⚠️ Client has no USDC balance. Please get testnet USDC first.");
    return;
  }

  // 2. Approve WorkEscrow to spend USDC
  const workAmount = ethers.parseUnits("100", 6); // 100 USDC
  console.log(`\n📝 Approving WorkEscrow to spend ${ethers.formatUnits(workAmount, 6)} USDC...`);
  
  const approveTx = await usdc.connect(client).approve(workEscrowAddress, workAmount);
  await approveTx.wait();
  console.log(`✅ Approval successful`);

  // 3. Create work
  console.log(`\n📋 Creating new work...`);
  const createTx = await workEscrow.connect(client).createWork(
    worker.address, // assigned worker
    workAmount,
    "Build Smart Contract Dashboard",
    "Create a React dashboard to interact with this WorkEscrow contract",
    0 // no deadline
  );
  
  const createReceipt = await createTx.wait();
  const workCreatedEvent = createReceipt?.logs?.find(log => {
    try {
      const parsed = workEscrow.interface.parseLog(log);
      return parsed?.name === "WorkCreated";
    } catch {
      return false;
    }
  });

  if (!workCreatedEvent) {
    throw new Error("WorkCreated event not found");
  }

  const parsedEvent = workEscrow.interface.parseLog(workCreatedEvent);
  const workId = parsedEvent?.args?.workId;
  
  console.log(`✅ Work created with ID: ${workId}`);

  // 4. Get work details
  const work = await workEscrow.getWork(workId);
  console.log(`\n📖 Work Details:`);
  console.log(`   ID: ${work.id}`);
  console.log(`   Client: ${work.client}`);
  console.log(`   Worker: ${work.worker}`);
  console.log(`   Amount: ${ethers.formatUnits(work.amount, 6)} USDC`);
  console.log(`   Title: ${work.title}`);
  console.log(`   Status: ${work.status} (Created)`);

  // 5. Worker accepts work
  console.log(`\n✋ Worker accepting work...`);
  const acceptTx = await workEscrow.connect(worker).acceptWork(workId);
  await acceptTx.wait();
  console.log(`✅ Work accepted`);

  // 6. Worker submits work
  console.log(`\n📤 Worker submitting completed work...`);
  const deliveryData = "ipfs://QmExampleHash123456789abcdef";
  const submitTx = await workEscrow.connect(worker).submitWork(workId, deliveryData);
  await submitTx.wait();
  console.log(`✅ Work submitted with delivery data: ${deliveryData}`);

  // 7. Client approves and pays
  console.log(`\n✅ Client approving work and releasing payment...`);
  const workerBalanceBefore = await usdc.balanceOf(worker.address);
  
  const approveTx2 = await workEscrow.connect(client).approveWork(workId);
  await approveTx2.wait();
  
  const workerBalanceAfter = await usdc.balanceOf(worker.address);
  const paymentReceived = workerBalanceAfter - workerBalanceBefore;
  
  console.log(`✅ Work approved and payment sent!`);
  console.log(`💰 Worker received: ${ethers.formatUnits(paymentReceived, 6)} USDC`);

  // 8. Final work state
  const finalWork = await workEscrow.getWork(workId);
  console.log(`\n🏁 Final Work Status:`);
  console.log(`   Status: ${finalWork.status} (Completed)`);
  console.log(`   Delivery Data: ${finalWork.deliveryData}`);

  console.log(`\n🎉 Complete work flow executed successfully!`);
  console.log(`📊 Summary:`);
  console.log(`   - Work created and funded with escrow`);
  console.log(`   - Worker accepted and completed work`);
  console.log(`   - Client approved and payment was released`);
  console.log(`   - All state transitions worked correctly`);
}

main()
  .then(() => {
    console.log("\n✨ Interaction completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Interaction failed:", error);
    process.exit(1);
  });
