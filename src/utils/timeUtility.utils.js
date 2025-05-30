// Define the start and end time in 24-hour format
import moment from "moment"

// generate booking time slots for interval
export const generateBookingTimeSLots = (availability, slotMinutes = 30) => {
  if (!availability.startTime || !availability.endTime) {
    return []
  }
  ;``

  const slots = []

  let start = moment(availability.startTime, "HH:mm")
  let end = moment(availability.endTime, "HH:mm")

  while (start.clone().add(slotMinutes, "minutes").isSameOrBefore(end)) {
    slots.push({
      availabilityId: availability.id,
      startTime: start.format("HH:mm"),
      endTime: start.clone().add(slotMinutes, "minutes").format("HH:mm"),
    })
    start = start.add(slotMinutes, "minutes")
  }
}

// Generate By Default Availablility Time SLots by host
export const generateDefaultAvailability = () => {
  return [
    // Sunday - Unavailable
    {
      daysOfWeek: "sunday",
      startTime: null,
      endTime: null,
      isAvailable: false,
    },

    // Monday - Friday : 9AM - 5PM
    {
      daysOfWeek: "monday",
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: true,
    },
    {
      daysOfWeek: "tuesday",
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: true,
    },
    {
      daysOfWeek: "wednesday",
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: true,
    },
    {
      daysOfWeek: "thursday",
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: true,
    },
    {
      daysOfWeek: "firday",
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: true,
    },

    // Saturday - Unavailable
    {
      daysOfWeek: "saturday",
      startTime: null,
      endTime: null,
      isAvailable: false,
    },
  ]
}
