// import { oauth2Client, scopes } from "../config/googleApi.config.js"
import { getCalendarClient, scopes } from "../utils/googleCalendar.utils.js"

import {
  createCalendarEvent,
  deleteEventService,
  getAllEventServices,
  updateEventService,
} from "../services/calendarServices.service.js"

// generate url and token for callback  url
export const generateAuthUrl = async (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent", // get refresh token on first time login
  })
  res.send({ url })
}

//create event controller
export const createEventController = async (req, res) => {
  try {
    const { access_token, refresh_token } = req.body

    const calendar = getCalendarClient(access_token, refresh_token)

    const event = await createCalendarEvent(req.body, calendar)
    res.status(201).json({
      success: true,
      message: "Event created successfully..",
      event,
    })
  } catch (error) {
    console.error(error)
    console.log("Error in the create event controller ", error.message)
    res.status(500).json({
      success: false,
      message: "Error in the create event controller",
      error,
      error: error.message,
    })
  }
}

/*export const createEventController = async (data) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      hostTimeZone,
      timeSlotId,
      organizerEmail,
      attendees,
    } = req.body
  } catch (error) {
    console.log("Error in the create event service ", error.message)
    throw new Error("Error in the create event service")
  }
}
*/

// fetching all the event controller
export const getAllEventController = async (req, res) => {
  try {
    const events = await getAllEventServices()
    res.status(200).json({
      success: true,
      message: "All events data are fetched successfully..",
      data: events,
    })
  } catch (error) {
    console.log("Error in the get All events in controller")
    res.status(500).json({
      success: false,
      message: "Error in getting all event from controller",
      error: error.message,
    })
  }
}

// updating the event controller
export const updateEventController = async (req, res) => {
  try {
    const updatedEvent = await updateEventService(req.params.id, req.body)
    res.status(200).json({
      message: "Event updated successfully..",
      updatedEvent,
      success: true,
    })
  } catch (error) {
    console.log("Error in the update event controller ")
    res.status(500).json({
      success: false,
      message: "Error in updating the event controller",
      error: error.message,
    })
  }
}

// delete the event controller
export const deleteEventController = async (req, res) => {
  try {
    const event = await deleteEventService(req.params.id)
    res.status(200).json({
      message: "Event deleted successfully..",
      event,
      success: true,
    })
  } catch (error) {
    console.log("Error in deleting the event in controller ")
    res.status(500).json({
      success: false,
      message: "Error in deleting the event in controller",
      error: error.message,
    })
  }
}
