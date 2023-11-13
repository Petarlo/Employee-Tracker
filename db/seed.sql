INSERT INTO department (id, dept_name)
VALUES (1, "Engineering"),
       (2, "Finance"),
       (3, "Legal"),
       (4, "Sales");

INSERT INTO emp_role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 4),
       ("Salesperson", 80000, 4),
       ("Lead Engineer", 150000, 1),
       ("Software Engineer", 120000, 1),
       ("Account Manager", 160000, 2),
       ("Accountant", 125000, 2),
       ("Legal Team Lead", 250000, 3),
       ("Lawyer", 190000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id, department_id)
VALUES ("John", "Doe", 1, NULL, 4),
       ("Mike", "Chan", 2, 1, 4),
       ("Ashley", "Rodriguez", 3, NULL, 1),
       ("Kevin", "Tupik", 4, 3, 1),
       ("Kunal", "Singh", 5, NULL, 2),
       ("Malia", "Brown", 6, 5, 2),
       ("Sarah", "Lourd", 7, NULL, 3),
       ("Tom", "Allen", 8, 7, 3);