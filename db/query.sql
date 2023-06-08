SELECT * FROM department;
SELECT * FROM roles;
SELECT * FROM employees;


SELECT * FROM department;

-- showing roles
SELECT title, dp_name as department, salary
FROM roles
JOIN department ON roles.department_id = department.id;

SELECT first_name, last_name, title, dp_name AS department, salary, Manager_id AS Manager
FROM employees
JOIN roles ON employees.role_id = roles.id
JOIN department ON roles.department_id = department.id;

