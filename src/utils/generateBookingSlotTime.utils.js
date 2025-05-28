// Define the start and end time in 24-hour format
import moment from "moment"

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
