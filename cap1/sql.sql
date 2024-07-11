DROP DATABASE IF EXISTS tricor_time_logger;
CREATE DATABASE tricor_time_logger;
USE tricor_time_logger;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    idNumber VARCHAR(50),
    role VARCHAR(50),
    password VARCHAR(50)
);

CREATE TABLE time_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    date DATE,
    time TIME,
    type ENUM('in', 'out'),
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    description TEXT,
    status VARCHAR(50),
    hours DECIMAL(5,2),
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE hourly_rates (
    userId INT PRIMARY KEY,
    rate DECIMAL(10,2),
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE queries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    queryText TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Insert sample data into the users table
INSERT INTO users (name, idNumber, role, password) VALUES 
('Greg', '1234', 'Manager', 'Manager1'),
('Bob', '2345', 'Employee', 'Employee1'),
('Anna', '3456', 'Employee', 'Employee2'),
('Adam', '4567', 'Employee', 'Employee3');



