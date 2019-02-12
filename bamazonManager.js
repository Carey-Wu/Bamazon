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
    managerOptions();
});

function managerOptions() {
    inquirer
        .prompt({
            name: "manager_options",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "No Action Necessary"
            ]
        }).then(function (answer) {
            switch (answer.manager_options) {
                case "View Products for Sale":
                    showItems();
                    break;

                case "View Low Inventory":
                    lowInventory();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                    addNewItem();
                    break;

                case "No Action Necessary":
                    connection.end();
                    break;
            }
        });
}

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
        function question() {
            inquirer.prompt([
                {
                    type: "confirm",
                    message: "Do you have more to do?",
                    name: "confirmation",
                    default: true
                }
            ]).then(function (inquirerResponse) {
                if (inquirerResponse.confirmation) {
                    managerOptions();
                }
                else {
                    console.log("All done!")
                    connection.end();
                }
            })
        }
        question();
    });
}

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        var table = new Table({
            head: ["item_id", "product_name", "department_name", "price", "stock_quantity"],
            colWidths: [10, 45, 35, 10, 20]
        });

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }
        console.log(table.toString());
        function question() {
            inquirer.prompt([
                {
                    type: "confirm",
                    message: "Do you have more to do?",
                    name: "confirmation",
                    default: true
                }
            ]).then(function (inquirerResponse) {
                if (inquirerResponse.confirmation) {
                    managerOptions();
                }
                else {
                    console.log("All done!")
                    connection.end();
                }
            })
        }
        question();
    });
}

function addInventory() {
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
        increaseQuantity();

        // Function to find out what the customer wants using Inquirer
        function increaseQuantity() {
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "What is the ID number of the item you would like to add more of?",
                        name: "item_id",
                    },
                    {
                        type: "input",
                        message: "How many units would you like to add?",
                        name: "add_quantity",
                        validate: function(value) {
                            if (isNaN(value) === false) {
                                return true;
                            }
                            return false;
                        }
                    }
                ])
                .then(function (inquirerResponse) {

                    console.log("Adding stock to " + res[inquirerResponse.item_id - 1].product_name);
                    // Query that updates values in the database based on user inputs
                    var query = connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: parseInt((res[inquirerResponse.item_id - 1].stock_quantity)) + parseInt(inquirerResponse.add_quantity)
                            },
                            {
                                item_id: res[inquirerResponse.item_id - 1].item_id
                            }
                        ],
                        function (err, res) {
                            showItems();
                        }
                    )
                })
        }
    })
}

function addNewItem() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the item?",
                name: "product_name"
            },

            {
                type: "input",
                message: "What department does it fall under?",
                name: "department_name"
            },
            {
                type: "input",
                message: "What is the price?",
                name: "price",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                type: "input",
                message: "How many are you adding to stock?",
                name: "stock_quantity",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                type: "confirm",
                message: "Is everything entered correctly?",
                name: "confirmation",
                default: true
            }

        ])
        .then(function (inquirerResponse) {
            if (inquirerResponse.confirmation) {
                function createItem() {
                    console.log("Inserting new item into inventory...\n");
                    var query = connection.query(
                        "INSERT INTO products SET ?",
                        {
                            product_name: inquirerResponse.product_name,
                            department_name: inquirerResponse.department_name,
                            price: inquirerResponse.price,
                            stock_quantity: inquirerResponse.stock_quantity
                        },
                    );
                }
                createItem();
                addMore();
            }
            else {
                addNewItem();
            }
        })
}

function addMore() {
    inquirer.prompt([
        {
            type: "confirm",
            message: "Do you have other items to add?",
            name: "confirmation",
            default: true
        }

    ]).then(function (inquirerResponse) {
        if (inquirerResponse.confirmation) {
            addNewItem();
        }
        else {
            console.log("All done entering items!")
            function question() {
                inquirer.prompt([
                    {
                        type: "confirm",
                        message: "Do you have more to do?",
                        name: "confirmation",
                        default: true
                    }
                ]).then(function (inquirerResponse) {
                    if (inquirerResponse.confirmation) {
                        managerOptions();
                    }
                    else {
                        console.log("All done!")
                        connection.end();
                    }
                })
            }
            question();
        }
    })
}

