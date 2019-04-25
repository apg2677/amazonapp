require("dotenv").config();

var mysql = require("mysql");


console.log(process.env.PW);

var connection = mysql.createConnection({
    host: "localhost",
    port:3306,
    user:"root",

    password:process.env.PW,
    database:"bamazon"
})  

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    ListProducts();
  });
  
  function ListProducts() {
    console.log("Querying prpoducts...\n");
    var query = connection.query(
      "SELECT * FROM products",
      function(err, res) {
        console.log(res.affectedRows + " products returned!\n");
        console.log("results: " + JSON.stringify(res, null, 4));
      }
    );
  
    // logs the actual query being run
    console.log(query.sql);
    connection.end();
  }