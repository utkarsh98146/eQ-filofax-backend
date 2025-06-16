import express from "express"
import {
  connectZoom,
  createZoomMeetingController,
  deleteZoomMeetingByIdController,
  getAllZoomMeetingsController,
  updateZoomMeetingController,
  zoomCallback,
  zoomConnect,
} from "../controllers/zoomMeetingControllers.controller.js"
import { getZoomMeetingById } from "../services/zoomServices.service.js"
import { verifyToken } from "../middlewares/verifyToken.middleware.js"

const router = express.Router()

/*

router.get("/all-zoom-meeting", getAllZoomMeetingsController) // get all zoom meeting route

router.get("/zoom-meeting/:id", getZoomMeetingById) // get zoom meeting by id route

router.put("/update-zoom-meeting/:id", updateZoomMeetingController) // update zoom meeting route

router.delete("/delete-zoom-meeting/:id", deleteZoomMeetingByIdController) // delete zoom meeting route

// router.get("/connect", verifyToken, connectZoom) // connecting to zoom app

*/
// router.get("/connect", verifyToken, zoomConnect) // connecting to zoom app

router.post("/connect", verifyToken, zoomConnect) // connecting to zoom app

router.get("/callback", zoomCallback)

router.post("/create-zoom-meeting", createZoomMeetingController) // create zoom meeting route

export const zoomMeetingRouter = router
