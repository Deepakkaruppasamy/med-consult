const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 2006;
const path = require('path');

mongoose.connect('mongodb://localhost:27017/medconsult')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    phone_number: String,
});

const User = mongoose.model('users', userSchema);

app.use(express.static(path.join(__dirname))); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname,'login.html'));
});
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname,'signup.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); 
});

app.post('/signup', async (req, res) => {
    const { Username, email, password, phone_number } = req.body;
    try {
        const newUser = new User({
            username: Username,
            email,
            password,
            phone_number,
        });
        await newUser.save();
        return res.status(201).send('Signup successful');
    } catch (err) {
        console.error('Error during signup:', err);
        return res.status(400).send('Error signing up');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
      
            return res.redirect('/');
        } else {
            return res.status(400).send('Invalid credentials');
        }
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
