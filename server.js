const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Signup
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const usersFile = path.join(__dirname, 'data', 'users.json');
    let users = [];
    if (fs.existsSync(usersFile)) {
        users = JSON.parse(fs.readFileSync(usersFile));
    }
    if (users.find(u => u.username === username)) {
        return res.status(400).send('User already exists');
    }
    users.push({ username, password });
    fs.writeFileSync(usersFile, JSON.stringify(users));
    res.send('Signup successful');
});

// Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const usersFile = path.join(__dirname, 'data', 'users.json');
    if (!fs.existsSync(usersFile)) return res.status(400).send('No users found');
    const users = JSON.parse(fs.readFileSync(usersFile));
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(400).send('Invalid credentials');
    res.send('Login successful');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
