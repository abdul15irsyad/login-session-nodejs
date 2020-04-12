let mysql = require('mysql');

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_loginsession"
});

db.connect((err) => err ? console.log(err) : console.log("Database connected"))

module.exports = db;