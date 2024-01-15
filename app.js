//app.js
const express = require("express");
const app = express();

//連線到database..
const { connectionToDb } = require("./db");
connectionToDb();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
const setupRoutes = require("./route");
setupRoutes(app);

/*make sure the server work well*/
app.listen(3000, () => {
  console.log("伺服器正在監聽prot3000");
});

module.exports = { app, express };
