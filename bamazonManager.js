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


GetCommand();

function GetCommand() {
    var commands = ["View Products", "View Low Inventory", "Add Inventory", "Add Product"];
    inquirer.prompt([
        {
            name: "command",
            type: "rawlist",
            choices: commands,
            message: "Pick a command"
        }
    ]).then(function (answer) {
        var command = answer.command;
        switch (command) {
            case commands[0]:
                GetProducts();
                break;
            case commands[1]:
                GetLowInventory();
                break;
            case commands[2]:
                inquirer.prompt([
                    {
                        name: "id",
                        message: "Enter ID of product:"
                    },
                    {
                        name: "new_qty",
                        message: "New Quantity"
                    }
                ]).then(function (answer) {
                    UpdateInventory(answer);
                })

                break;
            case commands[3]:
                inquirer.prompt([
                    {
                        name: "pname",
                        message: "Enter Product Name"
                    },
                    {
                        name: "dname",
                        message: "Enter Department Name"
                    },
                    {
                        name: "price",
                        message: "Enter Price"
                    },
                    {
                        name: "qty",
                        message: "Quantity"
                    }
                ]).then(function (answer) {
                    AddProduct(answer);
                });

                break;
            default:
                console.log("Not a choice");
                break;
        }
    })
}

function GetProducts() {
    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId + "\n");
        console.log("Querying prpoducts...\n");
        var query = connection.query(
            "SELECT * FROM products",
            function (err, res) {
                console.log(res.affectedRows + " products returned!\n");
                // console.log("results: " + JSON.stringify(res, null, 4));
                DisplayResults(res);
                connection.end();
            }
        )
    });

}

function GetLowInventory() {
    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId + "\n");
        console.log("Querying inventory...\n");
        var query = connection.query(
            "SELECT * FROM products where stock_quantity < ?",
            65,
            function (err, res) {
                //console.log(JSON.stringify(res));
                DisplayResults(res);
                connection.end();
            }
        )
    });
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

function UpdateInventory(a) {
    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId + "\n");
        console.log("Updating inventory...\n");
        // console.log(JSON.stringify(a));
        var query = connection.query(
            "UPDATE products SET stock_quantity = ? where item_id = ?",
            [a.new_qty, a.id],

            function (err, res) {
                console.log("Item: " + a.id + " updated new qty: " + a.new_qty);
                connection.end();
            }
        )
    });
}

function AddProduct(a) {
    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId + "\n");
        console.log("Adding product to inventory...\n");
        // console.log(JSON.stringify(a));
        var query = connection.query(
            "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",
            [a.pname, a.dname, a.price, a.qty],

            function (err, res) {
                console.log("New Item added to the Database");
                connection.end();
            }
        )
    });
}