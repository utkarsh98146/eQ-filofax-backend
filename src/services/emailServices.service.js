import dotenv from "dotenv"
import nodemailer from "nodemailer"
dotenv.config()
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GOOGLE_EMAIL || "maddison53@ethereal.email",
    pass: process.env.GOOGLE_APP_PASSWORD || "jn7jnAPss4f63QBp6D",
  },
})

// Wrap in an async IIFE so we can use await.
;(async () => {
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
    to: "bar@example.com, baz@example.com, shubootera98146@gmail.com",
    subject: "Hello ✔",
    text: "Hello world?", // plain‑text body
    html: "<b>Hello world?</b>", // HTML body
  })

  console.log("Message sent:", info)
})()
