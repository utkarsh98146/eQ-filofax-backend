import db from "../models/index.model.js"
import { updateGoogleCalendarEvent } from "../utils/googleCalendar.utils.js"

// create a calendar event
export const createCalendarEvent = async (data, calendar) => {
  const event = {
    summary: data.title,
    description: `Meeting with ${data.attendeeName}` || data.description,
    start: {
      dateTime: data.startTime
        ? new Date(data.startTime).toISOString()
        : new Date().toISOString(),
      timeZone: data.hostTimeZone || "Asia/Kolkata",
    },
    end: {
      dateTime: data.endTime
        ? new Date(data.endTime).toISOString()
        : new Date().toISOString(),
      timeZone: data.hostTimeZone || "Asia/Kolkata",
    },

    // attendees: Array.isArray(data.attendees)
    //   ? data.attendeeEmail.map((email) => ({ email }))
    //   : [],

    attendees: [{ email: data.attendeeEmail, displayName: data.attendeeName }],

    conferenceData: {
      createRequest: {
        requestId: `${Date.now()}`,
        conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
  }
  let response
  try {
    response = await calendar.events.insert({
      calendarId: "primary",
      resource: event, // details for the event shown in calendar
      sendUpdates: "all", // send updates to all attendees
      conferenceDataVersion: 1,
    })
  } catch (error) {
    console.error("Error creating calendar event:", error)
    throw new Error("Failed to create calendar event")
  }
  console.log("response", response)
  // const savedEvent = await db.CalendarEvent.create({
  // const savedEvent = await db.Booking.create({
  //   ...data,
  //   eventId: response.data.id,
  // })

  const meetingLink =
    response?.data?.conferenceData?.entryPoints?.find(
      (entry) => entry.entryPointType === "video"
    )?.uri || null

  return {
    // savedEvent,
    joinUrl: meetingLink || response.data.hangoutLink,
    meetingId: response.data.id,
    summary: response?.data?.summary,
    eventStartTime: response?.data?.start?.dateTime,
    eventEndTime: response?.data?.end?.dateTime,
  }
}

// get all calendar events
export const getAllEventServices = async () => {
  // const event = await db.CalendarEvent.findAll({
  //   include: [
  //     {
  //       model: db.TimeSlot,
  //       as: "timeSlot",
  //       include: [
  //         {
  //           model: db.Availability,
  //           as: "availability",
  //           include: [
  //             {
  //               model: db.User,
  //               as: "user",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // })
  // return event
  // or
  return await db.CalendarEvent.findAll()
}

// update calendar event
export const updateEventService = async (eventId, data) => {
  const event = await db.CalendarEvent.findByPk(eventId)

  if (!event) {
    throw new Error("Event not found")
  }

  const updatedFields = {
    title: event.title ?? data.title,
    duration: event.duration ?? data.duration,
    description: event.description ?? data.description,
    startDate: event.startDate ?? data.startDate,
    endDate: event.endDate ?? data.endDate,
    duration: event.duration ?? data.duration,
    eventType: event.eventType ?? data.eventType,
    location: event.location ?? data.location,
    hostTimeZone: event.hostTimeZone ?? data.hostTimeZone,
    timeSlotId: event.timeSlotId ?? data.timeSlotId,
    organizerEmail: event.organizerEmail ?? data.organizerEmail,
    attendees: event.attendees ?? data.attendees,
    eventId: event.eventId ?? data.eventId,
  }

  const updatedEvent = await event.update(updatedFields)

  if (event.eventId) {
    await updateGoogleCalendarEvent({
      eventId: event.eventId,
      description: data.description,
      startTime: data.startDate,
      endTime: data.endDate,
      attendees: data.attendees,
    })
  }
  return updatedEvent
  /*
  await calendar.events.patch({
    calendarId: "primary",
    eventId: event.eventId,
    resource: {
      summary: data.title,
      description: data.description,
      start: {
        dateTime: data.startDate,
        timeZone: data.hostTimeZone || "Asia/Kolkata",
      },
      end: {
        dateTime: data.endDate,
        timeZone: data.hostTimeZone || "Asia/Kolkata",
      },
    },
  })
  await event.update(data)
  return event
  */
}

// delete event service
export const deleteEventService = async (id) => {
  const event = await db.CalendarEvent.findByPk(id)

  if (!event) {
    throw new Error("Event not found")
  }

  await calendar.events.delete({
    calendarId: "primary",
    eventId: event.id,
  })
  await event.destroy()
  return { message: "Event deleted..." }
}
