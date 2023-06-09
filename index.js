// imports. requrire is needed to use functions defined in generateMarkdown file
// inquirer is a node.js library and is need to ask questions in command line and store answers
// fs needed to gain access to file structor functions 
const inquirer = require('inquirer');
const mysql = require('mysql2');
const fs = require('fs');

// connection to database to add queries
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password1234',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

// Main Question
const question = 'What would you like to do?';

// This is used as the choice bank for main question
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

// Question for add department option
const addDepartmentQuestion = [
  'What is the name of the department?'
]

// Question for add role option
const addRoleQuestion = [
  'What is the name of the role?',
  'What is the salary of the role?',
  'Which department does the role belong to?'
]

// Question for add employee option
const addEmployeeQuestion = [
  'What is the first name of the employee?',
  'What is the last name of the employee?',
  'What is the employees role?',
  'Who is the Employees manager?'
]
const updateEmployeeQuestion = [
  "What employee's would you like to update?",
  'Which role do you want to assign to the selected employee?'
]

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
  // this will display all records in the department table
  .then(async (response) =>{
    if(response.choice == "View All Departments"){
      db.query('SELECT * FROM department;', function (err, results) {
      console.table(results);
      console.log('\n');
      init();
      });
    }
    // this will display all records in the roles table
    else if(response.choice == "View All Roles"){
      db.query('SELECT title, dp_name as department, salary FROM role JOIN department ON role.department_id = department.id;', function (err, results) {
      console.table(results);
      console.log('\n');
      init();
      });
    }

    // this will display all records in the employees table
    else if(response.choice == "View All Employees"){
      db.query(`SELECT e.first_name, e.last_name, title, dp_name AS department, salary, m.first_name AS Manager
      FROM employee e
      JOIN role ON e.role_id = role.id
      JOIN department ON role.department_id = department.id
      LEFT JOIN employee m ON m.id = e.Manager_id;`, function (err, results) {
        console.table(results);
        console.log('\n');
        init();
      });
    }

    // if add dept was selected ask what the dp name would be 
    else if(response.choice == "Add Department"){
      inquirer
        .prompt([
          {
            type: 'input',
            message: addDepartmentQuestion[0],
            name: "dp_name"
          }
        ])
        // take the user response(db_name) and will create a new record in the department table with that name
        .then((response) =>{

          db.query("insert into department SET ?", response);
          console.log('Department added to the database.');
          console.log('\n');
          init();
     })
    }
    // if add role was selected ask related questions needed to create role record
    else if(response.choice == "Add Role"){
      // in order to have choices come from our database for the "which dept does this role belong to" question.
      // we must map through all departments in the dept table and store in a variable to be used with inquirer
      var departments;
      db.query('SELECT * FROM department;', function (err, results) {
          departments = results.map(function(dept){
            return {
              name: dept.dp_name,
              value: dept.id
            }
          });        
        inquirer
          .prompt([
            {
              type: 'input',
              message: addRoleQuestion[0],
              name: "title"
            },
            {
              type: 'input',
              message: addRoleQuestion[1],
              name: "salary"
            },
            {
              type: 'list',
              message: addRoleQuestion[2],
              name: "department_id",
              choices: Object.values(departments)
            }
          ])
          // takes users input and creates a new record in the role table
          .then((response) =>{
            db.query("insert into role SET ?", response);
            console.log('Role added to the database.');
            console.log('\n');
            init();
          })
      })
    }
    // if add employee was selected ask related questions needed to create employee record
    else if(response.choice == "Add Employee"){
      // in order to have choices come from our database for the "which role does this employee belong to" question.
      // we must map through all roles in the role table and store in a variable to be used with inquirer
      var roles;
      db.query('SELECT * FROM role;', function (err, results) {
        db.query('SELECT * FROM employee;', function (err, results2) {
          roles = results.map(function(role){
            return {
              name: role.title,
              value: role.id
            }
          });          
          employees = results2.map(function(e){
            return {
              name: e.first_name,
              value: e.id
            }
          });          
        inquirer
          .prompt([
            {
              type: 'input',
              message: addEmployeeQuestion[0],
              name: "first_name"
            },
            {
              type: 'input',
              message: addEmployeeQuestion[1],
              name: "last_name"
            },
            {
              type: 'list',
              message: addEmployeeQuestion[2],
              name: "role_id",
              choices: Object.values(roles)

            },
            {
              type: 'list',
              message: addEmployeeQuestion[3],
              name: "Manager_id",
              choices: Object.values(employees)

            }
          ])
          .then((response) =>{
            db.query("insert into employee SET ?", response);
            console.log('Employee added to the database.');
            console.log('\n');
            init();
          })
        })
      })
    }
    else if(response.choice == "Update Employee Role"){
      // in order to have choices come from our database for the "which role does this employee belong to" question.
      // we must map through all roles in the role table and store in a variable to be used with inquirer
      var roles;
      var employees;
      db.query('SELECT * FROM role;', function (err, results) {
        db.query('SELECT * FROM employee;', function (err, results2) {
          roles = results.map(function(role){
            return {
              name: role.title,
              value: role.id
            }
          });          
          employees = results2.map(function(e){
            return {
              name: e.first_name + " " + e.last_name,
              value: e.id
            }
          });          
        inquirer
          .prompt([
            {
              type: 'list',
              message: updateEmployeeQuestion[0],
              name: "id",
              choices: Object.values(employees)

            },
            {
              type: 'list',
              message: updateEmployeeQuestion[1],
              name: "role_id",
              choices: Object.values(roles)

            }
          ])
          .then((response) =>{
            // UPDATE employee SET role_id = ? WHERE id = ?
            db.query(`UPDATE employee SET role_id = ${response.role_id} WHERE id = ${response.id}`, response);
            console.log('Employee updated.');
            console.log('\n');
            init();
          })
        })
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