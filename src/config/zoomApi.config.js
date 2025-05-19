import dotenv from "dotenv"
dotenv.config()

export const zoomApiConfig = () => {
  const zoomAccountId = process.env.ZOOM_ACCOUNT_ID
  const zoomClientId = process.env.ZOOM_CLIENT_ID
  const zoomClientSecret = process.env.ZOOM_CLIENT_SECRET
  // redirectUri: process.env.ZOOM_REDIRECT_URI,
  // scope: "user:read meeting:write meeting:read",
  console.log("zoomAccountId", zoomAccountId)
  console.log("zoomClientId", zoomClientId)
  console.log("zoomClientSecret", zoomClientSecret)

  return { zoomAccountId, zoomClientId, zoomClientSecret }
}
