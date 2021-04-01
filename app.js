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
  const query = "SELECT * FROM colours ORDER BY id ASC";

  connection.query(query, (err, result) => {
    if (err) {
      throw err;
    }
    res.render("index", { colours: result });
  });
});

router.get("/colour/:id", function (req, res) {
  const query = `SELECT * FROM colours WHERE id = ${req.params.id}`;

  connection.query(query, (err, result) => {
    if (err) {
      throw err;
    }
    res.render("colour", { colour: result[0] });
  });
});
router.get("/add-colour", function (req, res) {
  res.render("add-colour");
});

router.post("/add-colour-complete", function (req, res) {
  const query = `INSERT INTO colours (name) VALUES ("${req.body.name}")`;

  connection.query(query, (err, result) => {
    if (err) {
      throw err;
    }
    res.writeHead(302, {
      Location: "/",
    });
    res.end();
  });
});

app.use("/", router);

app.listen(config.serverPort, () => {
  console.log("Server is running at port:", config.serverPort);
});
