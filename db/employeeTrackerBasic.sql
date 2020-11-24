-- initial data for the database
use employee_trackerDB;

INSERT INTO department (name) VALUES ("Marketing"),("HR"),("IT");

INSERT INTO role (title, salary, department_id)
VALUES ("manager",120000,1),
("Intern", 40000,2),
("Engineer",70000,3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Nerd", "King", 1, 1),
("Colla", "Kim", 2, null),
("Supp", "Kang", 3, null);