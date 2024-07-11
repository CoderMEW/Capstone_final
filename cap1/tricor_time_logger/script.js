const serverUrl = 'http://localhost:3000';
let loggedInUser = null;

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    document.querySelector('.container').prepend(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}

function login() {
    const name = document.getElementById('loginName').value;
    const idNumber = document.getElementById('loginIdNumber').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;

    console.log(`Login data: ${name}, ${idNumber}, ${password}, ${role}`); // Debug log

    if (!name || !idNumber || !role || !password) {
        showMessage('Please fill in all fields.', 'error');
        return;
    }

    fetch(`${serverUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, idNumber, password, role })
    })
    .then(response => {
        if (response.status === 401) {
            showMessage('Invalid credentials. Please try again.', 'error');
            return null;
        } else if (response.status === 500) {
            showMessage('Internal server error. Please try again later.', 'error');
            return null;
        }
        return response.json();
    })
    .then(user => {
        if (user) {
            loggedInUser = user;
            showMessage(`Welcome, ${name}! You are logged in as ${role}.`, 'success');
            document.getElementById('loginFormContainer').style.display = 'none';

            if (role === 'Employee') {
                document.getElementById('employeeActions').style.display = 'block';
                displayEmployeeTasks();
                generateEmployeePayslip();
                displayEmployeeTimeLogs();
            } else if (role === 'Manager') {
                document.getElementById('managerActions').style.display = 'block';
                populateEmployeeSelect();
                populateTaskEmployeeSelect();
                populatePayslipEmployeeSelect();
            }
        }
    })
    .catch(err => {
        console.error('Error:', err);
        showMessage('An error occurred. Please try again.', 'error');
    });
}

function logTime(type) {
    if (!loggedInUser) {
        showMessage('Please log in to log time.', 'error');
        return;
    }

    fetch(`${serverUrl}/log-time`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: loggedInUser.id, type })
    })
    .then(response => response.text())
    .then(message => {
        showMessage(message, 'success');
    })
    .catch(err => {
        console.error('Error:', err);
        showMessage('An error occurred. Please try again.', 'error');
    });
}

function submitTaskAssignment() {
    const employeeName = document.getElementById('employeeName').value;
    const taskDescription = document.getElementById('taskDescription').value;
    const taskHours = document.getElementById('taskHours').value;
    const hourlyRate = document.getElementById('hourlyRate').value;

    if (!employeeName || !taskDescription || !taskHours || !hourlyRate) {
        showMessage('Please fill in all fields.', 'error');
        return;
    }

    fetch(`${serverUrl}/assign-task`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: loggedInUser.id, description: taskDescription, hours: taskHours, rate: hourlyRate })
    })
    .then(response => response.text())
    .then(message => {
        showMessage(message, 'success');
        document.getElementById('employeeName').value = '';
        document.getElementById('taskDescription').value = '';
        document.getElementById('taskHours').value = '';
        document.getElementById('hourlyRate').value = '';
    })
    .catch(err => {
        console.error('Error:', err);
        showMessage('An error occurred. Please try again.', 'error');
    });
}

function sendQuery() {
    if (!loggedInUser) {
        showMessage('Please log in to send a query.', 'error');
        return;
    }

    const queryText = document.getElementById('queryText').value;

    if (!queryText) {
        showMessage('Please enter your query.', 'error');
        return;
    }

    fetch(`${serverUrl}/send-query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: loggedInUser.id, queryText })
    })
    .then(response => response.text())
    .then(message => {
        showMessage(message, 'success');
        document.getElementById('queryText').value = '';
    })
    .catch(err => {
        console.error('Error:', err);
        showMessage('An error occurred. Please try again.', 'error');
    });
}

function logout() {
    loggedInUser = null;
    showMessage('You have logged out.', 'success');
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('employeeActions').style.display = 'none';
    document.getElementById('managerActions').style.display = 'none';
    hideAllScreens();
    document.getElementById('output').innerHTML = '';
}

function hideAllScreens() {
    const screens = document.getElementsByClassName('screen');
    for (let screen of screens) {
        screen.style.display = 'none';
    }
}

function showScreen(screenId) {
    hideAllScreens();
    document.getElementById(screenId).style.display = 'block';
    if (screenId === 'employeeTimeLogs') {
        displayTimeLogsForManager();
    }
}


