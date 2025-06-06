import base64 from "base-64" // base64 encoding library used for encoding credentials
import { zoomApiConfig } from "../config/zoomApi.config.js"
import axios from "axios"
import qs from "qs" // querystring library use for parsing nested query strings objects

const { zoomClientId, zoomAccountId, zoomClientSecret } = zoomApiConfig()

let zoom_access_token = null
let zoomTokenExpiration = null

// Function to get the authorization header for Zoom API requests
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

// Function to generate a Zoom access token
export const generateZoomToken = async () => {
  const now = Date.now() // Get the current time in milliseconds
  try {
    // Check if the token is already cached and not expired
    if (zoom_access_token && zoomTokenExpiration && now < zoomTokenExpiration) {
      return { zoom_access_token }
    }
    const headers = getAuthHeader() // Get the authorization header

    // Send a POST request to Zoom API. The URL to request the access token
    const response = await axios.post(
      `https://zoom.us/oauth/token`,
      qs.stringify({
        grant_type: "account_credentials",
        account_id: zoomAccountId,
      }),
      {
        headers,
      }
    )
    zoom_access_token = response.data.access_token // Store the access token
    // zoomTokenExpiration = now + response.data.expires_in * 1000 // Convert seconds to milliseconds
    return { zoom_access_token } // Return the access token
  } catch (error) {
    console.error("Error generating Zoom token:", error)
    throw new Error("Failed to generate Zoom token")
  }
}

// Function to generate the Zoom authorization header
export const generateZoomHeader = async () => {
  const { zoom_access_token } = await generateZoomToken()
  console.log("The zoom access token from zoomToken utils :", zoom_access_token)
  return {
    Authorization: `Bearer ${zoom_access_token}`, // Set the authorization header with the access token
    "Content-Type": "application/json",
  }
}
