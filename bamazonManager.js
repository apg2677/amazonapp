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

// connection.connect(function (err) {
//     if (err) throw err;
//     console.log("connected as id " + connection.threadId + "\n");
  
// });
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
        console.log("Command: " + answer.command);
    })
}