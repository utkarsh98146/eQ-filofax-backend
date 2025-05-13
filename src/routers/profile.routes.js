import express from "express"
import {
  deleteProfileDetailsController,
  profileDetailsController,
  updateProfileDetailsController,
} from "../controllers/profileController.controller.js"

const router = express()

router.get("/get-profile", profileDetailsController)

router.put("/update-profile", updateProfileDetailsController)

router.delete("/delete-profile", deleteProfileDetailsController)

export const profileRouter = router
