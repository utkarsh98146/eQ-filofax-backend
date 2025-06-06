import db from "../models/index.model.js"

export const getHostTokensFromDB = async (email, location) => {
  const user = await db.User.findOne({ where: { email } })
  if (!user) {
    throw new Error("User does not found in databse")
  }
  console.log("Email for that person :", email)
  console.log("Detailos for that person :", user)
  if (location === "google-meet") {
    if (!user.googleAccessToken || !user.googleRefreshToken) {
      throw new Error("Google token not found for this user in database")
    }
    return {
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken,
    }
  } else if (location === "zoom") {
    if (!user.zoom_access_token) {
      throw new Error("Zoom token not found for this user in database")
    }
    return {
      zoom_access_token: user.zoom_access_token,
    }
  }
  return {
    // for local login jwt Token
    token: user.token,

    // for google
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,

    // for micorsoft
    microsoft_access_token: user.microsoftAccessToken,
    microsoft_refresh_token: user.microsoftRefreshToken,

    //for zoom
    zoom_access_token: user.zoom_access_token,
  }
}
