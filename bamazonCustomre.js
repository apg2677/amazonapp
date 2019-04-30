require("dotenv").config();

var mysql = require("mysql");
var inquirer = require("inquirer");

var commands = ["List Products", "Get Order"];


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
    inquirer.prompt([
        {
            type: "rawlist",
            name: "command",
            choices: commands,
            message: "Command"
        }
    ]).then(function (answer) {
        switch (answer.command) {
            case commands[0]:
                ListProducts();
                break;
            case commands[1]:
                GetOrder();
                break;
        }
    });




    // connection.end();
});

function ListProducts() {
    console.log("Querying prpoducts...\n");
    var query = connection.query(
        "SELECT * FROM products",
        function (err, res) {
            DisplayResults(res)
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
                // console.log("results: " + stock_quantity);
                if (answers.units > stock_quantity) {
                    console.log("Not enough units in stock");

                }
                else {
                    updateUnits(ID, stock_quantity, order_qty);
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

function DisplayResults(table) {
    CreateHeader(table);

    DisplayData(table);

}

function DisplayData(table) {
    var valuesStr = "";
    for (var i in table) {
        var temp = Object.values(table[i]);
        for (var j = 0; j < temp.length; j++) {
            valuesStr += temp[j] + "\t";
        }
        console.log(valuesStr);
        valuesStr = "";
    }
}

function CreateHeader(table) {
    var keys = Object.keys(table[0]);
    var headerStr = "";
    var borderStr = "_";
    for (var i in keys) {
        headerStr += keys[i] + "\t";
        var tempStr = keys[i] + "\t";
        var len = tempStr.length;
        for (var j = 0; j < len; j++) {
            borderStr += "_";
        }
        borderStr += " ";
    }
    console.log(headerStr);
    console.log(borderStr);
    console.log("");
}