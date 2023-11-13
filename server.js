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
    "SELECT emp_role.id, emp_role.title, emp_role.salary, emp_role.department_id, department.id, department.emp_name FROM emp_role LEFT JOIN department on emp_role.department_id = department.id", 
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
    "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, emp_role.title, emp_role.salary, emp_role.id, department.id FROM employee LEFT JOIN emp_role ON employee.role_id = emp_role.id LEFT JOIN department ON emp_role.department_id = department.id", 
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
    "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, emp_role.title, emp_role.salary, emp_role.id, department.id FROM employee LEFT JOIN emp_role ON employee.role_id = emp_role.id LEFT JOIN department ON emp_role.department_id = department.id", 
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
.then(function (answer) {
  // Map role name to its corresponding ID in the database
  mapRoleNameToId(answer.newRole)
    .then((roleId) => {
      // Map manager name to its corresponding ID in the database
      return mapManagerNameToId(answer.newManagerName)
        .then((managerId) => {
          connection.query(
            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
            [
              answer.newFirstName,
              answer.newLastName,
              roleId,
              managerId,
            ],
            function (err, res) {
              if (err) throw err;
              console.table(res);
              console.log(
                `Added ${answer.newFirstName} ${answer.newLastName} to the database`
              );
              startapp();
            }
          );
        });
    })
    .catch((error) => {
      console.error(error.message);
    });
});
}

function mapManagerNameToId(managerName) {
  return new Promise((resolve, reject) => {
    const [firstName, lastName] = managerName.split(" ");
    connection.query(
      "SELECT id FROM employee WHERE first_name = ? AND last_name = ?",
      [firstName, lastName],
      function (err, results) {
        if (err) {
          reject(err);
        } else if (results.length === 0) {
          reject(new Error("Manager not found"));
        } else {
          resolve(results[0].id);
        }
      }
    );
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

.then(function (answer) {
  // Map role name to its corresponding ID in the database
  const roleId = mapRoleNameToId(answer.eeRoleChoice);

  connection.query(
    "UPDATE employee SET role_id=? WHERE first_name= ?",
    [roleId, answer.eeRoleUpdate],
    function (err, res) {
      if (err) throw err;
      console.table(res);
      console.log(
        `Updated ${answer.eeRoleUpdate}'s role in the database`
      );
      startapp();
    }
  );
});
}
function mapRoleNameToId(roleName) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT id FROM emp_role WHERE title = ?",
      [roleName],
      function (err, results) {
        if (err) {
          reject(err);
        } else if (results.length === 0) {
          reject(new Error("Role not found"));
        } else {
          resolve(results[0].id);
        }
      }
    );
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