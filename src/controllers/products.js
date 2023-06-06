const ControllerException = require("../utils/ControllerException");
const knex = require("../database/db_config");

// create product 
exports.createProduct = async ({ name, price, description, manufacturer, weight, term, color, photo_id }) => {
  try {
    const [{ id: productId }] = await knex("products")
      .insert([{ name, price, description, manufacturer, weight, term, color, photo_id }])
      .returning("id");
    return { productId };
  } catch (error) {
    console.log(error)
    throw new ControllerException("ERROR", "Code execution error");
  }
};

exports.updateProduct = async ({ productId, name, price, description, manufacturer, weight, term, color, photo_id }) => {
  try {
    const record = await knex("products")
      .update({
        name,
        price,
        description, 
        manufacturer, 
        weight, 
        term, 
        color,
        photo_id
      })
      .select("id")
      .where({ id: productId });

    return record;
  } catch (error) {
    console.log(error);
  }
};

// delete product 
exports.deleteProduct = async ({ productId }) => {
  const record = await knex("products").select("id").where({ id: productId });

  if (!record) {
    throw new ControllerException("NOT_FOUND", "product has not been found");
  }

  await knex("products").where({ id: productId }).del();

  return { message: "product is deleted" };
};

// get product by id 
exports.getProductById = async ({ productId }) => {
  const [record] = await knex("products")
    .select("id", "name", "price", "description", "manufacturer", "weight", "term", "color", "photo_id")
    .where({ id: productId });

  return record;
};

exports.getProductHavingId = async ({ productId }) => {
  const records = await knex("products")
    .select("id", "name", "price", "description", "manufacturer", "weight", "term", "color", "photo_id")
    .whereIn('id', productId);

  return records;
};

// get all exists products 
exports.getProductsList = async (limit, offset) => {
  const records = await knex("products")
    .limit(limit)
    .offset(offset);
  if (!records) {
    throw new ControllerException("TOUR_NOT_FOUND", "Product has not been found");
  }

  return records;
};
