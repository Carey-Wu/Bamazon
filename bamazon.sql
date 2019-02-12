DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products(
 item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
 product_name VARCHAR(100),
 department_name VARCHAR(100),
 price INT(20),
 stock_quantity INT(20),
 PRIMARY KEY (item_id)
);

-- CREATE TABLE bids(
--  id INTEGER(11) AUTO_INCREMENT NOT NULL,
--  firstName VARCHAR(100),
--  lastName VARCHAR(100),
--  PRIMARY KEY (id)
-- );

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Laptop", "Tech", 500, 20);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("External HD 2TB", "Tech", 125, 30);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("XBOX ONE", "Tech", 350, 10);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Marvel Movies Package", "Entertainment", 40, 25);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Volleyball Net", "Sporting Goods", 120, 12);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Baseball Cleats", "Sporting Goods", 65, 8);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Board Games", "Entertainment", 23, 15);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Paper Towels", "Home/Kitchen", 12, 50);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Crockpot", "Home/Kitchen", 45, 17);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Kitchen Knife Set", "Home/Kitchen", 95, 11);
