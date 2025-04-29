import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import { sequelize } from './config/database.config.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';


dotenv.config()


const PORT = process.env.SERVER_PORT || 3000
const app = express()

app.use(cookieParser()) // it parse the cookies from the browser

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(cors({
    origin: process.env.FRONTEND_BASE_URL || true,
    credentials: true,
}))

app.use(session(
    {
        secret: process.env.SECRET_KEY,
        resave: false, //stop resaving the session if no modification
        saveUninitialized: true, // save the session even not modified
    }
))

app.listen(PORT, (req, res) => {
    console.log(`Server started at http://localhost:${PORT}`)
})

sequelize.sync({ alter: true })
    .then(() => {
        console.log(`Database synchronized successfully..`)
    })
    .catch((err) => {
        console.log(`Database connection failed: ${err.message}`);

    })
