insert into department(dp_name)
values  ('Engineering'),
        ('Finance');

insert into roles(title, salary, department_id)
values  ('Lead Engineer', 300000.00, 1),
        ('Jr Engineer', 150000.00, 1),
        ('Ceo of Finance', 250000.00, 2);

insert into employees(first_name, last_name, role_id, Manager_id)
values  ('Devin', 'Nunez', 1, NULL),
        ('Kevin', 'Ortiz', 2, 1);
