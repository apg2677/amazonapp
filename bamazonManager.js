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
    ]).then(function(answer) {
        var command = answer.command;
        switch(command) {
            case commands[0]:
                GetProducts();
                break;
            case commands[1]:
                GetLowInventory();
                break;
            case commands[2]:
                UpdateInventory();
                break;
            case commands[3]:
                AddProduct();
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
            "SELECT * FROM products where stock_quantity < 5",
            function (err, res) {
                // console.log(res.affectedRows + " products returned!\n");
              
                connection.end();
            }
        )
    });
}

function DisplayResults(table) {
   var keys =  Object.keys(table[0]);
   // console.log("Object Keys: " + keys);
    for (var i in keys) {
        console.log(keys[i]);
    }
}   