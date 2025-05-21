import express from "express"
import { verifyToken } from "../middlewares/verifyToken.middleware.js"
import { getEventsForDashboard } from "../controllers/eventsForDashboardController.controller.js"

const router = express.Router()

router.get("/upcoming-events", verifyToken, getEventsForDashboard)

export const eventsOnDashboardRouter = router
