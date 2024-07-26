const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

// Initialize Express
const app = express();
app.use(cors());
// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://ritualsoflove:nipen02678@rituals-of-love.zqpsqg1.mongodb.net/inquiry', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
});

// Inquiry Schema
const inquirySchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  contactNumber: String,
  address:String,
  plan: {
    type: String,
    enum: ['Basic', 'Premium', 'Destination']
  }
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'info.ritualsoflove@gmail.com', // Replace with your email
    pass: 'xeht xewf mnvs kxun'   // Replace with your email password or app password
  }
});

// Routes
app.get('/api/get',async(req, res)=>{
  res.status(200).send('Hello');
})

app.post('/api/inquiries', async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    await inquiry.save();

    // Email options
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: 'info.ritualsoflove@gmail.com', // Replace with your email
      subject: 'New Inquiry Form Submission',
      text: `You have a new inquiry:
             Name: ${inquiry.firstName} ${inquiry.lastName}
             Email: ${inquiry.email}
             Contact Number: ${inquiry.contactNumber}
             Plan: ${inquiry.plan}
             Address:${inquiry.address}`
             
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send(error);
      } else {
        console.log('Email sent: ' + info.response);
        res.status(201).send(inquiry);
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Start the server
const PORT = process.env.PORT || 8181;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
