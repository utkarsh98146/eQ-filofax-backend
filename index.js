import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import session from "express-session"
import passport from "passport"
import { authRouter } from "./src/routers/auth.routes.js"
import "./src/config/passport.config.js"
import { welcomeRouter } from "./src/routers/welcome.routes.js"
import { calendarEventRouter } from "./src/routers/calendarEvent.routes.js"
import db from "./src/models/index.model.js"
import { verifyToken } from "./src/middlewares/verifyToken.middleware.js"
import { profileRouter } from "./src/routers/profile.routes.js"

dotenv.config()

const app = express()

const PORT = parseInt(process.env.SERVER_PORT, 10) || 3000

app.use(express.urlencoded({ extended: true })) // parse the incoming reponse from form

app.use(cookieParser()) // it parse the cookies from the browser

app.use(
  cors({
    //allow the frontend to access the backend
    origin: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    // allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
)

app.use(express.json()) // it parse the json format

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false, // important!
    cookie: {
      secure: true, // true only if you're using https (which ngrok does)
      sameSite: "none", // important for cross-origin (frontend/backend are different ngrok)
    },
  })
)

//*-*-*-*- Initialize Passport to authenticate users *-*-*-*--*-*-*-*-*-*-*-*-*-*-*-*-*---*-*--*-/

app.use(passport.initialize()) // initialize the passoword lib

// it will use the session to store the user information and integrate with passport-session,as the user information is stored in the session as they logged in
app.use(passport.session())

/*--*-*-*-*-*-*-*-*-*-*-*-*-* Define the routes---*-*-*-*-*-*-*-*-*-*-*-*-*---*-*-*-*-*-*-*-*-*-*-*-*-*  */

app.use("/", welcomeRouter) // route for the welcome page

app.use("/api/google-calendar", calendarEventRouter) // route for the google calendar event

app.use("/api/auth", authRouter) // route for the auth(Login/SignUp)

app.use("/api/profile", verifyToken, profileRouter) //  route for user profile

/*--*-*-*-*-*-*-*-*-*-*-*-*-* Define the routes---*-*-*-*-*-*-*-*-*-*-*-*-*---*-*-*-*-*-*-*-*-*-*-*-*-*  */

// Server configuration
app.listen(PORT, (req, res) => {
  console.log(`Server started at http://localhost:${PORT}`)
})

db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log(`Database synchronized successfully..`)
  })
  .catch((err) => {
    console.log(`Database connection failed: ${err.message}`)
  })
