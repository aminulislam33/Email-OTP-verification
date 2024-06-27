require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
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

app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

app.post('/generate-otp', handleOTPGeneration);

app.post('/verify-otp', handleOTPVerification);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});