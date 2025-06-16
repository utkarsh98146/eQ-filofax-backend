import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import session from "express-session"
import passport from "passport"
import "./src/config/passport.config.js"
import { welcomeRouter } from "./src/routers/welcome.routes.js"
import { calendarEventRouter } from "./src/routers/calendarEvent.routes.js"
import db from "./src/models/index.model.js"
import { verifyToken } from "./src/middlewares/verifyToken.middleware.js"
import { profileRouter } from "./src/routers/profile.routes.js"
import { authRouter } from "./src/routers/auth.routes.js"
import { zoomApiConfig } from "./src/config/zoomApi.config.js"
import { zoomMeetingRouter } from "./src/routers/zoomMeeting.routes.js"
import { eventsOnDashboardRouter } from "./src/routers/eventsOnDashboard.routes.js"
import { availabilityForEvents } from "./src/routers/availabilityForEvents.routes.js"
import { bookingRoute } from "./src/routers/booking.routes.js"
import path from "path"
import rateLimit from "express-rate-limit"

const app = express()
dotenv.config()

const PORT = parseInt(process.env.SERVER_PORT, 10) || 3000

//allow the frontend to access the backend
app.use(
  cors({
    // origin: [
    //   "http://localhost:5173",
    //   "http://localhost:3000",
    //   "http://localhost:3002",
    //   "http://127.0.0.1:5500",
    // ],
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
)
// it enables the cross-origin resource sharing (CORS) for the server, allowing the frontend to access the backend
app.use(express.urlencoded({ extended: true })) // parse the incoming reponse from form

app.use(cookieParser()) // it parse the cookies from the browser

app.use(express.json()) // it parse the json format

// session configuration for passport
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

// Rate limiting middleware to prevent abuse
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes by default
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requests by default
  message: {
    error: "Too many requsts from this IP,please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

//*-*-*-*- Initialize Passport to authenticate users *-*-*-*--*-*-*-*-*-*-*-*-*-*-*-*-*---*-*--*-/

app.use(passport.initialize()) // initialize the passoword lib

// it will use the session to store the user information and integrate with passport-session,as the user information is stored in the session as they logged in
app.use(passport.session())

//app.use("/uploads", express.static(path.join(__dirname, "uploads")))

/*--*-*-*-*-*-*-*-*-*-*-*-*-* Define the routes---*-*-*-*-*-*-*-*-*-*-*-*-*---*-*-*-*-*-*-*-*-*-*-*-*-*  */

app.use("/", welcomeRouter) // route for the welcome page

app.use("/api/auth", authRouter) // route for the auth(Login/SignUp)

app.use("/api/event", bookingRoute) // booking route for public route

app.use("/api/profile", verifyToken, profileRouter) //  route for user profile

app.use("/api/event-schedule", eventsOnDashboardRouter) // route for the events on the dashboard

app.use("/api/availability", verifyToken, availabilityForEvents) // route for the availability

app.use("/api/google-calendar", calendarEventRouter) // route for the google calendar event

app.use("/api/zoom-meeting", zoomMeetingRouter) // route for the zoom meeting

/*--*-*-*-*-*-*-*-*-*-*-*-*-* Define the routes---*-*-*-*-*-*-*-*-*-*-*-*-*---*-*-*-*-*-*-*-*-*-*-*-*-*  */

// Server configuration
app.listen(PORT, (req, res) => {
  console.log(`Server started at http://localhost:${PORT}`)
})
// console.log("Google Access token :", db.User.access_token)
// console.log("Google Refresh token :", db.User.refresh_token)

zoomApiConfig() // call the zoom api config function

db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log(`Database synchronized successfully..`)
  })
  .catch((err) => {
    console.log(`Database connection failed: ${err.message}`)
  })
