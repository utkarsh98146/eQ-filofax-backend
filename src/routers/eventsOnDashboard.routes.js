import express from "express"
import {
  createEventTypeOnDashboard,
  deleteEventTypeOnDashboard,
  getAllEventTypeOnDashboard,
  getEventTypeOnDashboard,
  updateEventTypeOnDashboard,
} from "../controllers/eventsForDashboardController.controller.js"
import { verifyToken } from "../middlewares/verifyToken.middleware.js"
const router = express.Router()

// router.get("/upcoming-events", verifyToken, getEventsForDashboard)

router.post("/create-dashboard-event", verifyToken, createEventTypeOnDashboard) // create event for dashboard

router.get("/getAll-dashboard-event", verifyToken, getAllEventTypeOnDashboard) // get all event for dashboard

router.get("/:id", getEventTypeOnDashboard) // get one event for dashboard

router.put("/update-dashboard-event", verifyToken, updateEventTypeOnDashboard) // update event for dashboard

router.delete(
  "/delete-dashboard-event/:id",
  verifyToken,
  deleteEventTypeOnDashboard
) // delete event for dashboard by event id
export const eventsOnDashboardRouter = router
