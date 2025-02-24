const User = require("../models/User");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, tshirtSize, feeStatus } = req.body;

    // Save user to database
    const newUser = new User({ name, email, phone, tshirtSize, feeStatus });
    await newUser.save();

    // Generate PDF
    const doc = new PDFDocument();
    const pdfPath = path.join(__dirname, `../pdfs/registration-${newUser._id}.pdf`);
    doc.pipe(fs.createWriteStream(pdfPath));

    // Add content to PDF
    doc.text("Tour Registration Details", { align: "center" }).moveDown();
    doc.text(`Name: ${name}`);
    doc.text(`Email: ${email}`);
    doc.text(`Phone: ${phone}`);
    doc.text(`T-Shirt Size: ${tshirtSize}`);
    doc.text(`Fee Status: ${feeStatus}`);
    doc.end();

    // Send Email Notification to admin
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "New Registration Alert",
      text: `New user registered: ${name}, ${email}, ${phone}, ${tshirtSize}, Fee: ${feeStatus}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    // Respond with success and PDF filename
    res.json({
      success: true,
      message: "Registration successful!",
      pdfFile: `registration-${newUser._id}.pdf`,
    });

  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ success: false, message: "Registration failed!" });
  }
};
