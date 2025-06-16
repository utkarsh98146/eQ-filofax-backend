import axios from "axios"
import db from "../models/index.model.js"
import qs from "qs"
import jwt from "jsonwebtoken"
import { checkUserThroughToken } from "../services/jwt_tokenServices.service.js"
import {
  createZoomMeetingService,
  deleteZoomMeetingById,
  getAllZoomMeetingsService,
  getZoomMeetingById,
  updateZoomMeetingService,
} from "../services/zoomServices.service.js"
import { generateZoomToken } from "../utils/generateZoomToken.utils.js"

const {
  ZOOM_ACCOUNT_ID,
  ZOOM_CLIENT_ID,
  ZOOM_CLIENT_SECRET,
  ZOOM_REDIRECT_URI,
  ZOOM_OAUTH_URL,
  ZOOM_TOKEN_URL,
} = process.env

// create zoom meeting controller
export const createZoomMeetingController = async (req, res) => {
  try {
    console.log("Inside the create zoom meeting controller")

    const { userId } = await checkUserThroughToken(req) // destructure the userId from the request object
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
      agenda: req.body.title || req.body.description,
      password: req.body.password || "123456",
      hostId: userId,
      hostName: req.body.hostName,
      hostEmail: req.body.hostEmail,
      attendeeName: req.body.attendeeName || [],
      attendeeEmail: req.body.attendeeEmail || [],
      eventType: req.body.eventType || "one-on-one",
    }

    // Await the creation of the Zoom meeting
    // const { zoomMeetingDeatails, zoomMeetingDeatailsInDB } =
    //   await createZoomMeetingService(meetingDetails)
    const { zoomMeetingDeatails } =
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
    const { userId } = await checkUserThroughToken(req) // destructure the userId from the request object
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
    const { userId } = await checkUserThroughToken(req) // destructure the userId from the request object
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
    const { userId } = await checkUserThroughToken(req) // destructure the userId from the request object
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
    const { userId } = await checkUserThroughToken(req) // destructure the userId from the request object
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
    const { userId } = await checkUserThroughToken(req) // destructure the userId from the request object
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

// connect to zoom
// export const connectZoom = async (req, res) => {
//   try {
//     const { zoom_access_token } = await generateZoomToken()

//     const { userId } = await checkUserThroughToken(req)

//     if (userId) {
//       const user = await db.User.findByPk(userId)
//       if (user) {
//         await user.update({
//           zoom_access_token: zoom_access_token,
//           // zoom_access_token_expires: new Date(Date.now() + 6 * 3600 * 1000),
//         })
//       } else {
//         // Handle case where user doesn't exist
//         console.error("User not found:", userId)
//       }
//     }
//     console.log("Zoom token", zoom_access_token)

//     res.status(200).json({
//       success: true,
//       message: "You are connect to zoom ",
//       zoom_access_token,
//     })
//   } catch (error) {
//     console.error("Zoom connect error:", error)
//     return res
//       .status(500)
//       .json({ success: false, message: "Zoom connection failed" })
//   }
// }

export const zoomConnect = async (req, res) => {
  console.log("Try to connect the zoom")
  console.log("req.user:", req.user) // 🆕 ADD: Debug log
  // console.log("req.body:", req.body) // 🆕 ADD: Debug log
  try {
    const userId = req.user.userId
    const { email } = req.body

    // 🆕 ADD: Check if user already has zoom token
    const user = await db.User.findByPk(userId)
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      })
    }
    // 🆕 ADD: Check if user already connected to Zoom
    if (user.zoom_access_token) {
      return res.status(200).json({
        success: true,
        alreadyConnected: true,
        message: "Already connected to Zoom",
      })
    }
    const stateToken = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
      expiresIn: "10m",
    })
    const redirectUrl = `${ZOOM_OAUTH_URL}?response_type=code&client_id=${ZOOM_CLIENT_ID}&redirect_uri=${encodeURIComponent(ZOOM_REDIRECT_URI)}&state=${stateToken}`

    // res.redirect(redirectUrl)

    res.status(200).json({
      success: true,
      redirectUrl,
      alreadyConnected: false,
      message: "Redirect to this URL to authorize Zoom",
    })
  } catch (error) {
    console.log("Error while connect to zoom", error)
    res.status(500).json({
      message: "Error while coonectin got zoom ",
      error: error.message,
      success: false,
    })
  }
}

export const zoomCallback = async (req, res) => {
  const { code, state } = req.query
  try {
    // Verify JWT token from state
    const decoded = jwt.verify(state, process.env.JWT_SECRET_KEY)
    const userId = decoded.userId

    const user = await db.User.findByPk(userId)

    if (!user)
      return res.status(400).json({ message: "User not found", success: false })

    const payload = {
      grant_type: "authorization_code",
      code,
      redirect_uri: ZOOM_REDIRECT_URI,
    }

    const response = await axios.post(ZOOM_TOKEN_URL, qs.stringify(payload), {
      headers: {
        Authorization: `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    const { access_token } = response.data

    user.zoom_access_token = access_token

    await user.save()

    const jwtToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        userId: user.id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    )
    res.cookie("zoom_access_token", access_token, {
      httpOnly: false, // frontend needs to access it via js-cookie
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    // Redirect to frontend with both JWT + Zoom token in URL or cookie
    // const frontendRedirect = `http://localhost:3000/zoom-success?token=${state}&zoom_access_token${zoom_access_token}`
    // return res.redirect(frontendRedirect)

    return res.redirect(
      `http://localhost:3002/zoom-success?zoom_access_token=${access_token}&token=${jwtToken}&success=true`
    )
  } catch (error) {
    console.error(
      "Zoom callback error : ",
      error.response?.data || error.message
    )
    return res.status(500).json({ message: "Zoom OAuth failed" })
  }
}
