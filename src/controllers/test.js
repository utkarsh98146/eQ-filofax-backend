import { checkUserThroughToken } from "../services/jwt_tokenServices.service.js"
import {
  createZoomMeeting,
  createZoomMeetingService,
  getAllZoomMeetingsService,
  updateZoomMeeting,
  updateZoomMeetingService,
} from "../services/zoomServices.service.js"

// create zoom meeting controller
export const createZoomMeetingController = async (req, res) => {
  try {
    console.log("Inside the create zoom meeting controller")
    const { userId } = checkUserThroughToken(req) // destructure the userId from the request object
    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized access,checkUserThroughToken failed",
      })
    }

    const meetingDetails = {
      title: req.body.title,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      duration: req.body.duration,
      eventType: req.body.eventType,
      location: req.body.location,
      hostTimezone: req.body.hostTimezone,
      agenda: req.body.description,
      password: req.body.password,
      hostId: userId,
      hostName: req.body.hostName,
      hostEmail: req.body.hostEmail,
      attendees: data.attendees || [], // List of attendees
    }
    const createdData = createZoomMeetingService(meetingDetails) // destructure the data from the request body

    if (!createdData) {
      return res.status(400).json({
        status: "error",
        message: "Failed to create Zoom meeting",
      })
    }
    const savedMeetingInDB = await db.ZoomMeeting.create({
      zoomMeetingId: createdData.id,
      topic: createdData.topic,
      startTime: createdData.start_time,
      duration: createdData.duration,
      agenda: createdData.agenda,
      password: createdData.password, // password for all default
      hostId: createdData.host_id,
      hostName: data.host_name || "Utkarsh",
      hostEmail: data.host_email || "subhashyadav.equasar@gmail.com",
      joinUrl: createdData.join_url,
      meetingUrl: createdData.meeting_url,
      meetingId: createdData.meeting_id,
      attendees: data.attendees || [], // List of attendees
      eventType: data.event_type || "description",
      location: data.location || "Zoom",
      hostTimezone: data.host_timezone || "Asia/Kolkata",
    })
    console.log("savedMeetingInDB", savedMeetingInDB)

    console.log("The details of the meeting created are :", createData)
    res.status(201).json({
      status: "success",
      message: "Zoom meeting created successfully",
      data: createData,
    })
  } catch (error) {
    console.error("Error creating Zoom meeting:", error.message)
    res.status(500).json({
      status: "error",
      message: "Failed to create Zoom meeting from controller",
      error: error.message,
    })
  }
}

// get all zoom meetings controller
export const getAllZoomMeetingsController = async (req, res) => {
  try {
    const { userId } = checkUserThroughToken(req) // destructure the userId from the request object
    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized access,checkUserThroughToken failed",
      })
    }

    const allZoomMeetings = await getAllZoomMeetingsService()
    if (!allZoomMeetings) {
      return res.status(400).json({
        status: "error",
        message: "Failed to fetch all Zoom meetings",
      })
    }
    console.log("The details of the all Zoom meetings are :", allZoomMeetings)
    res.status(200).json({
      status: "success",
      message: "All Zoom meetings fetched successfully",
      data: allZoomMeetings,
    })
  } catch (error) {
    console.error(
      "Error fetching Zoom meetings from controller:",
      error.message
    )
    res.status(500).json({
      status: "error",
      message: "Failed to fetch Zoom meetings from controller",
      error: error.message,
    })
  }
}

// update zoom meeting controller
export const updateZoomMeetingController = async (req, res) => {
  try {
    const { userId } = checkUserThroughToken(req) // destructure the userId from the request object
    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized access,checkUserThroughToken failed",
      })
    }
    const meetingId = req.params.id // destructure the meetingId from the request object
    const meetingDetails = {
      title: req.body.title,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      duration: req.body.duration,
      eventType: req.body.eventType,
      location: req.body.location,
      hostTimezone: req.body.hostTimezone,
      agenda: req.body.description,
      hostName: req.body.hostName,
      hostEmail: req.body.hostEmail,
    }
    const updateData = await updateZoomMeetingService(meetingDetails, meetingId)
    if (!updateData) {
      return res.status(400).json({
        status: "error",
        message: "Failed to update Zoom meeting",
      })
    }
    console.log("The details of the meeting updated are :", updateData)
    res.status(200).json({
      status: "success",
      message: "Zoom meeting updated successfully",
      data: updateData,
    })
  } catch (error) {
    console.error("Error updating Zoom meeting:", error.message)
    res.status(500).json({
      status: "error",
      message: "Failed to update Zoom meeting from controller",
      error: error.message,
    })
  }
}
