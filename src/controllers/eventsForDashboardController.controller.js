import { where } from "sequelize"
import { sequelize } from "../config/database.config.js"
import db from "../models/index.model.js"
import { checkUserThroughToken } from "../services/jwt_tokenServices.service.js"

// import { getAllUpcomingEvents } from "../services/mergeEventService.service.js"
// merge all google and zoom event by time
// export const getEventsForDashboard = async (req, res) => {
//   try {
//     // Check if the user is authenticated
//     const { userId } = await checkUserThroughToken()
//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       })
//     }
//     const events = await getAllUpcomingEvents(userId)
//     if (!events || events.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No upcoming events found",
//       })
//     }
//     res.status(200).json({
//       success: true,
//       message: "Upcoming events retrieved successfully",
//       data: events,
//       count: events.length,
//     })
//   } catch (error) {
//     console.error("Error in getUpcomingEvents controller:", error)
//     return res.status(500).json({
//       success: false,
//       message: "Failed to retrieve upcoming events",
//       error: error.message,
//     })
//   }
// }
import dotenv from "dotenv"
dotenv.config()

// create event for dashboard
export const createEventTypeOnDashboard = async (req, res) => {
  console.log("Create event for dashboard api called...")

  const transaction = await sequelize.transaction()
  try {
    console.log("Create event api called..")

    const { userId } = await checkUserThroughToken(req)

    console.log("here value :", userId)
    console.log("User id in the created event", userId)
    const {
      eventType,
      title,
      duration,
      location,
      availability_time,
      timeSlots, // Array of time slots
      hostName,
      hostEmail,
    } = req.body

    /*
    //generate the unique slug for link
    const baseSlug = slugify(eventType)
    let slug = baseSlug

    let counter = 1

    while (
      await db.EventType.findOne({
        where: { userId, slug },
      })
    ) {
      slug = `${baseSlug}-${counter}`
      counter++
    }
    
      */

    const eventTypeCreated = await db.EventType.create(
      {
        userId,
        title,
        eventType,
        duration,
        location,
        availability_time,
        hostName,
        hostEmail,
      },
      { transaction }
    )
    // Not needed till now

    // Create time slots
    if (timeSlots && timeSlots.length > 0) {
      const timeSlotData = timeSlots.map((slot) => ({
        eventTypeId: eventType.id,
        daysOfWeek: slot.daysOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
      }))

      await db.TimeSlot.bulkCreate(timeSlotData, { transaction })
    }

    await transaction.commit()

    // console.log("userName : ", req.user.name)

    // slug username
    // const userSlug = slugify(req.user?.name || "name")

    // generate booking URL
    const eventId = eventTypeCreated.id
    console.log("Event id that event created :", eventId)
    const bookingUrl = `${process.env.BASE_URL}/${eventId}`
    console.log("BookingUrl generated while create :", bookingUrl)

    console.log("Data creatred for the dashboard event :", eventTypeCreated)

    res.status(201).json({
      success: true,
      event: eventTypeCreated,
      bookingUrl: bookingUrl,
    })
  } catch (error) {
    console.log("Error while creating event for dashboard", error)
    await transaction.rollback()
    res.status(500).json({
      message: "SOmething went wrong while creating event or dashboard",
      success: false,
      error: error.message,
    })
  }
}

//update Event Type for dashboard
export const updateEventTypeOnDashboard = async (req, res) => {
  console.log("Update event on dashboard api called..")

  const transaction = await sequelize.transaction()

  try {
    const { userId } = await checkUserThroughToken(req) // token check and ectract
    const { id } = req.params // extract the event id from params
    const {
      eventType,
      title,
      duration,
      location,
      availability_time,
      timeSlots, // Array of time slots
      hostName,
      hostEmail,
      isActive,
    } = req.body

    const event = await db.EventType.findOne({
      where: { id, userId },
    })

    if (!event) {
      return res
        .status(404)
        .json({ message: "Event not found with this event id : ", id })
    }
    /*
    // if name change then slug will change
   
    let slug = event.bookingUrl
    if (eventType && eventType !== event.eventType) {
      const baseSlug = slugify(eventType)
    }
    slug = baseSlug
    let counter = 1
    while (
      await db.EventType.findOne({
        where: {
          userId,
          id,
        },
      })
    ) {
      slug = `${baseSlug}-${counter}`
      counter++
    }
    */

    // update the event type
    const updatedEvent = await event.update(
      {
        title,
        eventType,
        duration,
        location,
        availability_time,
        hostName,
        hostEmail,
        isActive: isActive !== undefined ? isActive : event.isActive,
      },
      { transaction }
    )

    // Update time slots if provided
    if (timeSlots) {
      // Delete existing time slots
      await db.TimeSlot.destroy({
        where: { eventTypeId: event.id },
        transaction,
      })

      // Create new time slots
      if (timeSlots.length > 0) {
        const timeSlotData = timeSlots.map((slot) => ({
          eventTypeId: event.id,
          daysOfWeek: slot.daysOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
        }))

        await db.TimeSlot.bulkCreate(timeSlotData, { transaction })
      }
    }

    await transaction.commit()

    // const BASE_URL = process.env.BASE_URL
    // console.log("Base url from env", BASE_URL)
    const eventId = updatedEvent.id
    console.log("Event id that event created :", eventId)

    const bookingUrl = `${process.env.BASE_URL}/${eventId}`
    console.log("BookingUrl generated while create :", bookingUrl)

    res.status(200).json({
      success: true,
      message: "Event updated successfully..",
      bookingUrl: bookingUrl,
      event: updatedEvent,
    })
  } catch (error) {
    console.log(
      "Error while updating the event for dashboard in controller",
      error.message
    )
    await transaction.rollback()
    res.status(500).json({
      message: "Error while updating the event for dashboard in controller",
      error: error.message,
      success: false,
    })
  }
}

