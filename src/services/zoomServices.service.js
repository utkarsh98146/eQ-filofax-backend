import { generateZoomToken } from "../utils/generateZoomToken.utils"

export const createZoomMeeting = async (data) => {
  try {
    const zoomToken = await generateZoomToken() // Generate the Zoom access_token

    const now = new Date() // Get the current date and time

    const startTime = new Date(now.getTime() + 5 * 60 * 1000) // Set the start time to 5 minutes from now

    const meetingData = {
      topic: data.title,
      type: 2, // Scheduled meeting
      start_time: startTime.toISOString(), // Set the start time in ISO format
      duration: data.duration || 30, // Duration in minutes
      timezone: data.timezone || "Asia/Kolkata", // Set the timezone
      agenda: data.agenda || "New agenda", // Meeting agenda
      password: data.password || "1234", // Meeting password`

      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
        waiting_room: true,
        audio: "both",
        contact_name: data.host_name || "Utkarsh",
        contact_email: data.host_email || "subhashyadav.equasar@gmail.com",
        alternative_hosts:
          data.alternative_hosts || "subhashyadav.eqausar@gmail.com",
        email_reminder: true,
        email_reminder_time: 2,
        allow_multiple_devices: true,
        email_notification: true,
        meeting_authentication: false,
        authentication_option: "none",
      },
    }
  } catch (error) {
    console.error("Error creating Zoom meeting:", error)
    throw new Error("Failed to create Zoom meeting")
  }
}
