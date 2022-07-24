const { ethers, run, network } = require("hardhat");

async function main() {
  const p2pConveyanceFactory = await ethers.getContractFactory("P2PConveyance");
  console.log("Please wait. Deploying contract...");
  const p2pConveyance = await p2pConveyanceFactory.deploy();
  await p2pConveyance.deployed();
  console.log(`Deployed contract to: ${p2pConveyance.address}`);
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for 6 block confirmation...");
    await p2pConveyance.deployTransaction.wait(6);
    console.log("Block confirmations done!");
    await verify(p2pConveyance.address, []);
  }

  // declarations
  const items = [["Paneer Butter Masala", 1, 150]],
    restaurant = ["A2B", "1550", "1000", "1234"],
    customer = ["John", "1250", "1000", "1235"],
    deliveryAgent = ["Bill", "1320"],
    restPrice = ethers.utils.parseEther("0.0045"),
    delPrice = ethers.utils.parseEther("0.0005"),
    _restaurant = "0xc77c87F12daF81Af8873433FdfE7557273d45758",
    _deliveryAgent = "0xB73B63667F4A7A9b4915C28D85faD0a26df42616",
    sendValue = ethers.utils.parseEther("0.005");

  // retrieving current counter (must be 0)
  let currCounter = await p2pConveyance.getCounter();
  console.log(`Current counter is: ${currCounter}`);

  // making order submission
  await p2pConveyance.confirmOrderSubmission(
    items,
    restaurant,
    customer,
    deliveryAgent,
    restPrice,
    delPrice,
    _restaurant,
    _deliveryAgent,
    { value: sendValue }
  );

  // retrieving counter again
  let updatedCounter = await p2pConveyance.getCounter();
  console.log(`Updated counter is: ${updatedCounter}`);
}

async function verify(contractAddress, args) {
  console.log("Verifying contract on etherscan...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
    console.log("Contract verified!");
  } catch (e) {
    if (e.toString().toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
