const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const OTP = require('../models/user');

async function handleOTPGeneration(req, res) {
    const { email } = req.body;

    console.log(email);

    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

    try {
        await OTP.create({ email, otp });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP for verification is: ${otp}`
        });

        res.status(200).send('OTP sent successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending OTP');
    }
};

async function handleOTPVerification(req,res){
    const { email, otp } = req.body;

    try {
        const otpRecord = await OTP.findOne({ email, otp }).exec();

        if (otpRecord) {
            res.status(200).send('OTP verified successfully');
        } else {
            res.status(400).send('Invalid OTP');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error verifying OTP');
    }
};

module.exports = {
    handleOTPGeneration,
    handleOTPVerification
}