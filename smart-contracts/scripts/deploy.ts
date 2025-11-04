import { createWalletClient, createPublicClient, http, formatEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import fs from "fs";

async function main() {
    console.log("Deploying LoanTracker contract...");

    // Use hardhat's first account
    const account = privateKeyToAccount("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");

    const publicClient = createPublicClient({
        chain: hardhat,
        transport: http("http://127.0.0.1:8545"),
    });

    const walletClient = createWalletClient({
        account,
        chain: hardhat,
        transport: http("http://127.0.0.1:8545"),
    });

    console.log("Deploying with account:", account.address);

    const balance = await publicClient.getBalance({ address: account.address });
    console.log("Account balance:", formatEther(balance), "ETH");

    // Read contract artifacts
    const artifact = JSON.parse(
        fs.readFileSync("./artifacts/contracts/LoanTracker.sol/LoanTracker.json", "utf8")
    );

    // Deploy
    const hash = await walletClient.deployContract({
        abi: artifact.abi,
        bytecode: artifact.bytecode as `0x${string}`,
        args: [],
    });

    console.log("Deployment transaction:", hash);
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    console.log("\n✅ LoanTracker deployed to:", receipt.contractAddress);
    console.log("\n📋 Save this for your mobile app:");
    console.log("   Contract Address:", receipt.contractAddress);
    console.log("   Network: localhost (http://127.0.0.1:8545)");
    console.log("   Chain ID: 31337");
    console.log("   ABI: artifacts/contracts/LoanTracker.sol/LoanTracker.json");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

