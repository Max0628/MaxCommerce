//schema.js
const { DataTypes, sequelize } = require("./db");
// Set Product Schema
const Product = sequelize.define("Products", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
});

//Set Order Schema
const Order = sequelize.define("Orders", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
});

//Set OrderItem Schema
const OrderItem = sequelize.define("OrderItems", {
  orderId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: { model: Order, key: "id" },
    onDelete: "CASCADE",
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Product, key: "id" },
  },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
});

module.exports = { Product, Order, OrderItem };
