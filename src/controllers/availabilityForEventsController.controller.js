import db from "../models/index.model.js"
import { checkUserThroughToken } from "../services/jwt_tokenServices.service.js"
import {
  generateBookingTimeSLots,
  generateDefaultAvailability,
} from "../utils/timeUtility.utils.js"

// create default availability for every new host by default
export const createDefaultAvailability = async (req, res) => {
  try {
    const { userId } = await checkUserThroughToken // userId from the token

    const { hostTimeZone = "Asia/kolkota" } = req.body

    const existitngAvailability = await db.Availability.findByPk(userId) // if user already existed

    if (existitngAvailability) {
      return res.status(400).json({
        message: "Availability already exists for this user",
        success: false,
      })
    }

    // Get default working hours (Monday - Friday 9AM - 5PM)

    const defaultSchedule = generateDefaultAvailability() // load the default working hours

    const records = []

    for (const item of defaultSchedule) {
      records.push({
        userId,
        daysOfWeek: item.daysOfWeek,
        startTime: item.startTime,
        endTime: item.endTime,
        isAvailable: item.isAvailable,
        hostTimeZone,
      })

      const created = await db.Availability.bulkCreate(records)

      // generate time slots for available days
      for (const availability of created) {
        if (
          availability.isAvailable &&
          availability.startTime &&
          availability.endTime
        ) {
          const slots = generateBookingTimeSLots(availability, 30) // 30 min slots for each

          await db.TimeSlot.bulkCreate(slots)
        }
      }
      res.status(201).json({
        message: "Default availability created succesfully..",
        success: true,
        availability: created,
      })
    }
  } catch (error) {
    console.log("Error while creating default availability for host")
    res.status(500).json({
      message: "Error while creating default availability for host",
      error: error.message,
    })
  }
}

// set the availablity
export const setAvailabilityForNewEvent = async (req, res) => {
  try {
    const { userId } = await checkUserThroughToken() // getting the user id through token
    const { hostTimeZone, availability } = req.body // getting the event id and availability details from the request body

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
      const { daysOfWeek, intervals = [], isAvailable = true } = item

      if (intervals.length === 0 || !isAvailable) {
        records.push({
          userId,
          daysOfWeek,
          startTime: null,
          endTime: null,
          isAvailable: false,
          location,
          hostTimeZone,
        })
      } else {
        for (const interval of intervals) {
          records.push({
            userId,
            daysOfWeek,
            startTime: interval.startTime,
            endTime: interval.endTime,
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
        const slots = generat // 30 minutes slot
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
    const { userId } = await checkUserThroughToken() // getting the user id through token

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

    if (availability.length === 0) {
      return res.status(404).json({
        message: "No availability found. Create default availability first.",
        success: false,
      })
    }

    // format response

    const formattedAvailability = {
      userId,
      hostTimeZone: availability[0]?.hostTimeZone || "UTC",
      weeklyHours: formatWeeklyHours(availability),
    }

    res.status(200).json({
      success: true,
      message: "Availability fetched successfully",
      data: formattedAvailability,
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

// helper function to format weekly hours for host
function formatWeeklyHours(availability) {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ]

  const weeklyHours = {}

  days.forEach((day) => {
    const dayAvailability = availability.filter(
      (item) => item.daysOfWeek === day
    )

    if (dayAvailability.length === 0 || !dayAvailability[0].isAvailable) {
      weeklyHours[day] = {
        isAvailable: false,
        interval: [],
      }
    } else {
      weeklyHours[day] = {
        isAvailable: true,
        interval: dayAvailability.map((item) => ({
          startTime: item.startTime,
          endTime: item.endTime,
        })),
      }
    }
  })

  return weeklyHours
}
