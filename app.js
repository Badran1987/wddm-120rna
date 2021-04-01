const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const config = require("./config");

const app = express();
const router = express.Router();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// DB Setup
const connection = mysql.createConnection({
  user: config.dbConfig.user,
  password: config.dbConfig.password,
  host: config.dbConfig.host,
  port: config.dbConfig.port,
  database: config.dbConfig.database,
});

connection.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to db");

  connection.query("SHOW TABLES", (err, result) => {
    if (err) {
      throw err;
    }
  });
});

router.get("/", function (req, res) {
  res.send("Hello World!");
});

app.use("/", router);

app.listen(config.serverPort, () => {
  console.log("Server is running at port:", config.serverPort);
});
