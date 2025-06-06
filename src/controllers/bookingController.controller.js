import { calendar } from "googleapis/build/src/apis/calendar/index.js"
import db from "../models/index.model.js"
import { createCalendarEvent } from "../services/calendarServices.service.js"
import { sendConfirmationEmail } from "../services/emailServices.service.js"
import { checkUserThroughToken } from "../services/jwt_tokenServices.service.js"
import { createZoomMeetingService } from "../services/zoomServices.service.js"
import { getCalendarClient } from "../utils/googleCalendar.utils.js"
import { convertSlotTo24H } from "../utils/timeUtility.utils.js"
import { getHostTokensFromDB } from "../utils/tokenStore.utils.js"

// get available slots of an event for admin
export const getAvailableSlotsForEvent = async (req, res) => {
  try {
    const { userId } = await checkUserThroughToken() // Check if the user is authenticated
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized error in bookingController",
      })
    }
    const slots = await db.TimeSlot.findAll({
      where: {
        status: "available",
      },
      include: [
        {
          model: db.Availability,
          as: "availability",
          where: {
            userId: userId, // Ensure the availability is for the same user
          },
        },
      ],
    })
    console.log("Available slots for event:", slots)
    res.status(200).json({
      success: true,
      message: "Available slots fetched successfully in bookingController",
      data: slots,
    })
  } catch (error) {
    console.error("Error fetching available slots for event:", error)
    return res.status(500).json({
      message: "Error fetching available slots for event in bookingController",
      error: error.message,
    })
  }
}

//reserve a slot for an event
export const reserveSlotForEvent = async (req, res) => {
  try {
    const { userId } = await checkUserThroughToken() // Check if the user is authenticated
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized error in bookingController",
      })
    }
    const { slotId } = req.body // Get the slot ID from the request body
    if (!slotId) {
      return res.status(400).json({
        success: false,
        message: "Slot ID is required in bookingController",
      })
    }

    // Find the slot by ID and update its status to 'reserved'
    const slot = await db.TimeSlot.findOne({
      where: {
        id: slotId,
        status: "available", // Ensure the slot is currently available
      },
    })

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found or already reserved in bookingController",
      })
    }

    // Update the slot status to 'reserved'
    slot.status = "reserved"
    slot.reservedUntill = new Date(Date.now() + 30 * 60 * 1000) // Reserve for 30 minutes
    await slot.save()

    console.log("Slot reserved successfully:", slot)
    res.status(200).json({
      success: true,
      message: "Slot reserved successfully in bookingController",
      data: slot,
    })
  } catch (error) {
    console.error("Error reserving slot for event:", error)
    return res.status(500).json({
      message: "Error reserving slot for event in bookingController",
      error: error.message,
    })
  }
}

// Book a reserved slot for an event
export const confirmBookingForEvent = async (req, res) => {
  try {
    const { userId } = await checkUserThroughToken() // Check if the user is authenticated
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized error in bookingController",
      })
    }
    const { slotId, name, email, description } = req.body // Get the slot ID and other booking details from the request body
    const slot = await db.TimeSlot.findbyPk(slotId, {
      include: [{ model: db.Availability, as: "availability" }],
    })
    if (!slotId || !name || !email) {
      return res.status(400).json({
        success: false,
        message: "Slot ID, name, and email are required in bookingController",
      })
    }
    if (
      !slot ||
      slot.status !== "reserved" ||
      slot.reservedUntill < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Slot is not reserved or does not exist in bookingController",
      })
    }
    const platform = slot.availability.location
    let meeting
    if (platform === "zoom") {
      meeting = await createZoomMeetingService({
        startTime: slot.startTime,
        endTime: slot.endTime,
        duration: slot.duration || 30, // Default duration to 30 minutes if not provided
        hostId: slot.availability.userId,
        hostName: slot.availability.user.name,
        hostEmail: slot.availability.user.email,
        attendees: [{ email }],
        eventType: "1-1 type meeting",
        agenda: description || "No agenda provided",
      })
    }
    if (platform === "google-meet") {
      meeting = await createCalendarEvent({
        summary: "Event Booking Confirmation",
        description: description || "No agenda provided",
        startTime: slot.startTime,
        endTime: slot.endTime,
        attendees: [{ email }],
      })
    }

    const event = await db.CalendarEvent.create({
      title: `Booking Confirmation for ${name}`,
      description: description || "No description provided",
      startTime: slot.startTime,
      endTime: slot.endTime,
      duration: slot.duration || 30, // Default duration to 30 minutes if not provided
      eventType: slot.eventType || "1-1 type meeting",
      userId: slot.availability.userId, // Store the user ID of the host
      location: platform === "zoom" ? platform : "google-meet",
      userId: userId,
      timeSlotId: slot.id,
      joinUrl: meeting.joinUrl,
      eventId: meeting ? meeting.id : null, // Store the meeting ID if available
    })
    slot.status = "booked" // Update the slot status to 'booked'
    slot.reservedUntill = null
    slot.bookedBy = userId // Store the ID of the user who booked the slot
    await slot.save()
    console.log("Booking confirmed successfully:", event)

    // Send confirmation email to the user and admin
    const admin = await db.User.findByPk(slot.availability.userId)

    await sendConfirmationEmail({
      to: email,
      subject: "Your meeting is scheduled",
      event,
    })

    await sendConfirmationEmail({
      to: admin.email,
      subject: "A meeting was booked ",
      event,
    })

    res.status(201).json({
      message: "Meeting scheduled successfully..",
      event,
    })
  } catch (error) {
    console.error("Error confirming booking for event:", error)
    return res.status(500).json({
      message: "Error confirming booking for event in bookingController",
      error: error.message,
    })
  }
}

