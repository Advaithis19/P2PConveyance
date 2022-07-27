import express from "express";
import bodyParser from "body-parser";
import {
  setup,
  confirmSubmit,
  confirmDelivery,
  getOrder,
} from "./controllers/order.js";

const app = express();

var jsonParser = bodyParser.json();

// GET method route
app.get("/api/orders/:id/", setup, getOrder, (req, res) => {
  res.json({ orders: req.data });
});

// POST method route for order submission
app.post(
  "/api/orders/submit/",
  jsonParser,
  setup,
  confirmSubmit,
  (req, res) => {
    res.json({ id: req.data });
  }
);

// POST method route for order delivery confirmation
app.post(
  "/api/orders/confirm/",
  jsonParser,
  setup,
  confirmDelivery,
  (req, res) => {
    res.status(200).send("Delivery confirmed!");
  }
);

app.listen(process.env.PORT || 3000, () =>
  console.log("Listening on port 3000...")
);
