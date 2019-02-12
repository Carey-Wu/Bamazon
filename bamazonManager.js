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
                    songSearch();
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
                        name: "add_quantity"
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

function postItem (){
    inquirer
       .prompt([
           {
               type: "input",
               message: "What is the item?",
               name: "item_name"
           },

           {
               type: "checkbox",
               name: "item_functional_purpose",
               message: "What is the item for?",
               choices: ["Entertainment", "Work", "Food/Drink", "Travel", "School"]
               
           },
           {
               type: "input",
               message: "What is your asking price?",
               name: "asking_price"
           },
           {
               type: "confirm",
               message: "Is everything entered correctly?",
               name: "confirmation",
               default: true
           }

       ])
       .then(function(inquirerResponse){
           if(inquirerResponse.confirmation) {
               function createItem() {
                   console.log("Inserting a new item...\n");
                   var query = connection.query(
                     "INSERT INTO posted_items SET ?",
                     {
                       item_name: inquirerResponse.item_name ,
                       item_functional_purpose: inquirerResponse.item_functional_purpose,
                       asking_price: inquirerResponse.asking_price
                     },
                     function(err, res) {
                       console.log(res.affectedRows + " item inserted!\n");
                     }
                   );
                   console.log(query.sql);
                 }
              createItem(); 
              addMore();                    
           }
           else {
               postItem();
           }
       })
} 

function addMore () {
   inquirer.prompt([
       {
           type: "confirm",
           message: "Do you have other items to list?",
           name: "confirmation",
           default: true
       }
   
   ]).then(function (inquirerResponse) {
       if (inquirerResponse.confirmation) {
           postItem();
       }
       else {
           return console.log("All done entering items!")
       }
   })
}

