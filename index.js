// dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");

// connecting to mysql
var db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Rlatkdwns84",
  database: "employee_trackerdb",
});

// application starter
db.connect(function (err) {
  if (err) throw err;

  questions();
});

// questions for the user
function questions() {
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "Choose below.",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Role",
        "Create a Department",
        "Create a Role",
        "Add an Employee",
        "Update Employee Role",
        "Exit",
      ],
    })
    // Switch Case for each option
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          viewAll();
          break;

        case "View All Employees by Department":
          viewAllDepartment();
          break;

        case "View All Employees by Role":
          viewAllRole();
          break;

        case "Create a Department":
          createDep();
          break;

        case "Create a Role":
          createRole();
          break;
          
        case "Add an Employee":
          addEmployee();
          break;
        
        case "Update Employee Role":
          updateEmployee();
          break;
       
        case "Exit":
          db.end();
          break;
      }
    });
}

// view all employees
function viewAll() {
  db.query(
    `SELECT employee.first_name, employee.last_name, role.salary, role.title, department.name as "Department Name"
    FROM employee_trackerDB.employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id`,

    function (err, res) {
      if (err) throw err;

      console.table(res);
      questions();
    }
  );
}

// view all employees by department
function viewAllDepartment() {
  db.query(
    "SELECT department.name FROM employee_trackerDB.department",
    function (err, res) {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: "choice",
            type: "list",
            choices: function () {
              var choiceArray = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray.push(res[i].name);
              }
              return choiceArray;
            },
            message: "Which Department?",
          },
        ])
        .then(function (answer) {
          console.log(answer);
          console.log(answer.choice);

          db.query(
            `SELECT employee.first_name, employee.last_name, role.salary, role.title, department.name as "Department Name"
      FROM employee_trackerDB.employee
      INNER JOIN role ON employee.role_id = role.id
      INNER JOIN department ON role.department_id = department.id
      WHERE department.name LIKE "${answer.choice}"`,
            function (err, res) {
              if (err) throw err;

              console.table(res);
              questions();
            }
          );
        });
    }
  );
}

// view all employees by role
function viewAllRole() {
  db.query("SELECT role.title FROM employee_trackerDB.role", function (
    err,
    res
  ) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "choice",
          type: "list",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < res.length; i++) {
              choiceArray.push(res[i].title);
            }
            return choiceArray;
          },
          message: "Which Role?",
        },
      ])
      .then(function (answer) {
        console.log(answer);
        console.log(answer.choice);

        db.query(
          `SELECT employee.first_name, employee.last_name, role.salary, role.title, department.name as "Department Name"
        FROM employee_trackerDB.employee
        INNER JOIN role ON employee.role_id = role.id
        INNER JOIN department ON role.department_id = department.id
        WHERE role.title LIKE "${answer.choice}"`,
          function (err, res) {
            if (err) throw err;

            console.table(res);
            questions();
          }
        );
      });
  });
}

// create a department
function createDep() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the department name?",
      },
    ])
    .then(function (answer) {
      
      db.query(
        "INSERT INTO department SET ?",
        {
          name: answer.name,
        },
        function (err) {
          if (err) throw err;
          console.log(`You have created a department ${answer.name}.`)
          questions();
        }
      );
    });
}

// create a role
function createRole() {
  db.query(
    "SELECT department.name, department.id FROM employee_trackerDB.department",
    function (err, res) {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: "choice",
            type: "list",
            choices: function () {
              var choiceArray = [];
              var choiceArrayID = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray.push(res[i].name);
                choiceArrayID.push(res[i].id);
              }
              return choiceArray;
            },
            message: "Which Department?",
          },
          {
            name: "title",
            type: "input",
            message: "What is the role name?",
          },
          {
            name: "salary",
            type: "input",
            message: "What is the salary?",
          },
        ])
        .then(function (answer) {
          var department_id = answer.choice;

          for (var i = 0; i < res.length; i++) {
            if (res[i].name === answer.choice) {
              department_id = res[i].id;
              console.log(department_id);
            }
          }

          db.query(
            "INSERT INTO role SET ?",
            {
              title: answer.title,
              salary: answer.salary,
              department_id: department_id,
            },
            function (err) {
              if (err) throw err;

              console.log(`You have created ${answer.title} with salary of ${answer.salary} in ${department_id}.`)

              questions();
            }
          );
        });
    }
  );
}

