import express from "express"

import { verifyToken } from "../middlewares/verifyToken.middleware.js"
import {
  createEventController,
  deleteEventController,
  getAllEventController,
  updateEventController,
} from "../controllers/calendarEventController.controller.js"

const router = express()

router.get("/all-google-event", verifyToken, getAllEventController) // get all calendar event route

router.post("/create-event", verifyToken, createEventController) // create calendar event route

router.put("/update-event/:id", verifyToken, updateEventController) // update calendar event route

router.delete("/delete-event/:id", verifyToken, deleteEventController) //delete calendar event route

export const calendarEventRouter = router
