import base64 from "base-64" // base64 encoding library used for encoding credentials
import { zoomApiConfig } from "../config/zoomApi.config.js"
import axios from "axios"
import qs from "qs" // querystring library use for parsing nested query strings objects

const { zoomClientId, zoomAccountId, zoomClientSecret } = zoomApiConfig()

let zoomAccessToken = null
let zoomTokenExpiration = null

const getAuthHeader = () => {
  const encodedCredentials = base64.encode(
    // Encode the client ID and secret using base64
    `${zoomClientId}:${zoomClientSecret}` // The credentials are in the format of "clientId:clientSecret"
  )
  return {
    Authorization: `Basic ${encodedCredentials}`, // Set the authorization header with the encoded credentials
    "Content-Type": "application/x-www-form-urlencoded",
  }
}

export const generateZoomToken = async () => {
  const now = Date.now() // Get the current time in milliseconds
  try {
    // Check if the token is already cached and not expired
    if (zoomAccessToken && zoomTokenExpiration && now < zoomTokenExpiration) {
      return zoomAccessToken
    }
    const headers = getAuthHeader() // Get the authorization header

    const reponse = await axios.post(
      // Send a POST request to Zoom API. The URL to request the access token

      `https://zoom.us/oauth/token`,
      qs.stringify({
        grant_type: "account_credentials",
        account_id: zoomAccountId,
      }),
      {
        headers,
      }
    )
    zoomAccessToken = reponse.data.access_token // Store the access token
    zoomTokenExpiration = now + reponse.data.expires_in * 1000 // Convert seconds to milliseconds
    return zoomAccessToken // Return the access token
  } catch (error) {
    console.error("Error generating Zoom token:", error)
    throw new Error("Failed to generate Zoom token")
  }
}

export const generateZoomHeader = async () => {
  const zoomAccessToken = await generateZoomToken()
  return {
    Authorization: `Bearer ${zoomAccessToken}`, // Set the authorization header with the access token
    "Content-Type": "application/json",
  }
}
