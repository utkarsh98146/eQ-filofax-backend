import express from "express"
import passport from "passport"
import { login, sendToken, signup } from "../controllers/auth.controller.js"
import dotenv from "dotenv"
import "../config/passport.config.js" // passport configuration
import { generateToken } from "../services/jwt_tokenServices.service.js"
import db from "../models/index.model.js"
import { scopes } from "../utils/googleCalendar.utils.js"

const router = express.Router()
dotenv.config()

/* Local Signup/Login routes */
router.post("/local-signUp", signup)
router.post("/local-login", login)

/* when google button click it work*/

router.get(
  "/google",
  passport.authenticate("google", {
    scope: scopes,
    accessType: "offline",
    prompt: "consent",
  })
)

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.GOOGLE_REDIRECT_URI,
    session: false, // If you're using JWT not sessions
  }),
  async (req, res) => {
    try {
      const { googleId, googleAccessToken, googleRefreshToken } = req.user

      console.log(
        "Google Access Token before jwt generate :",
        googleAccessToken
      )
      console.log(
        "Google Refresh Token before jwt generate :",
        googleRefreshToken
      )
      console.log("The details from the req.user : ", req.user)
      const token = await generateToken(req.user)
      // Save this into DB
      await db.User.update(
        { token, googleId, googleAccessToken, googleRefreshToken },
        { where: { email: req.user.email } }
      )

      // testing purpose
      // const FRONTEND_URL = `http://127.0.0.1:5500/filoFax-backend/src/dummy-files/google-apis-test.html`

      const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"

      if (token || googleAccessToken || googleRefreshToken) {
        console.log("Token when enter in if block for redirect : ", token)

        console.log(
          "Google Access Token after jwt generate :",
          googleAccessToken
        )
        console.log(
          "Google Refresh Token after jwt generate :",
          googleRefreshToken
        )
        console.log(
          "in the google/callback the token condition verifys now dashboard open"
        )
        console.warn(
          `${FRONTEND_URL}/google/callback?token=${token || ""}&access_token=${googleAccessToken || ""}&refresh_token=${googleRefreshToken || ""}`
        )
        // testing purpose for frontend callback
        res.redirect(
          `${FRONTEND_URL}/google/callback?token=${token || ""}&access_token=${googleAccessToken || ""}&refresh_token=${googleRefreshToken || ""}`
        )
      } else {
        console.log(
          "in the google/callback the token condition fails now login open"
        )
        res.redirect(`${FRONTEND_URL}/login?error=missing_tokens`)
      }
    } catch (error) {
      console.error("Error during Google callback:", error)
      res.status(500).json({
        error: "Internal server error",
        success: false,
        error: error.message,
      })
    }
  }
)

/* when microsoft button click it work
router.get("/microsoft", passport.authenticate("microsoft"))

router.get(
  "/microsoft/callback",
  passport.authenticate("microsoft", {
    failureRedirect: process.env.MICROSOFT_REDIRECT_URI,
    // || "https://filo-fax-frontend-wkdx.vercel.app"
    session: false, // If you're using JWT not sessions
  }),
  async (req, res) => {
    const token = generateToken(req.user) // or req.user.token if already generated
    const FRONTEND_URL =
      process.env.FRONTEND_URL ||
      "http://localhost:5173" ||
      "https://filo-fax-frontend-wkdx.vercel.app"
    res.redirect(`${FRONTEND_URL}/dashboard?token=${token}`)
  }
)
*/

export const authRouter = router
