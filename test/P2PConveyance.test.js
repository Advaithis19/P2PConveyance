const { ethers } = require("hardhat");
const { assert } = require("chai");

describe("P2PConveyance", function () {
  let p2pConveyanceFactory, p2pConveyance;

  let items = [["Paneer Butter Masala", 1, 150]],
    restaurant = ["A2B", "1550", "1000", "1234"],
    customer = ["John", "1250", "1000", "1235"],
    deliveryAgent = ["Bill", "1320"],
    restPrice = ethers.utils.parseEther("0.0045"),
    delPrice = ethers.utils.parseEther("0.0005"),
    _restaurant = "0xc77c87F12daF81Af8873433FdfE7557273d45758",
    _deliveryAgent = "0xB73B63667F4A7A9b4915C28D85faD0a26df42616";

  let sendValue = ethers.utils.parseEther("0.005");

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
    it("Fails if non-exact amount of eth is sent", async () => {
      await expect(
        p2pConveyance.confirmOrderSubmission(
          items,
          restaurant,
          customer,
          deliveryAgent,
          restPrice,
          delPrice,
          _restaurant,
          _deliveryAgent,
          { value: ethers.utils.parseEther("0") }
        )
      ).to.be.reverted;
    });

    describe("updating state", async function () {
      beforeEach(async function () {
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
      });
    });

    it("Updated the counter variable properly", async function () {
      let currentCounter = await p2pConveyance.getCounter();
      let expectedCounter = "1";
      assert.equal(
        currentCounter.toString(),
        expectedCounter,
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

    // check to see the account balances have been updated properly
  });

  describe("confirmOrderDelivery", async function () {
    beforeEach(async function () {
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
      await p2pConveyance.confirmOrderDelivery(0);
    });

    it("Fails when deliveryAgent confirms twice", async () => {
      await expect(p2pConveyance.confirmOrderDelivery(0)).to.be.reverted;
    });

    it("Updated the delivery status", async () => {
      expect(await p2pConveyance.getOrderHasBeenDelivered(0)).to.be.true;
    });

    it("Updated the deliveryAgentOwedBalance datastructure properly", async function () {
      let expectedValue = "0";
      let currentValue = await p2pConveyance.getDeliveryAgentOwedBalance(
        _deliveryAgent
      );
      assert.equal(
        currentValue.toString(),
        expectedValue,
        "Didn't update the balance owed properly"
      );
    });

    // check to see the account balances have been updated properly
  });
});
