//route.js
const { Product, Order, OrderItem } = require("./schema");

function setupRoutes(app) {
  /*Main page*/
  app.get("/", async (req, res) => {
    try {
      res.status(200).send("歡迎來到Max商城首頁");
    } catch (error) {
      res.status(500).send({ message: "伺服器錯誤", data: error });
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
        res.status(200).send("商品已重複");
      }
      const newProduct = await Product.create({
        id,
        name,
        description,
        quantity,
        price,
      });
      res.status(200).send({ message: "新增商品成功", data: newProduct });
    } catch (error) {
      res.status(400).send({ message: "伺服器錯誤", data: error });
    }
  });

  /*Sreach all Products*/
  app.get("/products", async (req, res) => {
    try {
      const findProduct = await Product.findAll({});
      if (!findProduct) {
        res.status(404).send("目前還沒有商品上架");
      }
      res.status(200).send("成功找出所有商品" + JSON.stringify(findProduct));
    } catch (error) {
      res.status(500).send({ message: "伺服器錯誤", data: error });
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
        res.status(200).send(`成功刪除商品:` + JSON.stringify(productToDelete));
      } else {
        res.status(409).send("商城中無此商品");
      }
    } catch (error) {
      res.status(500).send({ message: "伺服器錯誤", data: error });
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
        res.status(400).send("找不到任何資料");
      }
      res.status(200).send({ message: "所有表單", data: findProduct });
    } catch (error) {
      res.status(500).send({ message: "伺服器錯誤", data: error });
    }
  });

  /*新增購物表單*/
  app.post("/orders", async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const product = await Product.findByPk(productId);
      if (!product) {
        res.status(404).send({ message: "找不到此商品", data: null });
      }
      if (product.quantity < quantity) {
        res.status(400).send({ message: "此商品庫存不足", data: null });
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
      res.status(201).send({
        message: "成功創建新購物清單",
        data: { newOrder, newOrderItem },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "伺服器錯誤", data: error });
    }
  });

  /*刪除購物訂單*/
  app.delete("/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const findOrder = await Order.findOne({ where: { id } });
      if (!findOrder) {
        res.status(400).send({ message: "無此訂單", data: findOrder });
      }
      await OrderItem.destroy({ where: { orderId: id } });
      const deleteOrder = await Order.destroy({ where: { id } });
      if (deleteOrder > 0) {
        res.status(200).send({ message: "已經刪除訂單", data: findOrder });
      }
    } catch (error) {
      res.status(500).send({ message: "伺服器錯誤", data: error });
    }
  });
  return app;
}
module.exports = setupRoutes;
