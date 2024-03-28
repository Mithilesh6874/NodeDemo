const mysql = require("mysql2");

//connection of database
const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Mithilesh",
  database: "node_demo",
});
mysqlConnection.connect((err) => {
  if (!err) {
    console.log("Database Connected Succesfully");
  } else {
    console.log("Database Connection Failed");
  }
});
module.exports = mysqlConnection;
