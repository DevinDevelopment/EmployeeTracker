// imports. requrire is needed to use functions defined in generateMarkdown file
// inquirer is a node.js library and is need to ask questions in command line and store answers
// fs needed to gain access to file structor functions 
const inquirer = require('inquirer');
const mysql = require('mysql2');
const fs = require('fs');

const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL Username
    user: 'root',
    // TODO: Add MySQL Password
    password: 'password1234',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

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

const addDepartmentQuestion = [
  'What is the name of the department?'
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
    if(response.choice == "View All Departments"){
      db.query('SELECT * FROM department;', function (err, results) {
      // console.log(results);
      console.table(results);
      console.log('\n');
      init();
      });
    }
    else if(response.choice == "View All Roles"){
      db.query('SELECT title, dp_name as department, salary FROM roles JOIN department ON roles.department_id = department.id;', function (err, results) {
      // console.log(results);
      console.table(results);
      console.log('\n');
      init();
      });
    }
    else if(response.choice == "View All Employees"){
      db.query('SELECT first_name, last_name, title, dp_name AS department, salary, Manager_id AS Manager FROM employees JOIN roles ON employees.role_id = roles.id JOIN department ON roles.department_id = department.id;', function (err, results) {
        // console.log(results);
        console.table(results);
        console.log('\n');
        init();
      });
    }
    else if(response.choice == "Add Department"){
      inquirer
        .prompt([
          {
            type: 'input',
            message: addDepartmentQuestion[0],
            name: "newDepartment",
          }
        ])
          .then((response) => {
            console.log(response.newDepartment);
            db.query(`INSERT INTO department(dp_name) VAULES ${response.newDepartment};`, function (err, results) {
              // console.log(results);
              console.table(results);
              console.log('\n');
              init();
            });
          })
    }
    else{
      console.log('You have exited the db');
      process.exit(1);
    }
  });
}

// Function call to initialize app
init();