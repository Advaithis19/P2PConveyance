import express from "express";
import bodyParser from "body-parser";
import {
  setup,
  confirmSubmit,
  confirmDelivery,
  getOrder,
  getOrdersList,
} from "./controllers/order.js";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// GET method route for index
app.get("/", (req, res) => {
  res.send("Hi! You are at the index route...");
});

// GET method route for order list
app.get("/api/orders/", getOrdersList, (req, res) => {
  res.json({ orders: req.data });
});

// GET method route for order details
app.get("/api/orders/:id/", setup, getOrder, (req, res) => {
  res.json({ order: req.data });
});

// POST method route for order submission
app.post("/api/orders/submit/", setup, confirmSubmit, (req, res) => {
  res.json({ id: req.data });
});

// POST method route for order delivery confirmation
app.post("/api/orders/confirm/", setup, confirmDelivery, (req, res) => {
  res.status(200).send("Delivery confirmed!");
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Listening on port 3000...")
);
