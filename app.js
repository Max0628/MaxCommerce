import { Sequelize, DataTypes } from "sequelize";
import express from "express";
import "dotenv/config";
const app = express();
const httpPort = 3306;
/*======Middleware==================================================*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/*======連線mySQL prot 3306=========================================*/
const sequelize = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  port: httpPort,
  username: "root",
  password: process.env.PASSWORD,
  database: "myProducts",
});
async function connectionToDb() {
  try {
    await sequelize.authenticate();
    console.log("成功連線到mysql,port:" + `${httpPort}`);
    await sequelize.sync();
  } catch (error) {
    console.log("連線失敗" + error);
  }
}
connectionToDb();
/*==================================================================*/

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

/*Main page*/
app.get("/", async (req, res) => {
  try {
    return res.send("歡迎來到Max商城");
  } catch (error) {
    return console.log(error);
  }
});

/*===================================================================*/
/*======================以下新增商品進行操作============================*/
/*==================================================================*/
/* Create new Product */
app.post("/products", async (req, res) => {
  try {
    const { id, name, description, quantity, price } = req.body;
    const productIsExisted = await Product.findOne({ where: { name: name } });
    if (productIsExisted) {
      return res.status(200).send("商品已重複");
    }
    const newProduct = await Product.create({
      id,
      name,
      description,
      quantity,
      price,
    });
    return res.status(200).send({ message: "新增商品成功", data: newProduct });
  } catch (error) {
    return res.status(400).send({ message: "伺服器錯誤", data: error });
  }
});

/*Sreach all Products*/
app.get("/products", async (req, res) => {
  try {
    const findProduct = await Product.findAll({});
    if (!findProduct) {
      return res.status(404).send("目前還沒有商品上架");
    }
    return res
      .status(200)
      .send("成功找出所有商品" + JSON.stringify(findProduct));
  } catch (error) {
    return res.status(500).send({ message: "伺服器錯誤", data: error });
  }
});

/*delete a specific Product*/
app.delete("/products/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const productToDelete = await Product.findOne({ where: { name } });
    const deleteProduct = await Product.destroy({
      where: { name: name },
    });
    if (deleteProduct > 0) {
      return res
        .status(200)
        .send(`成功刪除商品:` + JSON.stringify(productToDelete));
    } else {
      return res.status(409).send("商城中無此商品");
    }
  } catch (error) {
    return res.status(500).send({ message: "伺服器錯誤", data: error });
  }
});
/*==================================================================*/
/*=======================以下是對於訂單操作============================*/
/*==================================================================*/
/*查詢所有購物表單*/
app.get("/orders", async (req, res) => {
  try {
    const findProduct = await Order.findAll({});
    if (!findProduct) {
      return res.status(400).send("找不到任何資料");
    }
    return res.status(200).send({ message: "所有表單", data: findProduct });
  } catch (error) {
    return res.status(500).send({ message: "伺服器錯誤", data: error });
  }
});

/*新增購物表單*/
app.post("/orders", async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).send({ message: "找不到此商品", data: null });
    }
    if (product.quantity < quantity) {
      return res.status(400).send({ message: "此商品庫存不足", data: null });
    }
    const totalPrice = quantity * product.price;
    const newOrder = await Order.create({
      totalPrice: totalPrice,
    });
    const newOrderItem = await OrderItem.create({
      orderId: newOrder.id,
      productId: product.id,
      quantity: quantity,
      totalPrice: totalPrice,
    });
    return res.status(201).send({
      message: "成功創建新購物清單",
      data: { newOrder, newOrderItem },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "伺服器錯誤", data: error });
  }
});

/*刪除購物訂單*/
app.delete("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const findOrder = await Order.findOne({ where: { id } });
    if (!findOrder) {
      return res.status(400).send({ message: "無此訂單", data: findOrder });
    }
    await OrderItem.destroy({ where: { orderId: id } });
    const deleteOrder = await Order.destroy({ where: { id } });
    if (deleteOrder > 0) {
      return res.status(200).send({ message: "已經刪除訂單", data: findOrder });
    }
  } catch (error) {
    return res.status(500).send({ message: "伺服器錯誤", data: error });
  }
});
/*==================================================================*/
/*make sure the server work well*/
app.listen(3000, () => {
  console.log("伺服器正在監聽prot3000");
});
