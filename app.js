require('dotenv').config();

const express = require('express');

const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/userSchema');
const scrapeData = require('./actions');
const path = require('path');
const zlib = require('zlib');
const mime = require('mime-types');
const fs = require('fs');
const bodyParser = require('body-parser')
const { GoogleGenerativeAI } = require("@google/generative-ai");
// const compression = require('compression');

const port = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '100mb' }));
app.use(cors());


// app.use(bodyParser.json({ limit: '100mb' }));
// app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));




app.use(express.static(path.join(__dirname, '/'), {
    setHeaders: (res, filePath) => {

        if (filePath.endsWith(".gz")) {
            res.set("Content-Encoding", "gzip");
        }
        if (filePath.includes("wasm")) {
            res.set("Content-Type", "application/wasm");
        }

    },
}))

// mongoose.set('strictQuery', false);

// mongoose.connect(process.env.MONGODB_URI.toString(), { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => app.listen(port, () => {
//         console.log("App is listening")
//     }))

app.get('/', (req, res) => {
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

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        console.log(user);
        console.log(email);
        console.log(password);

        if (!user) {
            return res.status(404).send("User not found");
        }

        if (password == user.password) {
            return res.status(200).json(user);
        } else {
            return res.status(503).send("Bad credentials");
        }

    } catch (error) {
        return res.status(500).send("User cannot find");
    }
})


app.get('/getdata', async (req, res) => {
    const body = {
        username: 'nagi.nagiyev',
        password: 'Nagi20033'
    }
    // res.cookie("JSESSIONID", "10BC658D3617ECF270AE589DE1C057C8");
    // res.cookie("groupId", "1");
    // res.cookie("parentId", "0");
    try {
        const response = await fetch('http://lms.adnsu.az/adnsuEducation/ls?action=login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Referer": "http://lms.adnsu.az/adnsuEducation/login.jsp",
                'neuron': '96C584E57DD8CD0E883F782F8438CCD8',
                "Cookie": "parentId=0; groupId=1; JSESSIONID=10BC658D3617ECF270AE589DE1C057C8",
            },
            body: JSON.stringify(body),
        });

        console.log(response.headers)
        const text = await response.text();
        // console.log(text);

        // const data = await response.json();

        // let dataParsed;
        // try {
        //     dataParsed = JSON.parse()
        // } catch (error) {
        //     return res.status(500).json({ error: 'Non-JSON response received' });
        // }

        res.json(text);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
})

// LMS SCRAPER
app.get('/scrape', async (req, res) => {
    const data = await scrapeData('karam.safarli', 'SafarliK0452');
    console.log(data)
    res.status(200).json(data);
})

app.get('/hello', (req, res) => {
    res.send("HELLO")
})

// app.get('/game', (req, res) => {
//     res.sendFile(path.join(__dirname, "/index.html"))
// })


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/gemini', async (req, res) => {

    const { prompt, imageParts } = req.body;
    // console.log(imageParts)
    const modelName = imageParts.length > 0 ? "gemini-pro-vision" : "gemini-pro"
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    res.status(201).json(text);
})


app.listen(port, '0.0.0.0', () => {
    console.log("App is listening")
})