import express from "express"
import {
  createZoomMeetingController,
  deleteZoomMeetingByIdController,
  getAllZoomMeetingsController,
  updateZoomMeetingController,
} from "../controllers/zoomMeetingControllers.controller.js"
import { getZoomMeetingById } from "../services/zoomServices.service.js"

const router = express.Router()

router.get("/all-zoom-meeting", getAllZoomMeetingsController) // get all zoom meeting route

router.get("/zoom-meeting/:id", getZoomMeetingById) // get zoom meeting by id route

router.post("/create-zoom-meeting", createZoomMeetingController) // create zoom meeting route

router.put("/update-zoom-meeting/:id", updateZoomMeetingController) // update zoom meeting route

router.delete("/delete-zoom-meeting/:id", deleteZoomMeetingByIdController) // delete zoom meeting route

export const zoomMeetingRouter = router
