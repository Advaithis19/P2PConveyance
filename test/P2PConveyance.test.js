const { ethers } = require("hardhat");
const { assert } = require("chai");

describe("P2PConveyance", function () {
  let p2pConveyanceFactory, p2pConveyance;

  beforeEach(async function () {
    p2pConveyanceFactory = await ethers.getContractFactory("P2PConveyance");
    console.log("Please wait. Deploying contract...");
    p2pConveyance = await p2pConveyanceFactory.deploy();
  });

  describe("initial", async function () {
    it("Should start with a contract balance of 0", async function () {
      const contractBalance = await p2pConveyance.getContractBalance();
      const expectedBalance = "0";
      assert.equal(
        contractBalance.toString(),
        expectedBalance,
        "Initially balance does not return 0"
      );
    });
  });

  describe("confirmOrderSubmission", async function () {
    let items = [["Paneer Butter Masala", 1, 150]],
      restaurant = ["A2B", "1550", "1000", "1234"],
      customer = ["John", "1250", "1000", "1235"],
      deliveryAgent = ["Bill", "1320"],
      restPrice = ethers.utils.parseEther("0.0045"),
      delPrice = ethers.utils.parseEther("0.0005"),
      _restaurant = "0xc77c87F12daF81Af8873433FdfE7557273d45758",
      _deliveryAgent = "0xB73B63667F4A7A9b4915C28D85faD0a26df42616";

    it("Fails if non-exact amount of eth is sent", async () => {
      await expect(
        p2pConveyance.confirmOrderSubmission(
          items,
          restaurant,
          customer,
          deliveryAgent,
          ethers.utils.parseEther("0"),
          ethers.utils.parseEther("0"),
          _restaurant,
          _deliveryAgent,
          { value: sendValue }
        )
      ).to.be.reverted;
    });

    it("Updated the counter variable properly", async function () {
      const currentCounter = await p2pConveyance.getCounter();
      await p2pConveyance.confirmOrderSubmission(
        items,
        restaurant,
        customer,
        deliveryAgent,
        restPrice,
        delPrice,
        _restaurant,
        _deliveryAgent
      );
      const updatedCounter = await p2pConveyance.getCounter();
      assert.equal(
        currentCounter.add(1).toString(),
        updatedCounter.toString(),
        "Order is not added properly"
      );
    });

    it("Updated the deliveryAgentOwedBalance datastructure properly", async function () {
      let expectedValue = "500000000000000";
      let currentValue = await p2pConveyance.getDeliveryAgentOwedBalance(
        _deliveryAgent
      );
      assert.equal(
        currentValue.toString(),
        expectedValue,
        "Didn't update the balance owed properly"
      );
    });
  });

  describe("confirmOrderDelivery", async function () {
    // beforeEach(async function () {
    //   p2pConveyanceFactory = await ethers.getContractFactory("P2PConveyance");
    //   console.log("Please wait. Deploying contract...");
    //   p2pConveyance = await p2pConveyanceFactory.deploy();
    // });
    // it("Fails if non-exact amount of eth is sent", async () => {
    //   await expect(
    //     p2pConveyance.confirmOrderSubmission(
    //       items,
    //       restaurant,
    //       customer,
    //       deliveryAgent,
    //       ethers.utils.parseEther("0"),
    //       ethers.utils.parseEther("0"),
    //       _restaurant,
    //       _deliveryAgent
    //     )
    //   ).to.be.reverted;
    // });
    // it("Updated the counter variable properly", async function () {
    //   const currentCounter = await p2pConveyance.getCounter();
    //   await p2pConveyance.confirmOrderSubmission(
    //     items,
    //     restaurant,
    //     customer,
    //     deliveryAgent,
    //     restPrice,
    //     delPrice,
    //     _restaurant,
    //     _deliveryAgent
    //   );
    //   const updatedCounter = await p2pConveyance.getCounter();
    //   assert.equal(
    //     currentCounter.add(1).toString(),
    //     updatedCounter.toString(),
    //     "Order is not added properly"
    //   );
    // });
    // it("Updated the deliveryAgentOwedBalance datastructure properly", async function () {
    //   let expectedValue = "500000000000000";
    //   let currentValue = await p2pConveyance.getDeliveryAgentOwedBalance(
    //     _deliveryAgent
    //   );
    //   assert.equal(
    //     currentValue.toString(),
    //     expectedValue,
    //     "Didn't update the balance owed properly"
    //   );
    // });
    // it("Withdraw ETH from a single funder", async () => {
    //   const startingFundMeBalance = await fundMe.provider.getBalance(
    //     fundMe.address
    //   );
    //   const startingDeployerBalance = await fundMe.provider.getBalance(
    //     deployer
    //   );
    //   const transactionResponse = await fundMe.withdraw();
    //   const transactionReceipt = await transactionResponse.wait(1);
    //   const { gasUsed, effectiveGasPrice } = transactionReceipt;
    //   const gasCost = gasUsed.mul(effectiveGasPrice);
    //   const endingFundMeBalance = await fundMe.provider.getBalance(
    //     fundMe.address
    //   );
    //   const endingDeployerBalance = await fundMe.provider.getBalance(deployer);
    //   assert.equal(endingFundMeBalance, 0);
    //   assert.equal(
    //     endingDeployerBalance.add(gasCost).toString(),
    //     startingDeployerBalance.add(startingFundMeBalance).toString()
    //   );
    // });
  });
});
