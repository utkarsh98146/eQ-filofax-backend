import db from "../models/index.model.js"
import { createCalendarEvent } from "../services/calendarServices.service.js"
import { checkUserThroughToken } from "../services/jwt_tokenServices.service.js"
import { createZoomMeetingService } from "../services/zoomServices.service.js"

// get available slots of an event for admin
export const getAvailableSlotsForEvent = async (req, res) => {
  try {
    const { userId } = checkUserThroughToken() // Check if the user is authenticated
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
    const { userId } = checkUserThroughToken() // Check if the user is authenticated
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
    const { userId } = checkUserThroughToken() // Check if the user is authenticated
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
      eventId: meeting ? meeting.id : null, // Store the meeting ID if available
    })
      slot.status = "booked" // Update the slot status to 'booked'

      slot.bookedBy = userId // Store the ID of the user who booked the slot
      await slot.save()
      console.log("Booking confirmed successfully:", event)
      

      // Send confirmation email to the user and admin
      const admin = await db.User.findByPk(slot.availability.userId)
      
      await 
  } catch (error) {
    console.error("Error confirming booking for event:", error)
    return res.status(500).json({
      message: "Error confirming booking for event in bookingController",
      error: error.message,
    })
  }
}
