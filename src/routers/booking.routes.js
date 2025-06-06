import express from "express"
import { bookEvent } from "../controllers/bookingController.controller.js"

const router = express.Router()

// public route for event booking
router.post("/booking", bookEvent)

export const bookingRoute = router