// add an employee
function addEmployee() {
  db.query(
    "SELECT role.title, role.id FROM employee_trackerDB.role",
    function (err, res) {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: "choice",
            type: "list",
            choices: function () {
              var choiceArray = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray.push(res[i].title);
              }
              return choiceArray;
            },
            message: "Which Role?",
          },
        ])
        .then(function (answer) {
          console.log(answer);
          console.log(answer.choice);

          var role_id = answer.choice;

          for (var i = 0; i < res.length; i++) {
            if (res[i].title === answer.choice) {
              role_id = res[i].id;
              console.log(role_id);
            }
          }

          inquirer.prompt( [
            { message: "What is your first name?", name: "first_name" },
            { message: "What is your last name?", name: "last_name" }
          ]).then(function(useranswer){
             console.log(useranswer);
             db.query(
              "INSERT INTO employee SET ?",
              {
                first_name: useranswer.first_name,
                last_name: useranswer.last_name,
                role_id,
              },
              function (err) {
                if (err) throw err;
  
                console.log(`You have created an employee ${useranswer.first_name} ${useranswer.last_name} with a role of ${role_id}.`)
  
                questions();
              }
            );

           } )

          
        });
    }
  );
}

// update employee role
function updateEmployee() {
  db.query(
    `SELECT employee.first_name, employee.last_name, role.salary, role.title, role.id, department.name as "Department Name"
    FROM employee_trackerDB.employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id`,

    function (err, res) {
      if (err) throw err;
      console.log(res);
      inquirer
        .prompt([
          {
            name: "employeeChoice",
            type: "list",
            choices: function () {
              var choiceArray1 = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray1.push(`${res[i].first_name} ${res[i].last_name}`);
              }
              return choiceArray1;
            },
            message: "Which employee do you want to change?",
          },
        ])
        .then(function (answer) {
          db.query(
            `SELECT role.title, role.id, role.salary
            FROM employee_trackerDB.role`,

            function (err, res4) {
              if (err) throw err;

              inquirer
                .prompt([
                  {
                    name: "roleChoice",
                    type: "list",
                    choices: function () {
                      var choiceArray2 = [];
                      for (var i = 0; i < res4.length; i++) {
                        choiceArray2.push(res4[i].title);
                      }

                      return choiceArray2;
                    },
                    message: "Which role do you want to apply to the employee?",
                  },
                ])
                .then(function (answer2) {
                  console.log(answer);

                  // variables for update
                  var role_id, employeeId;

                  // searching and matching for name
                  db.query(
                    `SELECT employee.first_name, employee.last_name, employee.id
            FROM employee_trackerDB.employee`,

                    function (err, res2) {
                      if (err) throw err;

                      for (var i = 0; i < res2.length; i++) {
                        if (
                          `${res2[i].first_name} ${res2[i].last_name}` ===
                          answer.employeeChoice
                        ) {
                          employeeId = res2[i].id;
                        }
                      }
                      // searching and matching for title
                      db.query(
                        `SELECT role.title, role.salary, role.id
              FROM employee_trackerDB.role`,

                        function (err, res3) {
                          if (err) throw err;

                          for (var i = 0; i < res3.length; i++) {
                            if (`${res3[i].title}` === answer2.roleChoice) {
                              role_id = res3[i].id;
                            }
                          }

                          db.query(
                            "UPDATE employee SET ? WHERE ?",
                            [
                              {
                                role_id: role_id,
                              },

                              {
                                id: employeeId,
                              },
                            ],
                            function (err) {
                              if (err) throw err;
                              console.log("Employee's role has been changed.");
                              questions();
                            }
                          );
                        }
                      );
                    }
                  );
                });
            }
          );
        });
    }
  );
}



