const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");

// add a new order
exports.createOrder = async ({ user_id, products, price }) => {
  try {
    const [{ id: orderId }] = await knex("orders")
      .insert([{ user_id, price }])
      .returning("id");
    products.forEach(async ({ id: product_id, amount }) => {
      await knex("orders_products")
        .insert([{ order_id: orderId, product_id, amount }])
    });
    return { orderId };
  }
  catch (error) {
    console.log(error)
    throw new ControllerException("ERROR", "something went wrong and this is bad");
  }
};

// update an order
exports.updateOrder = async ({ users_id, price }) => {
  try {
    const [record] = await knex("orders")
      .update({ users_id, price })
      .where({ id: orderId });

    return record;
  } catch (error) {
    console.log(error);
  }
};

// get an order by id
exports.getOrderById = async ({ orderId }) => {
  const [{ id, users_id, price }] = await knex("orders")
    .select("id", "users_id", "price")
    .where({ id: orderId });

  return { id, users_id, products, amount, price };
};

// get list orders
exports.getOrders = async (limit, offset) => {
  let records = await knex("orders")
    .innerJoin("orders_products", { "orders_products.order_id": "orders.id" })
    .innerJoin("products", { "products.id": "orders_products.product_id" })
    .innerJoin("users", { "users.id": "orders.user_id" })
    .select(
        "orders.id",
        "orders.price as total_price",
        "products.name as product_name",
        "products.price",
        "orders_products.amount as amount",
        "users.name as client"
    )
    .limit(limit)
    .offset(offset);
  return records;
};

// delete an order
exports.deleteOrder = async ({ orderId }) => {
  const record = await knex("orders").select("id").where({ id: orderId });

  if (!record) {
    throw new ControllerException("NOT_FOUND", "Order has not been found");
  }

  await knex("orders").where({ id: orderId }).del();

  return { message: "order is deleted" };
};

exports.getUserRelatedOrders = async ({ id, limit, offset }) => {
  let records = await knex("orders")
      .innerJoin("orders_products", { "orders_products.order_id": "orders.id" })
      .innerJoin("products", { "products.id": "orders_products.product_id" })
      .innerJoin("users", { "users.id": "orders.user_id" })
      .select(
          "orders.id",
          "orders.price as total_price",
          "products.name as product_name",
          "products.price",
          "orders_products.amount as amount",
          "users.name as client"
      )
      .where("users.id", id)
      .limit(limit)
      .offset(offset);

  return records;
};
