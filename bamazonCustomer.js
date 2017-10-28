var mysql = require("mysql");
var inquirer = require("inquirer");

// Global vars
var currItemId = 0;
var currOrderQty = 0;
var currPrice = 0;

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
  getItemId();
});

function getItemId() {
  // show the user all the items
  var query = "SELECT * FROM `products`";  
  connection.query(query, function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to buy
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
          message: "What item would you like to purchase?"
        }
      ])
      .then(function (answers) {
        currItemId = answers.choice.split(' ')[0];
        currPrice = answers.choice.split(' ')[1];
        //console.log("currItemId: ", currItemId);
        //console.log("currPrice: ", currPrice);
        //console.log("answers.choice: ", answers.choice);
        //console.log("answers.choice.split(' ')[0]: ", answers.choice.split(' ')[0]);
        //console.log(JSON.stringify(answers, null, '  '));
        getProductQty();
      });
  });
}

function getProductQty() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'qty',
        message: 'What quantity would you like?',
        validate: function (value) {
          //console.log("value: ", value);
          if (isNaN(value)===false) {
            return true;
          }
          return 'Please enter a number.';
        }
      }
    ])
    .then(function (answers) {
      currOrderQty = parseInt(answers.qty);
      //console.log("currOrderQty: ", currOrderQty);
      //console.log(answers.qty);
      //console.log(JSON.stringify(answers, null, '  '));
      checkRemainingStock();
    });
}

function checkRemainingStock () {
  //console.log("checkRemainingStock: currItemId: ", currItemId, " currOrderQty: ", currOrderQty);
  var query = "SELECT * FROM `products` WHERE `item_id` = " + "'" + currItemId.toString() + "'";  
  connection.query(query, function(err, results) {
    if (err) throw err;
    // check if there are enough items left
    //console.log("results: ", results); 
    //console.log("results[0].item_id ", results[0].item_id);  
    if (results[0].stock_quantity>=currOrderQty) {
      //console.log("Sufficient Quantity. ", results[0].stock_quantity);
      //updateQuantity();
      var query = "UPDATE `products` SET `stock_quantity` = " 
                  + "'" + (results[0].stock_quantity - currOrderQty).toString() + "'" 
                  + "WHERE `item_id` = " + "'" + currItemId.toString() + "'";  
      //console.log("query: ", query);
      connection.query(query, function(err, results) {
        if (err) throw err;
        //console.log("Quantity Updated");
        console.log("Total Cost: $", (currOrderQty * currPrice).toFixed(2));
        askGoAgain();
      });

    } else {
      console.log("Insufficient Quantity Available!");
      askGoAgain();
    }
    //askGoAgain();
  });
}

// function updateQuantity () {
//   console.log("updateQuantity: currItemId: ", currItemId, " currOrderQty: ", currOrderQty);
//   var query = "UPDATE `products` SET `stock_quantity` = " 
//               + "'" + (results[0].stock_quantity - currOrderQty).toString() + "'" 
//               + "WHERE `item_id` = " + "'" + currItemId.toString() + "'";  
//   //console.log("query: ", query);
//   connection.query(query, function(err, results) {
//     if (err) throw err;
//     // check if there are enough items left
//     console.log("results: ", results);
//     askGoAgain(); 
//   });
// }

// function calcTotalCost () {
//   console.log("checkRemainingStock: currItemId: ", currItemId, " currOrderQty: ", currOrderQty);
//   var query = "SELECT * FROM `products` WHERE `item_id` = " + "'" + currItemId.toString() + "'";  
//   connection.query(query, function(err, results) {
//     if (err) throw err;
//     // check if there are enough items left
//     console.log("results: ", results); 
//     console.log("results[0].item_id ", results[0].item_id);  
//     if (results[0].stock_quantity>=currOrderQty) {

//       console.log("Sufficient Quantity. ", results[0].stock_quantity);
//     } else {
//       console.log("Insufficient Quantity Available!");
//       askGoAgain();
//     }
//   });
// }

function askGoAgain() {
  // once you have the items, prompt the user for which they'd like to bid on
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'repeat',
        message: 'Would you like to order again? y/n',
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
        getItemId();
      }
    });
}