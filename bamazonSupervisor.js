var mysql = require("mysql");
var inquirer = require("inquirer");
// call once somewhere in the beginning of the app
var consoleTable = require("console.table");

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
          var choiceArray = ['View Product Sales by Department', new inquirer.Separator(), 
                            'Create New Department', new inquirer.Separator()];
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
          case 'View Product Sales by Department':
              viewProductSales();
              break;
          case 'Create New Department':
              createDepartment();
              break;
          default:
              console.log(answers.choice);
              console.log("Error: Bad task selection.")
              break;
      }
    });
}

function viewProductSales() {
  console.log("viewProductSales");
  connection.query("SELECT * FROM `departments`", function(err, results) {
    if (err) throw err;
    // Show the products
    for (var i = 0; i < results.length; i++) {
      console.log(results[i].department_id + " " + results[i].department_name + " " + results[i].over_head_costs + " "
                  + results[i].product_sales);
    }
    askGoAgain();
  });
}

function createDepartment() {
  console.log("createDepartment");
  var questions = [
  {
    type: 'input',
    name: 'deptName',
    message: 'Name of new department?',
  },
  {
    type: 'input',
    name: 'ovrHdCosts',
    message: 'What are your overhead costs?',
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
    name: 'prodSales',
    message: 'What were your initial product sales?',
    validate: function (value) {
      //console.log("value: ", value);
      if (isNaN(value)===false) {
        return true;
      }
    return false;
    }
  },
  ]; 

  inquirer.prompt(questions).then(function (answers) {
    console.log(JSON.stringify(answers, null, '  '));

    connection.query(
      "INSERT INTO `departments` SET ?",
      {
        department_name: answers.deptName,
        over_head_costs: answers.ovrHdCosts,
        product_sales: answers.prodSales
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