import express from "express"
import passport from "passport"
import { login, sendToken, signup } from "../controllers/auth.controller.js"
import dotenv from "dotenv"
import "../config/passport.config.js" // passport configuration
import { generateToken } from "../services/tokenServices.service.js"
import db from "../models/index.model.js"
import { where } from "sequelize"
import { getOAuth2Client, scopes } from "../utils/googleCalendar.utils.js"

const router = express.Router()
dotenv.config()

/* Local Signup/Login routes */
router.post("/local-signUp", signup)
router.post("/local-login", login)

/* when google button click it work*/

/*router.get("/google", (req, res) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&scope=profile`
  // const source = req.query.source || 'web'; // Default to 'web' if no source is provided
  // const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile%20openid&prompt=select_account&state=${source}`;

  res.status(200).json({ redirectUrl: googleAuthUrl })
})

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  sendToken
)
*/

router.get(
  "/google",
  passport.authenticate("google", {
    scope: scopes,
    accessType: "offline",
    prompt: "consent",
  })
  /*
    (req, res) => {
      // The request will be redirected to Google for authentication
      // If authentication is successful, the user will be redirected to the callback URL

      console.log(
        "Google authentication initiated and now redirecting to callback url"
      )
      res.status(200).json({ message: "Redirecting to Google..." })
    }*/
)

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.GOOGLE_REDIRECT_URI,
    session: false, // If you're using JWT not sessions
  }),
  async (req, res) => {
    try {
      const { googleAccessToken, googleRefreshToken } = req.user

      console.log("Access Token:", googleAccessToken)
      console.log("Refresh Token:", googleRefreshToken)
      console.log("The details from the req.user : ", req.user)
      // Save this into DB
      await db.User.update(
        { googleAccessToken, googleRefreshToken },
        { where: { id: req.user.id } }
      )

      // const token = generateToken(req.user) // or req.user.token if already generated
      const FRONTEND_URL =
        process.env.FRONTEND_URL ||
        "http://localhost:5173" ||
        "https://filo-fax-frontend-wkdx.vercel.app"
      // res.redirect(
      //   `${FRONTEND_URL}/dashboard?access_token=${googleAccessToken}&refresh_token=${googleRefreshToken}`
      // )
      const token = generateToken(req.user)

      if (token || googleAccessToken || googleRefreshToken) {
        console.log("Token when enter in if block for redirect : ", token)

        console.log("Access Token:", googleAccessToken)
        console.log("Refresh Token:", googleRefreshToken)
        console.log(
          "in the google/callback the token condition verifys now dashboard open"
        )
        res.redirect(
          `${FRONTEND_URL}/dashboard?token=${token || ""}&access_token=${googleAccessToken || ""}&refresh_token=${googleRefreshToken || ""}`
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

export const authRouter = router
