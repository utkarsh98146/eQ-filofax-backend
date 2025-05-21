import { checkUserThroughToken } from "../services/jwt_tokenServices.service.js"
import {
  createZoomMeetingService,
  deleteZoomMeetingById,
  getAllZoomMeetingsService,
  getZoomMeetingById,
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

    // Prepare meeting details according to Zoom API requirements
    const meetingDetails = {
      topic: req.body.title,
      start_time: req.body.startTime,
      duration: req.body.duration,
      timezone: req.body.hostTimezone || "Asia/Kolkata",
      agenda: req.body.description,
      password: req.body.password || "123456",
      hostId: userId,
      hostName: req.body.hostName,
      hostEmail: req.body.hostEmail,
      attendees: req.body.attendees || [],
      eventType: req.body.eventType || "description",
    }

    // Await the creation of the Zoom meeting
    const { zoomMeetingDeatails, zoomMeetingDeatailsInDB } =
      await createZoomMeetingService(meetingDetails)

    if (!createdData) {
      return res.status(400).json({
        status: "error",
        message: "Failed to create Zoom meeting",
      })
    }

    console.log("The details of the meeting created are :", createdData)
    res.status(201).json({
      status: "success",
      message: "Zoom meeting created successfully",
      data: { zoomMeetingDeatails, zoomMeetingDeatailsInDB },
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
    const { zoomMeetingDeatails, zoomMeetingDeatailsInDB } =
      await updateZoomMeetingService(meetingDetails, meetingId)
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
      data: { zoomMeetingDeatails, zoomMeetingDeatailsInDB },
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

// get zoom meeting by id controller
export const getZoomMeetingByIdController = async (req, res) => {
  try {
    const { userId } = checkUserThroughToken(req) // destructure the userId from the request object
    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized access,checkUserThroughToken failed",
      })
    }
    const meetingId = req.params.id // destructure the meetingId from the request object
    const zoomMeeting = await getZoomMeetingById(meetingId) // Call the service to get the meeting by ID
    if (!zoomMeeting) {
      return res.status(400).json({
        status: "error",
        message: "Failed to fetch Zoom meeting by ID",
      })
    }
    console.log("The details of the Zoom meeting by ID are :", zoomMeeting)
    res.status(200).json({
      status: "success",
      message: "Zoom meeting fetched by ID successfully",
      data: zoomMeeting,
    })
  } catch (error) {
    console.error("Error fetching Zoom meeting by ID:", error.message)
    res.status(500).json({
      status: "error",
      message: "Failed to fetch Zoom meeting by ID from controller",
      error: error.message,
    })
  }
}

// delete zoom meeting by id controller
export const deleteZoomMeetingByIdController = async (req, res) => {
  try {
    const { userId } = checkUserThroughToken(req) // destructure the userId from the request object
    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized access,checkUserThroughToken failed",
      })
    }
    const meetingId = req.params.id // destructure the meetingId from the request object

    const deleteMeeting = await deleteZoomMeetingById(meetingId) // Call the service to delete the meeting by ID
    if (!deleteMeeting) {
      return res.status(400).json({
        status: "error",
        message: "Failed to delete Zoom meeting by ID",
      })
    }
    console.log(
      "The details of the Zoom meeting deleted by ID are :",
      deleteMeeting
    )
    res.status(200).json({
      status: "success",
      message: "Zoom meeting deleted by ID successfully",
    })
  } catch (error) {
    console.error(
      "Error deleting Zoom meeting in controller by ID:",
      error.message
    )
    res.status(500).json({
      status: "error",
      message: "Failed to delete Zoom meeting by ID from controller",
      error: error.message,
    })
  }
}

// add attendees into db through zoom meeting controller
export const addAttendeesIntoDbThroughZoomMeetingController = async (
  req,
  res
) => {
  try {
    const { userId } = checkUserThroughToken(req) // destructure the userId from the request object
    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized access,checkUserThroughToken failed",
      })
    }
    const meetingdetails = await getZoomMeetingById(req.params.id) // Call the service to get the meeting by ID

    if (!meetingdetails) {
      return res.status(400).json({
        status: "error",
        message: "Failed to fetch Zoom meeting by ID",
      })
    }

    const attendees = meetingdetails.attendees || [] // destructure the attendees from the request object
    attendees.push(req.body) // add the new attendee to the existing attendees array

    meetingdetails.attendees = attendees // update the meeting details with the new attendees array

    await meetingdetails.save() // save the updated meeting details to the database

    res.status(200).json({
      status: "success",
      message:
        "Attendees added into db through zoom meeting controller successfully",
      data: meetingdetails,
    })
  } catch (error) {
    console.error(
      "Error adding attendees into db through zoom meeting controller:",
      error.message
    )
    res.status(500).json({
      status: "error",
      message:
        "Failed to add attendees into db through zoom meeting controller",
      error: error.message,
    })
  }
}
