import express from "express"
import { setAvailabilityForNewEvent } from "../controllers/availabilityForEventsController.controller"

const router = express.Router()

// get the host available times for the event
router.get("/availabilityForEvent", setAvailabilityForNewEvent)

//
router.put("/setAvailability")

export const availabilityForEvents = router
