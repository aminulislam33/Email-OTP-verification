require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const {
    handleOTPGeneration,
    handleOTPVerification
} = require('./controllers/user');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://127.0.0.1:27017/otp-verification")
    .then(() => {
        console.log("MongoDB connected");
    });

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.get("/", (req, res) => { res.render("send-otp") });
app.get("/verify-otp", (req,res)=>{res.render("verify-otp")});

app.post('/generate-otp', handleOTPGeneration);
app.post('/verify-otp', handleOTPVerification);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});