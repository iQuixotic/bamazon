var mysql = require("mysql");

var inquirer = require("inquirer");

var Table = require('cli-table');


let chosenItem;
let myQuant;

// main menu function
function menuQ(){
    inquirer.prompt({
        name: "menuMain",
        type: "rawlist",
        message: "What would you like to do ?",
        choices: ["SHOP", 'SELL']
      })
      .then(function(answer) {
       
        if (answer.menuMain === "SHOP") {
          buy();
        }
        else if (answer.menuMain === 'SELL') {
          
          post();
        }
      });
}





 
function post() {
    //Prompts to determine what the item will be
    inquirer.prompt([
        {
          name: "item",
          type: "input",
          message: "What is the item you would like to sell ?",
        },
        {
          name: "category",
          type: "input",
          message: "How would you categorize this item ?"
        },
        {
          name: "price",
          type: "input",
          message: "What's your price ?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            
            console.log('This is not a valid price');
            return false;
          }
        },
          {
            name: "quantityOf",
            type: "input",
            message: "How many would you like to sell ?",
            validate: function(value) {
              if (isNaN(value) === false) {
                return true;
              }
              
              console.log('Please enter a number for the amount');
              return false;
            }
        }
      ])
      .then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "INSERT INTO buy SET ?",
          {
            item_name: answer.item,
            category: answer.category,
            price: answer.price,
            quantity: answer.quantityOf
          },
          function(err) {
            if (err) throw err;
            console.log("Your item is up for grabs !!");
            // re-prompt the user for if they want to buy or sell
            menuQ();
          }
        );
      });
  }
  
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bama_DB"
});
// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // back to main menu
  menuQ();
});

function drawT(results) {

  var table = new Table({
    head: ['ID', 'Item', 'Category', 'Price', 'Quantity Available']
    , colWidths: [10, 20, 20, 10, 16]
  });

  for (var i = 0; i < results.length; i++) {

    //  console.log(results);
    table.push(
      [results[i].id, results[i].item_name, results[i].category, results[i].price, results[i].quantity]
    );
  }
  console.log(table.toString());
}

function buy() {
  // query the database for all items
  connection.query("SELECT * FROM buy", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer.prompt([
        {
          name: "choice",
          type: "rawlist",
          message:" Look What I Have !!", 
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].item_name);
            }
            drawT(results);
            return choiceArray;
          }
          
        },
        {
          name: "howMany",
          type: "input",
          message: "How many Would you like ?",

          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
              // readAnreadAndCheck(answers.howMany);
            }
           
            console.log('Please enter a number for the amount');
            return false;
          }
          
        },
        {
          name: "bid",
          type: "confirm",
          message: "Are you sure?"
        }
       
      ])
      .then(function(answer) {
        // get the information of the chosen item
      
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
       
            myQuant = answer.howMany;
           
            readAndCheck(chosenItem.item_name, myQuant)
            // if(chosenItem.quantity > 0 && chosenItem.quantity > myQuant) {
            
            
          
          }
        }
        // run the initial prompt again
      
      });
  });
}

function deleteQuant(arg, arg2, total, quant){
  connection.query("UPDATE buy SET ? WHERE ?",
    [
      {
        quantity: total - quant
      },
      {
        id: arg
      }
    ],
    
    function (err, res) {
       
      console.log((quant) + ' ' + arg2 + " have been added to your cart!\n");
      // if(quantity === 0){
      //   deleteRow(arg);
      // }  
      deleteRow();
       menuQ();
       
        
     
      
    });
}


function deleteRow() {
  connection.query("DELETE FROM buy WHERE ?",  { quantity: 0 },
    function (err, res) {
      console.log(" You got all the things !!\n");
      // menuQ();
    });
}

function readAndCheck(arg, arg2) {
  console.log("Selecting all products...\n");
  connection.query("SELECT quantity FROM buy WHERE ?",{ item_name: arg },  function(err, res) {
    if (err) throw err;
    

    if(arg2 > res[0].quantity) {
      console.log('We do not have that many');      
      menuQ();
    } else {
      deleteQuant(chosenItem.id, chosenItem.item_name, chosenItem.quantity, arg2);
    }
  
  });

}

