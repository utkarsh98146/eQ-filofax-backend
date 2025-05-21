import { checkUserThroughToken } from "../services/jwt_tokenServices.service.js"
import { getAllUpcomingEvents } from "../services/mergeEventService.service.js"

export const getEventsForDashboard = async (req, res) => {
  try {
    // Check if the user is authenticated
    const { userId } = checkUserThroughToken()
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }
    const events = await getAllUpcomingEvents(userId)
    if (!events || events.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No upcoming events found",
      })
    }
    res.status(200).json({
      success: true,
      message: "Upcoming events retrieved successfully",
      data: events,
      count: events.length,
    })
  } catch (error) {
    console.error("Error in getUpcomingEvents controller:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve upcoming events",
      error: error.message,
    })
  }
}
