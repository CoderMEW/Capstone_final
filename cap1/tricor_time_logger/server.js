const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',sql 
    password: 'password', // Replace with your MySQL password
    database: 'time_logger'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('MySQL connected...');
});

// User login route
app.post('/login', (req, res) => {
    const { name, idNumber, password, role } = req.body;
    console.log(`Login attempt: ${name}, ${idNumber}, ${password}, ${role}`); // Debug log
    const sql = `SELECT * FROM users WHERE name = ? AND idNumber = ? AND role = ? AND password = ?`;
    db.query(sql, [name, idNumber, role, password], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            res.status(500).send('Internal server error');
            return;
        }
        if (result.length > 0) {
            console.log('Login successful'); // Debug log
            res.send(result[0]);
        } else {
            console.log('Invalid credentials'); // Debug log
            res.status(401).send('Invalid credentials');
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

