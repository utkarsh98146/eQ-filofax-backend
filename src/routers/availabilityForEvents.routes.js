import express from "express"
import {
  createDefaultAvailability,
  getAvailabilityForEvent,
  setAvailabilityForNewEvent,
} from "../controllers/availabilityForEventsController.controller.js"

const router = express.Router()

// create a default
// router.post("/create-default-availability", createDefaultAvailability)

// get the host available times for the event
router.get("/get/:userId", getAvailabilityForEvent)

// set(update) the availability of host
router.put("/set", setAvailabilityForNewEvent)

export const availabilityForEvents = router
