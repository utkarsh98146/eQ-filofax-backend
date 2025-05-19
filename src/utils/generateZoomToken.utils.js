import base64 from "base-64"
import { zoomApiConfig } from "../config/zoomApi.config.js"
export const generateZoomToken = async () => {
  try {
    const { zoomClientId, zoomAccountId, zoomClientSecret } = zoomApiConfig()
    const encodedCredentials = base64.encode(`${zoomAccountId}`)
  } catch (error) {
    console.error("Error generating Zoom token:", error)
    throw new Error("Failed to generate Zoom token")
  }
}
