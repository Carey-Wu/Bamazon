// Dependencies
var inquirer = require("inquirer");
var mysql = require("mysql");
var fs = require("fs");
var Table = require('cli-table3');

// MySQL Connection
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Greenlight*0908",
    database: "bamazon_db"
});

// Connection to the database.  All functions and user input are executed within this connection function to allow references back to database data.
connection.connect(function (err) {
    if (err) throw err;
    showItems();
});

// Function to show the items from the database in the CLI using a table
function showItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        
        // Using a set constructor from the npm for CLI-Table3
        var table = new Table({
            head: ["item_id", "product_name", "department_name", "price", "stock_quantity"],
            colWidths: [10, 45, 35, 10, 20]
        });

        // For loop to push all the data from the database into the CLI Table
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }

        // Displays table in CLI and goes on to function to ask the customer what they want
        console.log(table.toString());
        console.log("----------------------------------------------------");
        whichItem();

        // Function to find out what the customer wants using Inquirer
        function whichItem() {
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "What is the ID number of the item you would like to purchase?",
                        name: "item_id",
                    },
                    {
                        type: "input",
                        message: "How many units would you like to purchase?",
                        name: "purchase_quantity"
                    }
                ])
                .then(function (inquirerResponse) {

                    // IF ELSE functions for actions based on user responses.  IF statement passes the parameter if the user requested quantity is less than the stock quantity, purchase occurs and updates database quantities
                    if ((inquirerResponse.purchase_quantity) <= (res[inquirerResponse.item_id - 1].stock_quantity)) {
                        console.log("Your order has been placed...\n");

                        // Displays the total order price based on the price of the specific item and the quanitity ordered
                        console.log("Your total purchase comes to: $" + (res[inquirerResponse.item_id -1].price * inquirerResponse.purchase_quantity));

                        // Query that updates values in the database based on user inputs
                        var query = connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: (res[inquirerResponse.item_id - 1].stock_quantity) - inquirerResponse.purchase_quantity
                                },
                                {
                                    item_id: res[inquirerResponse.item_id - 1].item_id
                                }
                            ],
                            function (err, res) {

                                // Inquirer function to see if they're still looking to shop more.  If true are it runs the whichItem function again.  If false, it ends the connection to the database.
                                inquirer.prompt([
                                    {
                                        type: "confirm",
                                        message: "Do you have more shopping to do?",
                                        name: "confirmation",
                                        default: true
                                    }
                                ]).then(function (inquirerResponse) {
                                    if (inquirerResponse.confirmation) {
                                        whichItem();
                                    }
                                    else {
                                        console.log("All done shopping!")
                                        connection.end();
                                    }
                                })
                            }
                        );
                    }

                    //  ELSE function that accounts if they pick more than is in stock.  Returns a message and prompts them to make another selection by re-running the whichItem function.
                    else {
                        console.log("Insuffcient quantity, please select another item or smaller quantity");
                        whichItem();
                    }
                });
        }

    });
}