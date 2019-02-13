# Bamazon

This app was developed using MySQL for a database, Javascript, and node package modules.  It is a Command Line Interface (CLI) application that is excecuted by using node.

The database consists of a MySQL Database called `bamazon`.  Within that database there is a table called `products` which is populated with the following data:

* item_id (unique id for each product)

* product_name (Name of product)

* department_name

* price (cost to customer)

* stock_quantity (how much of the product is available in stores)

If the user executes the Node application called `bamazonCustomer.js`, they will act as the customer shopping from a list of items by selecting the items based on their ID number and quantity they wish to purchase. They will be provided the total of each purchase they select. The database will adjust for any items purchased and display an updated inventory.  The user can either continue shopping for exit the app after they are done.

If the user executes the Node application called `bamazonManager.js`, they will be able to act as the Manager of the "store" and be able to choose tasks from a list including:

* View Products for Sale
    - This shows a list of everything for sale
    
* View Low Inventory
    - This populates a table of items with stock quantity less than 5
    
* Add to Inventory
    - This allows them to add stock quantity to existing items
    
* Add New Product
    - This allows them to add competely new items to the database by filling out the   prompted fields.

Video of a working example of the applications can be viewed at the link below.

https://drive.google.com/file/d/1PSqcz26CYLahQdu3j2FAZn4eFhjjcIVW/view?usp=sharing

