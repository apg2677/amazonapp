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
    // console.log(order);

     // connection.end();
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
        var query = connection.query(
            "SELECT stock_quantity FROM products where item_id=" + answers.ID,
            function (err, res) {
                // console.log(query.sql);
                var stock_quantity = res[0].stock_quantity;
                var ID = answers.ID;
                var order_qty = answers.units;
                console.log("results: " + stock_quantity);
                if(answers.units > stock_quantity ) {
                    console.log("Not enough units in stock");

                }
                else {
                    updateUnits(ID, stock_quantity,order_qty);
                }
                connection.end();
            }
        )
    });

}
function updateUnits(id, qty, units) {
    var tempQty = qty;
    tempQty -= units;   
    var query = connection.query(
        "UPDATE products SET stock_quantity = " + tempQty + " where item_id=" + id,
        function (err, res) {
            console.log("Quantity Updated");
           
           // connection.end();
        }
    )
}

