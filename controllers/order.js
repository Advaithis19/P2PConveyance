// import fetch from "node-fetch";
import ethers from "ethers";
import "dotenv/config";
// import fs from "fs";
import contract from "../contracts/P2PConveyance.json" assert { type: "json" };

let p2pConveyanceContract;
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
// const ETHERSCAN_ABI_FETCH_URL = process.env.ETHERSCAN_ABI_FETCH_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const RESTAURANT_ADDRESS = process.env.RESTAURANT_ADDRESS;
const DELIVERY_AGENT_ADDRESS = process.env.DELIVERY_AGENT_ADDRESS;
const CUSTOMER_PRIVATE_KEY = process.env.CUSTOMER_PRIVATE_KEY;
const DELIVERY_AGENT_PRIVATE_KEY = process.env.DELIVERY_AGENT_PRIVATE_KEY;

const confirmSubmit = async (req, res, next) => {
  try {
    console.log("req body", req.body);
    let sendValue = ethers.utils.parseEther(req.body.sendValue);
    let orderSubmissionResponse =
      await p2pConveyanceContract.confirmOrderSubmission(
        req.body.items,
        req.body.restaurant,
        req.body.customer,
        req.body.deliveryAgent,
        ethers.utils.parseEther(req.body.restPrice),
        ethers.utils.parseEther(req.body.delPrice),
        RESTAURANT_ADDRESS,
        DELIVERY_AGENT_ADDRESS,
        { value: sendValue }
      );
    await orderSubmissionResponse.wait();
    req.data = orderSubmissionResponse.id;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const confirmDelivery = async (req, res, next) => {
  try {
    let orderDeliveryResponse =
      await p2pConveyanceContract.confirmOrderDelivery(req.body.id);
    await orderDeliveryResponse.wait();
    next();
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

const getOrder = async (req, res, next) => {
  try {
    let order = await p2pConveyanceContract.getOrder(req.params.id);

    let formattedOrder = {};
    formattedOrder["id"] = order[0].toString();

    let items = [];
    order[1].forEach((item) => {
      let formattedItem = {};
      formattedItem["name"] = item[0];
      formattedItem["quantity"] = item[1].toString();
      formattedItem["price"] = item[2].toString();
      items.push(formattedItem);
    });
    formattedOrder["items"] = items;

    let restaurant = {};
    restaurant["name"] = order[2][0];
    restaurant["latitude"] = order[2][1];
    restaurant["longitude"] = order[2][2];
    restaurant["contact"] = order[2][3];
    formattedOrder["restaurant"] = restaurant;

    let customer = {};
    customer["name"] = order[3][0];
    customer["latitude"] = order[3][1];
    customer["longitude"] = order[3][2];
    customer["contact"] = order[3][3];
    formattedOrder["customer"] = customer;

    let deliveryAgent = {};
    deliveryAgent["name"] = order[4][0];
    deliveryAgent["contact"] = order[4][1];
    formattedOrder["deliveryAgent"] = deliveryAgent;

    formattedOrder["restPrice"] = order[5].toString();
    formattedOrder["delPrice"] = order[6].toString();

    formattedOrder["hasBeenDelivered"] = order[7];

    req.data = formattedOrder;
    console.log(req.data);
    next();
  } catch (err) {
    console.log(err);
    next(error);
  }
};

const setup = async (req, res, next) => {
  // const response = await fetch(ETHERSCAN_ABI_FETCH_URL);
  // const data = await response.json();

  // let abi = data.result;
  // console.log("abi", abi);

  // var jsonFile = "../P2PConveyance.json";
  // var parsed = JSON.parse(fs.readFileSync(jsonFile));
  // var abi = parsed.abi;

  const node = RINKEBY_RPC_URL;
  const provider = new ethers.providers.WebSocketProvider(node);

  let url = req.originalUrl;
  let privatekey = url.includes("confirm")
    ? DELIVERY_AGENT_PRIVATE_KEY
    : CUSTOMER_PRIVATE_KEY;
  let wallet = new ethers.Wallet(privatekey, provider);

  console.log("Using wallet address " + wallet.address);

  let contractaddress = CONTRACT_ADDRESS;
  p2pConveyanceContract = new ethers.Contract(
    contractaddress,
    contract.abi,
    wallet
  );

  next();
};

export { confirmSubmit, confirmDelivery, getOrder, setup };
