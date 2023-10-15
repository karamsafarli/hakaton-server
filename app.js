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

mongoose.set('strictQuery', false);

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



});

app.get('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.find({ email: email });

        if (!user) {
            return res.status(404).send("User not found");
        }

        if (password === user.password) {
            return res.status(200).json(user);
        } else {
            return res.status(503).send("Bad credentials");
        }

    } catch (error) {
        return res.status(500).send("User cannot find");
    }
})
