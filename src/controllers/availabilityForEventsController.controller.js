import db from "../models/index.model.js"
import checkUserThroughToken from "../services/jwt_tokenServices.service.js"
import { generateBookingTimeSLots } from "../utils/generateBookingSlotTime.utils.js"

// set the availablity
export const setAvailabilityForNewEvent = async (req, res) => {
  try {
    const { userId } = checkUserThroughToken() // getting the user id through token
    const { eventId, hostTimeZone, availability } = req.body // getting the event id and availability details from the request body

    if (!userId) {
      console.log(
        `User id not fetched from the jwt token in create availability controller`
      )
      res.status(401).json({
        success: false,
        message:
          "Tokenn not fetched in create availability controller : UnAuthorized",
      })
    }

    let records = []

    for (const item of availability) {
      const { daysOfWeek, intervals = [], isAvailable = true, location } = item

      if (intervals.length === 0 || !isAvailable || !location) {
        records.push({
          daysOfWeek,
          userId,
          eventId,
          startTime: 0,
          endTime: 0,
          isAvailable: false,
          location,
          hostTimeZone,
        })
      } else {
        for (const interval of intervals) {
          const { startTime, endTime } = interval

          records.push({
            daysOfWeek,
            userId,
            eventId,
            startTime,
            endTime,
            isAvailable: true,
            location,
            hostTimeZone,
          })
        }
      }
    }
    const createAvailability = await db.Availability.bulkCreate(records)

    // generate the slots for each interval
    for (const availableSlot of createAvailability) {
      if (
        availableSlot.isAvailable &&
        availableSlot.startTime &&
        availableSlot.endTime
      ) {
        const slots = generateBookingTimeSLots(availableSlot, 30) // 30 minutes slot
        await db.TimeSlot.bulkCreate(slots)
      }
    }
    res.status(201).json({
      success: true,
      message: "Availability created successfully",
      data: createAvailability,
    })
  } catch (error) {
    console.error(
      `Error in createAvailabilityForNewEvent controller: ${error.message}`
    )
    res.status(500).json({
      success: false,
      message: "Error while creating availability for the event",
      error: error.message,
    })
  }
}

// get the availability for the event
export const getAvailabilityForEvent = async (req, res) => {
  try {
    const { eventId } = req.params // getting the event id from the request params

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required",
      })
    }

    const { userId } = checkUserThroughToken() // getting the user id through token

    if (!userId) {
      console.log(
        `User id not fetched from the jwt token in get availability controller`
      )
      return res.status(401).json({
        success: false,
        message:
          "Token not fetched in get availability controller: UnAuthorized",
      })
    }
    const availability = await db.Availability.findAll({
      where: {
        eventId,
        userId,
      },
      include: [
        {
          model: db.TimeSlot,
          as: "timeSlots",
          attributes: ["id", "startTime", "endTime"],
        },
      ],
    })
    res.status(200).json({
      success: true,
      message: "Availability fetched successfully",
      data: availability,
    })
  } catch (error) {
    console.error(
      `Error in getAvailabilityForEvent controller: ${error.message}`
    )
    res.status(500).json({
      success: false,
      message: "Error while fetching availability for the event",
      error: error.message,
    })
  }
}
