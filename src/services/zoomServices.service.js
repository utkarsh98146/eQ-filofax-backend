import axios from "axios"
import { zoomApiConfig } from "../config/zoomApi.config.js"
import db from "../models/index.model.js"
import { generateZoomHeader } from "../utils/generateZoomToken.utils.js"

const { zoomAccountId } = zoomApiConfig()

const ZOOM_BASE_URL = "https://api.zoom.us/v2"

// console.log("The zoom base url is :", ZOOM_BASE_URL)

// create zoom meeting service
export const createZoomMeetingService = async (data) => {
  try {
    // Generate the authorization headers for the Zoom API
    const headers = await generateZoomHeader()

    console.log("The headers are :", headers)
    const now = new Date() // Get the current date and time

    // const startTime = new Date(now.getTime() + 5 * 60 * 1000) // Set the start time to 5 minutes from now

    const meetingData = {
      agenda: data.agenda || data.title || `Meeting with ${data.attendeeName}`, // Meeting agenda or topic
      type: 2, // Scheduled meeting
      start_time: new Date(data.startTime).toISOString(), // Set the start time in ISO format
      duration: data.duration || 30, // Duration in minutes
      timezone: data.timezone || "Asia/Kolkata", // Set the timezone

      password: data.password || "1234", // Meeting password

      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
        waiting_room: true,
        audio: "both",
        contact_name: data.hostName || "Utkarsh",
        contact_email: data.hostEmail || "subhashyadav.equasar@gmail.com",
        // alternative_hosts: data.alternative_hosts || "admin@test.com",
        email_reminder: true,
        email_reminder_time: 2,
        allow_multiple_devices: true,
        email_notification: true,
        meeting_authentication: false,
        authentication_option: "none",
      },
    }

    const response = await axios.post(
      // `${ZOOM_BASE_URL}/users/${zoomAccountId}/meetings`,
      `${ZOOM_BASE_URL}/users/${data.hostEmail}/meetings`,
      meetingData,
      {
        headers,
      }
    )
    // format end time based on start time and duration
    const startTime = new Date(data.startTime)
    const endTime = new Date(
      startTime.getTime() + meetingData.duration * 60 * 1000
    )

    // Return the created meeting data
    return {
      // zoomMeetingDeatails: response.data, // Zoom meeting details

      joinUrl: response.data.join_url, // Join URL for the meeting
      meetingId: response.data.id, // Meeting ID
    }
  } catch (error) {
    console.error("Zoom API Error:", error?.response?.data || error.message)
    throw new Error(
      `Zoom API Error: ${
        error?.response?.data?.message ||
        JSON.stringify(error?.response?.data) ||
        error.message
      }`
    )
  }
}

// get all zoom meetings
export const getAllZoomMeetingsService = async () => {
  try {
    const headers = await generateZoomHeader() // Generate the authorization headers for the Zoom API
    const response = await axios.get(
      `${ZOOM_BASE_URL}/users/${zoomAccountId}/meetings`,
      {
        headers: headers,
      }
    )
    return response.data.meetings // Return the response data
    // return await db.ZoomMeeting.findAll()
  } catch (error) {
    console.error("Error fetching all Zoom meetings service:", error)
    throw new Error("Failed to fetch all Zoom meetings")
  }
}

// get zoom meeting by id
export const getZoomMeetingById = async (meetingId) => {
  try {
    const headers = await generateZoomHeader() // Generate the authorization headers for the Zoom API
    const response = await axios.get(`${ZOOM_BASE_URL}/meetings/${meetingId}`, {
      headers: headers,
    })
    return response.data // Return the response data

    // return await db.ZoomMeeting.findOne({ where: { id: meetingId } })
  } catch (error) {
    console.error(
      "Error fetching Zoom meeting by ID in service:",
      error.message
    )
    throw new Error("Failed to fetch Zoom meeting by ID in service")
  }
}
// update zoom meetings
export const updateZoomMeetingService = async (meetingData, meetingId) => {
  try {
    const headers = await generateZoomHeader() // Generate the authorization headers for the Zoom API

    const response = await axios.patch(
      `${ZOOM_BASE_URL}/meetings/${meetingId}`,
      meetingData,
      {
        headers: headers,
      }
    )

    // Update the meeting in the database
    const updatedMeetingInDB = await db.ZoomMeeting.update(
      { ...meetingData },
      { where: { id: meetingId } }
    )

    return {
      zoomMeetingDeatails: response.data, // Zoom meeting details
      zoomMeetingDeatailsInDB: updatedMeetingInDB, // Updated meeting details in the database
    }
  } catch (error) {
    console.error("Error updating Zoom meeting in service : ", error.message)
    throw new Error("Failed to update Zoom meeting in service")
  }
}

// delete zoom meeting by meetingId
export const deleteZoomMeetingById = async (meetingId) => {
  try {
    const headers = await generateZoomHeader() // Generate the authorization headers for the Zoom API
    const response = await axios.delete(
      `${ZOOM_BASE_URL}/meetings/${meetingId}`,
      {
        headers: headers,
      }
    )
    return response.data // Return the response data
  } catch (error) {
    console.error(
      "Error deleting Zoom meeting by ID in service:",
      error.message
    )
    throw new Error("Failed to delete Zoom meeting by ID in service")
  }
}
