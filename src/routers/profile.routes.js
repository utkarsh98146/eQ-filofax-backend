import express from "express"
import {
  deleteProfileDetailsController,
  profileDetailsController,
  updateProfileDetailsController,
} from "../controllers/profileController.controller.js"
import { uploadImage } from "../middlewares/imageStoringProcess.multer.middleware.js"

const router = express()

router.get("/get-profile", profileDetailsController)

router.put(
  "/update-profile",
  uploadImage("profileImageLink"),
  updateProfileDetailsController
)

router.delete("/delete-profile", deleteProfileDetailsController)

export const profileRouter = router
