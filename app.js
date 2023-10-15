require('dotenv').config();

const express = require('express');

const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/userSchema');

const port = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI.toString(), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(port, () => {
        console.log("App is listening")
    }))

app.get('/', (req, res) => {
    res.send("salam dostlar");
});
app.get('/salam', (req, res) => {
    res.send("salam dostlar");
});

app.post('/register', async (req, res) => {
    console.log('post request');
    const userRequest = req.body;
    try {
        const user = new User({
            username: userRequest.username,
            email: userRequest.email,
            password: userRequest.password
        });

        await user.save();

        console.log(user);
       return res.status(201).json(user);
    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong");
    }



})
