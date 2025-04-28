// Passport strategy logic 
import passport from "passport"
import { Strategy } from "passport-google-oauth20"
import session from "express-session"

//*-*-*-*- Initialize Passport to authenticate users *-*-*-*

app.use(passport.initialize()) // initialize the passoword lib

// it will use the session to store the user information and integrate with passport-session,as the user information is stored in the session as they logged in
app.use(passport.session())


//*-*-*-*- Configure google OAuth credential *-*-*-*
passport.use(new Strategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => { // This function is called when the user is authenticated
        // The profile object contains the user information returned by Google
        console.log("User Profile: ", profile);

        // Here you can save the user information to your database
        return done(null, profile); //  profile is the user information returned by Google,we can use it to create a new user in our database
    }
))


//*-*-*-*- Serialize(saving the user data inside the session) and deserialize user(retriving the data from session) *-*-*-*

passport.serializeUser((user, done) => {
    done(null, user) // it will save the user information in the session
})

passport.deserializeUser((user, done) => {
    done(null, done)// it will retrieve the user information from the session
})