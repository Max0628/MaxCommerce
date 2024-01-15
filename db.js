//db.js
const { Sequelize, DataTypes } = require("sequelize");
const httpPort = 3306;
require("dotenv/config");
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

module.exports = { DataTypes, sequelize, connectionToDb };
