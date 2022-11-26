const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "12345679,adgjm", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
