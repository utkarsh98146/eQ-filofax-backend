// Passport strategy logic
import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { Strategy as MicrosoftStrategy } from "passport-microsoft"
import { handleOAuthUser } from "../utils/oauthHandler.utils.js"
import db from "../models/index.model.js"
import dotenv from "dotenv"

dotenv.config()

//*-*-*-*- Serialize(saving the user data inside the session) and deserialize user(retriving the data from session) *-*-*-*

passport.serializeUser((user, done) => {
  done(null, user) // it will save the user information in the session
})

passport.deserializeUser((user, done) => {
  done(null, user) // it will retrieve the user information from the session
})

//*-*-*-*- Configure google OAuth credential *-*-*-*
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      passReqToCallback: true, // This is used to pass the request object to the callback function

      scope: ["profile", "email", "https://www.googleapis.com/auth/calendar"], // The scope of the access request. This determines what information you can access from the user's account.

      accessType: "offline", // This is used to request a refresh token. If you don't need offline access, you can remove this line.
    },
    async (req, accessToken, refreshToken, profile, done) => {
      // This function is called when the user is authenticated
      try {
        // The profile object contains the user information returned by Google
        console.log("User Profile: ", profile)

        // let user =await db.User.findOne({where:{googleId:profile.id}})
        console.log("✅ Access Token:", accessToken)
        console.log("🔁 Refresh Token:", refreshToken)
        console.log("🙋 User Profile:", profile)

        profile.accessToken = accessToken // save the access token in the profile object
        profile.refreshToken = refreshToken // save the refresh token in the profile object

        // call middleware to save the login type and data
        const user = await handleOAuthUser(profile, "google")

        // Here you can save the user information to your database

        console.log("Passport logic working fine and user details :", user)

        return done(null, user) //  user is the user information returned by Google,we can use it to create a new user in our database
      } catch (error) {
        console.error("Error in Google OAuth: ", error.message)
        return done(error, null)
      }
    }
  )
)

//*-*-*-*- Configure Microsoft OAuth credential *-*-*-*

passport.use(
  new MicrosoftStrategy(
    {
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: process.env.MICROSOFT_REDIRECT_URI,
      scope: [
        "user.read",
        "offline_access",
        "https://graph.microsoft.com/Calendars.ReadWrite",
      ], // The scope of the access request. This determines what information you can access from the user's account.

      // Microsoft specific options

      // [Optional] The tenant ID for the application. Defaults to 'common'.
      // Used to construct the authorizationURL and tokenURL
      tenant: process.env.TENANT_ID || "common",

      // [Optional] The authorization URL. Defaults to `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`
      authorizationURL:
        "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",

      // [Optional] The token URL. Defaults to `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`
      tokenURL: "https://login.microsoftonline.com/common/oauth2/v2.0/token",

      // [Optional] The Microsoft Graph API version (e.g., 'v1.0', 'beta'). Defaults to 'v1.0'.
      graphApiVersion: "v1.0",

      // [Optional] If true, will push the User Principal Name into the `emails` array in the Passport.js profile. Defaults to false.
      addUPNAsEmail: false,

      // [Optional] The Microsoft Graph API Entry Point, defaults to https://graph.microsoft.com. Configure this if you are using Azure China or other regional version.
      apiEntryPoint: "https://graph.microsoft.com",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        profile.accessToken = accessToken // save the access token in the profile object

        profile.refreshToken = refreshToken // save the refresh token in the profile object

        const user = await handleOAuthUser(profile, "microsoft")

        return done(null, user)
      } catch (error) {
        return done(error)
      }
    }
  )
)
