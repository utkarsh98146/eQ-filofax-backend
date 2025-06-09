import { Op } from "sequelize"
import db from "../models/index.model.js"

export const getBookingByTab = async (tab, hostId) => {
  console.log("get booking by tab api call")
  try {
    // const now = getCombinedDateTime()
    const now = new Date() // Current date and time

    let where = { hostId }

    if (tab === "upcoming") {
      where = {
        ...where,
        [Op.and]: [
          db.sequelize.where(
            // db.sequelize.fn(
            //   "TIMESTAMP",
            //   db.sequelize.col("bookingDate"),
            //   db.sequelize.col("startTime")
            // )
            db.sequelize.literal(
              `(CAST("Booking"."bookingDate" AS TEXT) || ' ' || "Booking"."startTime")::timestamp`
            ),
            {
              [Op.gt]: now,
            }
          ),
        ],
      }
    } else if (tab === "past") {
      where = {
        ...where,
        [Op.and]: [
          db.sequelize.where(
            // db.sequelize.fn(
            //   "TIMESTAMP",
            //   db.sequelize.col("bookingDate"),
            //   db.sequelize.col("endTime")
            // ),
            db.sequelize.literal(
              `(CAST("Booking"."bookingDate" AS TEXT) || ' ' || "Booking"."endTime")::timestamp`
            ),

            {
              [Op.lt]: now,
            }
          ),
        ],
      }
    } else if (tab === "pending") {
      // Optional: Add a status field to filter pending
      where = {
        ...where,
        status: "pending",
      }
    }

    return db.Booking.findAll({
      where,
      include: [{ model: db.EventType }, { model: db.User }],
    })
  } catch (error) {
    console.error("Error in getBookingByTab:", error.message || error)
    throw new Error(
      "Failed to fetch bookings by tab: " + (error.message || error)
    )
  }
}
