import { Op } from "sequelize"
import { getAllZoomMeetingsController } from "../controllers/zoomMeetingControllers.controller.js"
import db from "../models/index.model.js"
import { getAllEventServices } from "./calendarServices.service.js"
import { getCombinedDateTime } from "../utils/timeUtility.utils.js"

export const getAllUpcomingEvents = async (userId) => {
  try {
    const googleEvents = await getAllEventServices()
    const zoomEvents = await getAllZoomMeetingsController()

    // filter the google events to only include those that are upcoming
    const formattedGoogleEvents = googleEvents.map((event) => ({
      ...event,
      source: "google",
    }))

    const formatedZoomEvents = zoomEvents.map((meeting) => ({
      ...meeting,
      source: "zoom",
    }))

    // Merge the two arrays for all upcoming events
    const allEventsForUser = [...formattedGoogleEvents, ...formatedZoomEvents]

    // filter out completed events
    const upcomingEvents = allEventsForUser.filter((event) => {
      const eventTime = new Date(event.startTime || event.start_time).getTime()
      return eventTime > Date.now()
    })
    // sort the events by start time
    const sortedEvents = upcomingEvents.sort((a, b) => {
      const timeA = new Date(a.startTime || a.start_time).getTime()
      const timeB = new Date(b.startTime || b.start_time).getTime()
      return timeA - timeB
    })
    return sortedEvents
  } catch (error) {
    console.error("Error fetching merged events:", error)
    throw new Error("Failed to fetch merged events")
  }
}
