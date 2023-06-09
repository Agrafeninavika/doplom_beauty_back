const express = require("express")
const router = express.Router()

const { wrap } = require("async-middleware");
const ordersController = require("../controllers/orders");
const auth = require("./middelwares/auth");

router.post(
  "/create",
  auth("user"),
  wrap(async (req, res) => {
    const { id: userId } = req.user
    const { products, price } = req.body;
    const { orderId } = await ordersController.createOrder({
      user_id: userId,
      products,
      price
    });

    res.send({ success: true, id: orderId });
  })
);

router.post(
  "/update",
  auth("user"),
  wrap(async (req, res) => {
    const { users_id, products, price } = req.body;
    await ordersController.updateOrder({
      orderId: req.params.id,
      users_id,
      products,
      price
    });

    res.send({ success: true });
  })
);

router.post(
  "/del/:id",
  auth("admin"),
  wrap(async (req, res) => {
    const id = req.params.id;
    await ordersController.deleteOrder({ orderId: id });

    res.send({
      success: true
    });
  })
);

router.get("/one/:id",
  // auth("admin"),
  wrap(async (req, res) => {
    const id = req.params.id;
    const { id: orderId, users_id, products, amount, price } = await ordersController.getOrderById({ orderId: id });

    res.send({
      success: true,
      order: { orderId, users_id, products, amount, price }
    });
  })
)

router.get(
  "/list",
  auth("user"),
  wrap(async (req, res) => {
    const { limit, offset } = req.params;
    const orders = await ordersController.getOrders({
      limit: +limit || 10,
      offset: +offset || 0,
    });

    res.send({
      success: true,
      orders,
      limit,
      offset,
    });
  })
);

router.get(
  "/my-orders",
  auth("user"),
  wrap(async (req, res) => {
      const { id } = req.user
      const { limit, offset } = req.params;
      const orders = await ordersController.getUserRelatedOrders({
          id,
          limit: +limit || 10,
          offset: +offset || 0,
      });

      res.send({
          success: true,
          orders,
          limit,
          offset,
      });
  })
);

module.exports = router
