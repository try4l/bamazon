# bamazon
MySQL storefront CLI app.

![bamazon Video](bamazon1.mov)
![bamazon Video](bamazon2.mov)

https://drive.google.com/file/d/0BzKabXC4-69uakRQRFp4SGYtYWM/view?usp=sharing


Overview

An Amazon-like storefront that takes in orders from customers and deplete stock from the store's inventory. 
Also tracks product sales across the store's departments and then provides a summary of the highest-grossing departments in the store.

##Challenge #1: Customer View

Works on a MySQL Database called *bamazon*.

There is a Table inside that database called _products_ which has the following columns:
-item_id (unique id for each product)
-product_name (Name of product)
-department_name
-price (cost to customer)
-stock_quantity (how much of the product is available in stores)
-product_sales (added for bonus Challenges)

There were originally 10 different products but the applications allow updating them.

The first app is called *bamazonCustomer.js*. Running this application first displays the items available for sale. Including the ids, names, prices of products for sale and now also the product sales totals.

![bamazonCustomer1](/images/bamazonCustomer1.png)

The app queries the user first for which product they would like to buy.
And then for how many units of the product they would like.
Once the customer has placed the order, your application checks if the store has enough of the product to meet the customer's request.

If not, the app informs the user that there is insufficient quantity available to fill the order. Otherwise, it fulfills the customer's order, updating the quantities and product_sales totals and showing the customer the total cost of their purchase.

##Challenge #2: Manager View (Next Level)

The first app is called *bamazonManager.js*. Running this application lists a set of menu options:
-View Products for Sale
-View Low Inventory
-Add to Inventory
-Add New Product

If a manager selects View Products for Sale, the app lists all available items: the item IDs, names, prices, quantities (and product_sales).

If a manager selects View Low Inventory, it should lists all items with an inventory count lower than five.

If a manager selects Add to Inventory, the app displays a prompt that allows re-ordering any item to increase its quantity.

If a manager selects Add New Product, it allows the manager to add a new product to the store.

##Challenge #3: Supervisor View (Final Level)

This app is called *bamazonSupervisor.js* and operates on a MySQL table called _departments_. The table included these columns:
-department_id
-department_name
-over_head_costs
-total_profits - a derived value which is not in the actual table

Running this application lists a set of menu options:
-View Product Sales by Department
-Create New Department

When a supervisor selects View Product Sales by Department, the app displays a summarized table in their terminal/bash window. 

department_id	department_name	over_head_costs	product_sales	total_profit
01	Electronics	10000	20000	10000
02	Clothing	60000	100000	40000
The total_profit column should be calculated on the fly using the difference between over_head_costs and product_sales. total_profit should not be stored in any database. You should use a custom alias.

