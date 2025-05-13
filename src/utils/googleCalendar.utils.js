// import { google } from "@googleapis/calendar"
import { google } from "googleapis"
import dotenv from "dotenv"
dotenv.config()

const scopes = [
  "profile",
  "email",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.events.readonly",
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.settings.readonly",
]

export const getOAuth2Client = (acess_token, refresh_token) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )
  oauth2Client.setCredentials({
    // this is the part that sets the credentials for the OAuth2 client and must be after redirect url called

    access_token: acess_token, // this is the part that sets the access token for the OAuth2 client
    refresh_token: refresh_token, // this is the part that sets the refresh token for the OAuth2 client
  })
  return oauth2Client
}

export const getCalendarClient = (access_token, refresh_token) => {
  const auth = getOAuth2Client(access_token, refresh_token)
  return google.calendar({
    version: "v3",
    auth,
  })
  // const calendar = google.calendar({
  //   version: "v3",
  //   auth
  // })
}

export const updateGoogleCalendarEvent = async ({
  eventId,
  description,
  startTime,
  endTime,
  attendees,
}) => {
  const { data: event } = await calendar.events.get({
    calendarId: "primary",
    eventId,
  })
  const updatedEvent = {
    ...event,
    description,
    start: {
      dateTime: startTime || event.start.dateTime,
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: endTime || event.end.dateTime,
      timeZone: "Asia/Kolkata",
    },
    attendees: (attendees ?? []).map((email) => ({ email })),
  }
  await calendar.events.update({
    calendarId: "primary",
    eventId,
    resource: updatedEvent,
    sendUpdates: "all",
  })
}

export { scopes }
