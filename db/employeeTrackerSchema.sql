-- Deleting if the database already exists
DROP DATABASE IF EXISTS employee_trackerDB;
-- Creating a database
CREATE database employee_trackerDB;

-- using the database
USE employee_trackerDB;

-- creating department table
CREATE TABLE department (

id INTEGER AUTO_INCREMENT NOT NULL,
name VARCHAR(30) NOT NULL,
PRIMARY KEY (id)
 
);

-- Creating role table
CREATE TABLE role (

id INTEGER AUTO_INCREMENT NOT NULL,
title VARCHAR(30) NOT NULL,
salary DECIMAL NOT NULL,
department_id INT,
PRIMARY KEY (id),
FOREIGN KEY (department_id) REFERENCES department (id)
);

-- Creating employee table
CREATE TABLE employee (

id INTEGER AUTO_INCREMENT NOT NULL,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INTEGER NOT NULL,
FOREIGN KEY (role_id) REFERENCES role (id),
manager_id INTEGER,
PRIMARY KEY (id),
FOREIGN KEY (manager_id) REFERENCES employee (id)
);

