import express from "express"
import {
  createEventController,
  deleteEventController,
  getAllEventController,
  updateEventController,
} from "../controllers/calendar.controller.js"
import { verifyToken } from "../middlewares/verifyToken.middleware.js"

const router = express()

router.get("/all-event", verifyToken, getAllEventController) // get all calendar event route

router.post("/create-event", verifyToken, createEventController) // create calendar event route

router.put("/update-event/:id", verifyToken, updateEventController) // update calendar event route

router.delete("/delete-event/:id", verifyToken, deleteEventController) //delete calendar event route

export const calendarEventRouter = router
