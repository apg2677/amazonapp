require("dotenv").config();

var mysql = require("mysql");
var inquirer = require("inquirer");

console.log(process.env.PW);

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",

    password: process.env.PW,
    database: "bamazon"
})

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    // ListProducts();
    GetOrder();
    connection.end();
});

function ListProducts() {
    console.log("Querying prpoducts...\n");
    var query = connection.query(
        "SELECT * FROM products",
        function (err, res) {
            console.log(res.affectedRows + " products returned!\n");
            console.log("results: " + JSON.stringify(res, null, 4));
            connection.end();
        }
    )
}

function GetOrder() {
    inquirer.prompt([
        {
            name: "ID",
            message: "Product Id"
        },
        {
            name: "units",
            message: "units"
        }
    ]).then(function (answers) {
        console.log(answers);
    }
    )
}

