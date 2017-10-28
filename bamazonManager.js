var mysql = require("mysql");
var inquirer = require("inquirer");

// Global vars
var currItemId = 0;
var currReorderQty = 0;

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "Myander12",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  //start();
  selectTask();
});

function selectTask() {
  // Ask the user what to do
  inquirer
    .prompt([
      {
        name: "choice",
        type: "list",
        choices: function() {
          var choiceArray = ['View Products for Sale', new inquirer.Separator(), 'View Low Inventory', 
          new inquirer.Separator(), 'Add to Inventory', new inquirer.Separator(), 'Add New Product', new inquirer.Separator()];
          return choiceArray;
        },
        message: "Select task to perform."
      }
    ])
    .then(function (answers) {
      console.log("answers.choice: ", answers.choice);
      console.log(JSON.stringify(answers, null, '  '));
      // switch on task to perform
      switch(answers.choice) {
          case 'View Products for Sale':
              viewProducts();
              break;
          case 'View Low Inventory':
              viewLowInventory();
              break;
          case 'Add to Inventory':
              addInventory();
              break;
          case 'Add New Product':
              addProduct();
              break;
          default:
              console.log(answers.choice);
              console.log("Error: Bad task selection.")
              break;
      }
    });
}

function viewProducts() {
  console.log("viewProducts");
  connection.query("SELECT * FROM `products`", function(err, results) {
    if (err) throw err;
    // Show the products
    for (var i = 0; i < results.length; i++) {
      console.log(results[i].item_id + " " + results[i].price + " " + results[i].product_name + " ("
                  + results[i].stock_quantity + " left)");
    }
    askGoAgain();
  });
}

function viewLowInventory () {
  console.log("viewLowInventory");
  var query = "SELECT * FROM `products` WHERE `stock_quantity` < '5'";  
  connection.query(query, function(err, results) {
    if (err) throw err;
    // Show the products
    for (var i = 0; i < results.length; i++) {
      console.log(results[i].item_id + " " + results[i].price + " " + results[i].product_name + " (" 
                  + results[i].stock_quantity + " left)");
    }
    askGoAgain();
  });
}

function addInventory () {
  console.log("addInventory");
  var query = "SELECT * FROM `products`";  
  connection.query(query, function(err, results) {
    if (err) throw err;
    // Show the products
    inquirer
      .prompt([
        {
          name: "choice",
          type: "list",
          choices: function() {
            var chStr = "";
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              chStr = results[i].item_id + " " + results[i].price + " " + results[i].product_name
                    + " (" + results[i].stock_quantity + " left)";
              choiceArray.push(chStr);
            }
            return choiceArray;
          },
          message: "What item would you like to re-order?"
        },
        {
          type: 'input',
          name: 'qty',
          message: 'How many do you want to add to the inventory?',
          validate: function (value) {
            //console.log("value: ", value);
            if (isNaN(value)===false) {
              return true;
            }
          return false;
          }
        }
      ])
      .then(function (answers) {
        console.log("answers: ", answers);
        currItemId = answers.choice.split(' ')[0];
        currReorderQty = parseInt(answers.qty);
        var query = "UPDATE `products` SET `stock_quantity` = `stock_quantity` + " 
                    + "'" + (currReorderQty).toString() + "'" + " "
                    + "WHERE `item_id` = " + "'" + currItemId.toString() + "'";  
        //console.log("query: ", query);
        connection.query(query, function(err, results) {
          if (err) throw err;
          //console.log("Results: ", results);
          console.log("Quantity Updated");
          askGoAgain();
        });
      });
  });
}

function addProduct () {
  console.log("addProduct");
  var questions = [
  {
    type: 'input',
    name: 'prodName',
    message: 'Name of new product?',
  },
  {
    type: 'input',
    name: 'dptName',
    message: 'What is your department name?',
  },
  {
    type: 'input',
    name: 'price',
    message: 'Price of the item?',
    validate: function (value) {
      //console.log("value: ", value);
      if (isNaN(value)===false) {
        return true;
      }
    return false;
    }
  },
  {
    type: 'input',
    name: 'stckQty',
    message: 'Initial stock quantity',
    default: function () {
      return '0';
    },
    validate: function (value) {
      //console.log("value: ", value);
      if (isNaN(value)===false) {
        return true;
      }
    return false;
    }
  }
  ]; 

  inquirer.prompt(questions).then(function (answers) {
    console.log(JSON.stringify(answers, null, '  '));

    connection.query(
      "INSERT INTO `products` SET ?",
      {
        product_name: answers.prodName,
        department_name: answers.dptName,
        price: answers.price,
        stock_quantity: answers.stckQty
      },
      function(err) {
        if (err) throw err;
        console.log("Did it work?");
        askGoAgain();
      }
    );
  }); 
}

function askGoAgain() {
  // once you have the items, prompt the user for which they'd like to bid on
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'repeat',
        message: 'Would you like to perform another task? y/n',
      }
    ])
    .then(function (answers) {
      //console.log(answers.repeat);
      //console.log(JSON.stringify(answers, null, '  '));
      var repeat = answers.repeat;
      if (answers.repeat.length > 1) {
        repeat = answers.repeat[0];
      }
      if (repeat.toLowerCase()=='n') {
        connection.end();
      } else {
        selectTask();
      }
    });
}