// get all events on dashboard
export const getAllEventTypeOnDashboard = async (req, res) => {
  console.log("Get all event api for dashboard called...")

  try {
    const { userId } = await checkUserThroughToken(req) // extract the token
    const events = await db.EventType.findAll({
      where: { userId },
      include: [
        {
          model: db.TimeSlot,
          as: "TimeSlots",
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    const eventsWithUrls = events.map((event) => {
      const eventId = event.id
      const bookingUrl = `${process.env.BASE_URL}/${eventId}`
      return {
        ...event.toJSON(),
        bookingUrl,
      }
    })

    res.status(200).json({
      success: true,
      message: "All events for dashboard fetched",
      events: eventsWithUrls,
    })
  } catch (error) {
    console.log("Error whiile fetching the all events on dashboard", error)
    res.status(500).json({
      message: "Error whiile fetching the all events on dashboard",
      success: false,
      error: error.message,
    })
  }
}

// get event deatils on dashboard
export const getEventTypeOnDashboard = async (req, res) => {
  console.log("Get one event for public user api called..")

  try {
    // const { userId } = await checkUserThroughToken(req) // extract the token
    const { id } = req.params // event id from params

    const event = await db.EventType.findOne({
      where: {
        id,
      },
      include: [
        {
          model: db.TimeSlot,
          as: "TimeSlots",
          order: [
            ["daysOfWeek", "ASC"],
            ["startTime", "ASC"],
          ],
        },
      ],
    })

    if (!event) {
      return res.status(404).json({ error: "Event not found " })
    }

    const eventId = event.id
    res.status(200).json({
      message: "Event fetch from dashboard",
      event: {
        ...event.toJSON(),
        bookingUrl: `${process.env.BASE_URL}/${eventId}`,
      },
    })
  } catch (error) {
    console.log(
      "Error while fetching the details for this event on dashboard",
      error
    )
    res.status(500).json({
      success: false,
      message: "Error while fetching the details for this event on dashboard",
      error: error.message,
    })
  }
}

// delete the event from dashboard
export const deleteEventTypeOnDashboard = async (req, res) => {
  console.log("Delete event api called for dashboard..")

  const transaction = await sequelize.transaction()
  try {
    const { userId } = checkUserThroughToken(req) // extract token
    const { id } = req.params
    const event = await db.EventType.findOne({
      where: {
        id,
        userId,
      },
    })

    if (!event) {
      return res.status(404).json({ message: "event not found" })
    }

    // Check if there are future bookings
    const futureBookings = await db.Booking.count({
      where: {
        eventTypeId: event.id,
        booking_date: {
          [Op.gte]: new Date().toISOString().split("T")[0],
        },
        status: "confirmed",
      },
    })

    if (futureBookings > 0) {
      return res.status(400).json({
        error:
          "Cannot delete event with future bookings. Cancel bookings first.",
      })
    }

    // Delete time slots first (due to foreign key constraint)
    await db.TimeSlot.destroy({
      where: { eventTypeId: event.id },
      transaction,
    })

    // delete the event
    await event.destroy({ transaction })

    await transaction.commit()

    res
      .status(200)
      .json({ success: true, message: "Event deleted successfully.." })
  } catch (error) {
    console.log("Error while deleting the event", error)
    await transaction.rollback()
    res
      .status(500)
      .json({ message: "Error while deleting the event", error: error.message })
  }
}
