const knex = require("knex")
const knexfile = require("./knexfile")
const NODE_ENV = process.env.NODE_ENV;
const config = knexfile[NODE_ENV] || knexfile.development;
const database = knex(config)

module.exports = database;
