// imports. requrire is needed to use functions defined in generateMarkdown file
// inquirer is a node.js library and is need to ask questions in command line and store answers
// fs needed to gain access to file structor functions 
const inquirer = require('inquirer');
const fs = require('fs');

// this is used as a question bank
const question = 'What would you like to do?';

const choices = [
  'View All Employees',
  'Add Employee',
  'Update Employee Role',
  'View All Roles',
  'Add Role',
  'View All Departments',
  'Add Department',
  'Quit'
]

// this is a function created to write to a file. 
// we will use this function in the .then section of the inquirer function.
function writeToFile(fileName, data) {
  fs.appendFile(fileName, data, (err) =>
    // TODO: Describe how this ternary operator works
    err ? console.error(err) : console.log('Success'))
}

// this function is the actuall inquirer which will ask questions in the command line 
// then will store answers in response
function init() {
    inquirer
  .prompt([
    {
      type: 'list',
      message: question,
      name: "choice",
      choices: choices,
    }
  ])
  // take the respone(users answers) and call the writeToFile function we created
  // the data perameter will take the users response and push to our generateMarkdown function from the generateMarkdown file
  // generateMarkdown will be a function we are calling from another file which is why import require is needed
  .then((response) =>{
    // writeToFile('GeneratedREADME.MD', generateMarkdown.generateMarkdown(response))
    if(response.choice == "Quit"){
      console.log('You have exited the db');
      process.exit(1);
    }
    else{
      
      init();
    }
  });
}

// Function call to initialize app
init();