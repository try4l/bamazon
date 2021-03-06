DROP DATABASE IF EXISTS `bamazon`;
CREATE DATABASE `bamazon`;
USE `bamazon`;
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products`(
`item_id` INTEGER(10) NOT NULL primary key auto_increment,
`product_name` VARCHAR(100) NOT NULL,
`department_name` VARCHAR(100),
`price` DECIMAL(10,2) NOT NULL,
`stock_quantity` INTEGER(10) NOT NULL,
`product_sales` DECIMAL(10,2) NOT NULL DEFAULT 0
);
INSERT INTO `products` (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Canned Smoked Rattlesnake", "Gourmet Foods", 23.99, 24, 0);
INSERT INTO `products` (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Edible Dehydrated Zebra Tarantula", "Gourmet Foods", 24.99, 6, 0);
INSERT INTO `products` (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Canned Unicorn Meat", "Gourmet Foods", 12.81, 15, 0);
INSERT INTO `products` (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Spam Snacks", "Gourmet Foods", 29.15, 100, 0);
INSERT INTO `products` (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("100 Year Old Egg", "Gourmet Foods", 15.89, 4, 0);
INSERT INTO `products` (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Chocolate Covered Ants", "Gourmet Foods", 2.65, 60, 0);
INSERT INTO `products` (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Drinking Bird", "Novelty Items", 6.05, 26, 0);
INSERT INTO `products` (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Whoopie Cushion", "Novelty Items", 6.65, 50, 0);
INSERT INTO `products` (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Handshake Buzzer", "Novelty Items", 6.99, 125, 0);
INSERT INTO `products` (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Fake Poo", "Novelty Items", 5.99, 30, 0);