/*--------------------- Optional feature ----------*/

// Release a slot (if user cancel the meeting)
export const releaseSlot = async (req, res) => {
  try {
    const { slotId } = req.body

    const slotDetails = await db.TimeSlot.findByPk(slotId)

    if (slotDetails && slotDetails.status === "reserved") {
      slotDetails.status = "available"
      slotDetails.reservedUntill = null
      await slotDetails.save()
    }
    res.status(200).json({ message: "Slot released", success: true })
  } catch (error) {
    console.log("Error in releasing the time slot from booking controller")
    res.status(500).json({
      success: false,
      message: "Error while releasing the book timeSlot",
      error: error.message,
    })
  }
}

// Auto release expired reservations
export const releaseExpiredReservations = async (req, res) => {
  await db.TimeSlot.update(
    { status: "available", reservedUntill: null },
    { where: { status: "reserved", reservedUntill: { [Op.lt]: new Date() } } }
  )
}

export const bookEvent = async (req, res) => {
  console.log("book event api call")
  try {
    const {
      userId,
      eventId,
      title,
      date,
      slot,
      duration,
      attendeeName,
      attendeeEmail,
      hostName,
      hostEmail,
      location,
      attendee_notes,
      hostTimeZone = "Asia/Kolkata",
    } = req.body

    let meetingLink = location
    let meetingId = null
    console.log(
      `Email  ${hostEmail}, and location in bokking page from host :${location}`
    )

    // Fetch tokens from DB (assume you store them)
    const { access_token, refresh_token, zoom_access_token } =
      await getHostTokensFromDB(hostEmail, location)

    const startTime = new Date(`${date}T${convertSlotTo24H(slot)}:00`)
    const endTime = new Date(startTime.getTime() + duration * 60000)

    // 👉 Google Meet integration
    if (location === "google-meet") {
      // const auth = new google.auth.OAuth2(
      //   process.env.GOOGLE_CLIENT_ID,
      //   process.env.GOOGLE_CLIENT_SECRET
      // )
      // auth.setCredentials({ access_token, refresh_token })

      // const calendar = google.calendar({ version: "v3", auth })

      const calendar = await getCalendarClient(access_token, refresh_token)

      // const event = await calendar.events.insert({
      //   calendarId: "primary",
      //   conferenceDataVersion: 1,
      //   sendUpdates: "all",
      //   requestBody: {
      //     summary: title,
      //     description: `Meeting with ${attendeeName}`,
      //     start: {
      //       dateTime: startTime.toISOString(),
      //       timeZone: "Asia/Kolkata",
      //     },
      //     end: { dateTime: endTime.toISOString(), timeZone: "Asia/Kolkata" },
      //     attendees: [{ email: attendeeEmail }],
      //     conferenceData: {
      //       createRequest: {
      //         requestId: uuidv4(),
      //         conferenceSolutionKey: { type: "hangoutsMeet" },
      //       },
      //     },
      //   },
      // })

      const event = await createCalendarEvent(req.body, calendar)
      meetingId = event.meetingId
      meetingLink = event.joinUrl
    }

    // 👉 Zoom integration
    else if (location === "zoom") {
      // const meeting = await Zoom.createMeeting({
      //   topic: title,
      //   startTime,
      //   duration,
      // })

      // const meeting = await createZoomMeetingService(req.body)
      const dataToPass = {
        ...req.body,
        startTime,
        endTime,
        zoom_access_token,
      }
      const meeting = await createZoomMeetingService(dataToPass)

      meetingLink = meeting.joinUrl
      meetingId = meeting.meetingId
    }

    // Save to DB
    const newEventBooked = await db.Booking.create({
      eventId: eventId,
      hostId: userId,
      meetingId,
      title,
      bookingDate: date,
      startTime,
      endTime,
      attendeeName,
      attendeeEmail,
      startTime,
      endTime,
      meetingLink,
      location,
      hostEmail,
      attendee_notes,
    })
    // mail send to the user (attendee)
    await sendConfirmationEmail(
      attendeeEmail,
      "Meeting Confirmation - " + title,
      { title, joinUrl: meetingLink }
    )

    // mail send to host (admin)
    await sendConfirmationEmail(
      hostEmail,
      "New Meeting Booked with - " + attendeeName,
      { title, joinUrl: meetingLink }
    )
    console.log("Meeting successfully booked..")
    res.status(200).json({
      message: "Event booked successfully..",
      success: true,
      meetingId,
      meetingLink,
      booking: newEventBooked,
    })
  } catch (err) {
    console.error("Booking error:", err.message)
    return res
      .status(500)
      .json({ message: "Booking failed", error: err.message })
  }
}
