SELECT * FROM department;
SELECT * FROM roles;
SELECT * FROM employee;


SELECT * FROM department;

-- showing roles
SELECT title, dp_name as department, salary
FROM roles
JOIN department ON roles.department_id = department.id;

-- showing employees
SELECT e.first_name, e.last_name, title, dp_name AS department, salary, m.first_name AS Manager
FROM employee e
JOIN role ON e.role_id = role.id
JOIN department ON role.department_id = department.id
LEFT JOIN employee m ON m.id = e.Manager_id;
