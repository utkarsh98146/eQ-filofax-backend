import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

// testing
// const event = {
//   title: "utkarsh",
//   joinUrl: "www.google.com",
// }

// Create a test account or replace with real credentials.

const host = process.env.SMTP_HOST || "smtp.gmail.com"
const port = parseInt(process.env.SMTP_PORT, 10) || 587
const userEmail = process.env.GOOGLE_EMAIL || "subhashyadav.equasar@gmail.com"
const passport = process.env.GOOGLE_APP_PASSWORD || "nkvfkcwmvknqmxea"

console.log(`from env : ${process.env.VALUE}`)

console.warn(
  `host : ${host}, port no for email : ${port}, host email : ${userEmail}, host password : ${passport}`
)
const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: userEmail,
    pass: passport,
  },
})

// Wrap in an async IIFE so we can use await.
export const sendConfirmationEmail = async (to, subject, event) => {
  const info = await transporter.sendMail({
    from: userEmail,
    to: to,
    subject: subject,
    text: "Your meeting has been scheduled", // plain‑text body
    html: `<h3>${event.title} Your meeting has been scheduled!</h3>
    <p>Join your meeting ${event.joinUrl}</p>
    <p>Thank you.</p>
    `, // HTML body
  })

  console.log("Message sent:", info)
}

// testing purpose
// sendConfirmationEmail("test@test.com", "Meeting test demo", event)
