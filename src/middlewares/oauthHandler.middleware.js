// Save/merge user data after oAuth
import db from "../models/index.model.js"

export const handleOAuthUser = async (profile, provider) => {
  try {
    const email = profile.emails?.[0]?.value // first email from profile(userData)
    const name = profile.displayName // user name
    const profileImageLink = profile.photos?.[0]?.value // profile image url
    const accessToken = profile.accessToken // access token
    const refreshToken = profile.refreshToken // refresh token

    let user

    // check if user already exists based on provider Id
    if (provider === "google") {
      user = await db.User.findOne({
        where: { googleId: profile.id },
      })
    } else if (provider === "microsoft") {
      user = await db.User.findOne({
        where: { microsoftId: profile.id },
      })
    }

    if (user) {
      if (provider === "google" && !user.googleId) {
        user.googleId = profile.id
        ;(user.authType = "google"), (user.googleAccessToken = accessToken)
        user.googleRefreshToken = refreshToken
      }
      if (provider === "microsoft" && !user.microsoftId) {
        user.microsoftId = profile.id
        user.authType = "microsoft"
        user.microsoftAccessToken = accessToken
        user.microsoftRefreshToken = refreshToken
      }
      await user.save()
      return user
    }

    // if user not found, create a new user
    if (!user) {
      const userData = {
        name: name,
        email: email,
        profileImageLink: profileImageLink,
        isEmailVerified: true,
        lastLogin: new Date(),
        lastLoginMethod: provider,
      }

      if (provider === "google") {
        userData.googleId = profile.id
        userData.googleAccessToken = accessToken
        userData.googleRefreshToken = refreshToken
      } else if (provider === "microsoft") {
        userData.microsoftId = profile.id
        userData.microsoftAccessToken = accessToken
        userData.microsoftRefreshToken = refreshToken
      }
      user = await db.User.create(userData)
      return user
    }

    // update last login data
    user.lastLogin = new Date()
    user.lastLoginMethod = provider
    await user.save()
    console.log(
      "User data saved successfully with handleOAuthUser middleware logic and saved user data:",
      user
    )
    return user
  } catch (error) {
    console.error("Error handling OAuth user:", error)
    throw new Error("Failed to handle OAuth user")
  }

  /*
    const [user, created] = await db.User.findOrCreate({
      // if not found it create a new record
      where: { email },
      defaults: {
        name: name,
        profileImage: profileImage,
        authType: type,
        [`${type}Id`]: profile.id,
        isEmailVerified: true,
        lastLoginMethod: type,
        lastLogin: new Date(),
      },
    })
    if (!user[`${type}Id`]) {
      user[`${type}Id`] = profile.id
      user.authType = type
      user.lastLoginMethod = type
      user.lastLogin = new Date()
      await user.save()
    }
  return user
  */
}
