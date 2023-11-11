//const sequelize = require('./config/connection');
const inquirer = require('inquirer');
const mysql = require('mysql2');


// Connect to database
const connection = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Arlo2022',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

connection.connect(function(err) {
  if (err) throw err;
  console.log(err)
  console.log (`
  _______________________________________________________
       ____  _  _  ____  __     __  _  _  ____  ____       
      (  __)( \/ )(  _ \(  )   /  \( \/ )(  __)(  __)      
       ) _) / \/ \ ) __// (_/\(  O ))  /  ) _)  ) _)       
      (____)\_)(_/(__)  \____/ \__/(__/  (____)(____)      
       _  _   __   __ _   __    ___  ____  ____            
      ( \/ ) / _\ (  ( \ / _\  / __)(  __)(  _ \           
      / \/ \/    \/    //    \( (_ \ ) _)  )   /           
      \_)(_/\_/\_/\_)__)\_/\_/ \___/(____)(__\_)     
  _______________________________________________________`)
    startapp();
});

function startapp() {
  inquirer
  .prompt([{
      type: 'list',
      name: 'task',
      message: 'What would you like to do?',
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "Quit"
      ],
  },
  ])
  .then ((answer) => {
    if (answer.task === "View All Employees") {
      viewAllEmployees();
    } else if (answer.task === "Add Employee") {
      addEmployee();
    } else if (answer.task === "Update Employee Role") {
      updateEmployeeRole();
    } else if (answer.task === "View All Roles") {
      viewAllRoles();
    } else if (answer.task === "Add Role") {
      addRole();
    } else if (answer.task === "View All Departments") {
      viewAllDepartments();
    } else if (answer.task === "Add Department") {
      addDepartment();
    } else 
      quit();
  });
};

// View functions // 
// View all Roles
function viewAllRoles () {
  connection.query(
    "SELECT * FROM emp_role", 
    function(err, result, fields) {
      if (err) throw err;
      console.table(result);
      startapp();
    }
  );
};

// View all Employees
function viewAllEmployees () {
  connection.query(
    "SELECT * FROM employee", 
    function(err, result, fields) {
      if (err) throw err;
      console.table(result);
      startapp();
    }
  );
};

// View all Departments
function viewAllDepartments () {
  connection.query(
    "SELECT * FROM department", 
    function(err, result, fields) {
      if (err) throw err;
      console.table(result);
      startapp();
    }
  );
};

// Add/prompt functions //
//Add Employee
function addEmployee() {
  inquirer
  .prompt([{
    type: "input",
    name: "newFirstName",
    message: "What is the first name of the employee?"
  },
  {
    type: "input",
    name: "newLastName",
    message: "What is the last name of the employee?"
  },
  {
    type: "list",
    name: "newRole",
    message: "What is the employee's role?",
    choices: [
      "Sales Lead",
      "Salesperson",
      "Lead Engineer",
      "Software Engineer",
      "Account Manager",
      "Accountant",
      "Legal Team Lead",
      "Lawyer"
    ],
  },
  {
    type: "list",
    name: "newManagerName",
    message: "Who is the employee's manager?",
    choices: [
      "None",
      "John Doe",
      "Mike Chan",
      "Ashley Rodriguez",
      "Kevin Tupik",
      "Kunal Singh",
      "Malia Brown",
      "Sarah Lourd",
      "Tom Allen"
    ],
  },
])
.then(function(answer) {
  connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answer.newFirstName, answer.newLastName, answer.newRoleID, answer.newManagerID], function(err, res) {
    if (err) throw err;
    console.table(res);
    console.log(`Added ${newFirstName} ${newLastName} to the database`)
    startapp();
});
});
}

function updateEmployeeRole() {
  inquirer
  .prompt([{
    type: "list",
    name: 'eeRoleUpdate',
    message: "Which employee's role do you want to update?",
    choices: [
      "John Doe",
      "Mike Chan",
      "Ashley Rodriguez",
      "Kevin Tupik",
      "Kunal Singh",
      "Malia Brown",
      "Sarah Lourd",
      "Tom Allen"
    ],
  },
  {
    type: "list",
    name: 'eeRoleChoice',
    message: "Which role do you want to you want to assign to the selected employee?",
    choices: [
      "Sales Lead",
      "Salesperson",
      "Lead Engineer",
      "Software Engineer",
      "Account Manager",
      "Accountant",
      "Legal Team Lead",
      "Lawyer"
    ],
  },
])
.then(function(answer) {
  connection.query('UPDATE employee SET role_id=? WHERE first_name= ?',[answer.eeRoleUpdate, answer.eeRoleChoice],function(err, res) {
    if (err) throw err;
    console.table(res);
    console.log(`Updated ${newFirstName} ${newLastName}'s role in the database`)
    startapp();
  });
});
}

function addRole() {
inquirer
.prompt([{
  type: "input",
  name: "roleName",
  message: "What is the name of the role?"
},
{
  type: "input",
  name: "roleSalary",
  message: "What is the salary of the role?"
},
{
  type: "list",
  name: "roleDepartment",
  message: "What department does the role belong to?",
  choices:[
    "Engineering",
    "Finance",
    "Legal",
    "Sales"
  ],
},
])
.then(function(answer) {
  connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.roleName, answer.roleSalary, answer.roleDepartment],function(err, res) {
    if (err) throw err;
    console.table(res);
    console.log(`Added ${roleName} to the database`)
    startapp();
  });
});
}

function addDepartment() {
  inquirer
  .prompt([{
    type: "input",
    name: "newDept",
    message: "What is the name of the department?"
  },
])
.then(function(answer) {
  connection.query("INSERT INTO department (name) VALUES (?)", [answer.newDept],function(err, res) {
    if (err) throw err;
    console.table(res);
    console.log(`Added ${newDept} to the database`)
    startapp();
  });
});
}

function quit() {
  connection.end();
  process.exit();
}