import express from "express"
import {
  bookEvent,
  getMeetingByTab,
} from "../controllers/bookingController.controller.js"

const router = express.Router()

// router.get("/meetings/:tab", getBookingByTab)
// public route for event booking
router.post("/booking", bookEvent)

router.get("/meetings", getMeetingByTab)
export const bookingRoute = router
