import express from "express"
import passport from "passport"
import { login, sendToken, signup } from "../controllers/auth.controller.js"
import dotenv from "dotenv"
import "../config/passport.config.js" // passport configuration
import { generateToken } from "../services/tokenServices.service.js"
import db from "../models/index.model.js"
import { where } from "sequelize"

const router = express.Router()
dotenv.config()

/* when google button click it work*/

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
  })
)

// router.get('/google', (req, res) => {
//     const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&scope=profile`;
//     // const source = req.query.source || 'web'; // Default to 'web' if no source is provided
//     // const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile%20openid&prompt=select_account&state=${source}`;

//     res.status(200).json({ redirectUrl: googleAuthUrl });
// });

// router.get('/google/callback', passport.authenticate("google", { session: false }), sendToken)

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect:
      process.env.GOOGLE_REDIRECT_URI ||
      "https://filo-fax-frontend-wkdx.vercel.app",
    session: false, // If you're using JWT not sessions
  }),
  async (req, res) => {
    const { accessToken, refreshToken } = req.user

    // Save this into DB
    await db.User.update(
      { accessToken, refreshToken },
      { where: { id: req.user.id } }
    )

    const token = generateToken(req.user) // or req.user.token if already generated
    const FRONTEND_URL = "https://filo-fax-frontend-wkdx.vercel.app"
    res.redirect(`${FRONTEND_URL}/dashboard?token=${token}`)
  }
)

router.get("/microsoft", passport.authenticate("microsoft"))

router.get(
  "/microsoft/callback",
  passport.authenticate("microsoft", {
    failureRedirect:
      process.env.MICROSOFT_REDIRECT_URI ||
      "https://filo-fax-frontend-wkdx.vercel.app",
    session: false, // If you're using JWT not sessions
  }),
  async (req, res) => {
    const token = generateToken(req.user) // or req.user.token if already generated
    const FRONTEND_URL = "https://filo-fax-frontend-wkdx.vercel.app"
    res.redirect(`${FRONTEND_URL}/dashboard?token=${token}`)
  }
)

/*
router.get("/microsoft", passport.authenticate("azuread-openidconnect"));

// Step 2: Handle the Microsoft callback
router.get(
    "/microsoft/callback",
    passport.authenticate("azuread-openidconnect", {
        failureRedirect: "/login",
    }),
    (req, res) => {
        // ✅ Success
        // Send token, profile, or redirect to frontend dashboard
        res.redirect("https://filo-fax-frontend-wkdx.vercel.app");
        // Or: res.json(req.user);
    }
);
*/

router.post("/local-signUp", signup)
router.post("/local-login", login)

export const authRouter = router
