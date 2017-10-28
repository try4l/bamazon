USE `bamazon`;
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments`(
`department_id` INTEGER(10) NOT NULL primary key auto_increment,
`department_name` VARCHAR(100) NOT NULL,
`over_head_costs` DECIMAL(10) NOT NULL,
`product_sales` DECIMAL(10) NOT NULL DEFAULT 0
);
INSERT INTO `departments` (department_name, over_head_costs, product_sales)
VALUES ("Gourmet Foods", 10000, 11000);
INSERT INTO `departments` (department_name, over_head_costs, product_sales)
VALUES ("Novelty Items", 2000, 2500);
INSERT INTO `departments` (department_name, over_head_costs, product_sales)
VALUES ("Antiquities", 5000, 5000);
