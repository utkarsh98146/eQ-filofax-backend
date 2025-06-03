import express from "express"
import {
  createEventTypeOnDashboard,
  deleteEventTypeOnDashboard,
  getAllEventTypeOnDashboard,
  getEventTypeOnDashboard,
  updateEventTypeOnDashboard,
} from "../controllers/eventsForDashboardController.controller.js"
const router = express.Router()

// router.get("/upcoming-events", verifyToken, getEventsForDashboard)

router.post("/create-dashboard-event", createEventTypeOnDashboard) // create event for dashboard

router.get("/getAll-dashboard-event", getAllEventTypeOnDashboard) // get all event for dashboard

router.get("/get-dashboard-event/:id", getEventTypeOnDashboard) // get one event for dashboard

router.put("/update-dashboard-event", updateEventTypeOnDashboard) // update event for dashboard

router.delete("/delete-dashboard-event/:id", deleteEventTypeOnDashboard) // delete event for dashboard by event id
export const eventsOnDashboardRouter = router
