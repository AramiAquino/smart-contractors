import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// USDC token address on Sepolia testnet
// This is the actual USDC token deployed on Sepolia for testing
const SEPOLIA_USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

const WorkEscrowModule = buildModule("WorkEscrowModule", (m) => {
  const usdcTokenAddress = m.getParameter("usdcTokenAddress", SEPOLIA_USDC_ADDRESS);

  const workEscrow = m.contract("WorkEscrow", [usdcTokenAddress], {
    // Optional: Set deployment options
    // value: ethers.parseEther("0.01"), // If contract needs ETH
  });

  return { workEscrow };
});

export default WorkEscrowModule;
