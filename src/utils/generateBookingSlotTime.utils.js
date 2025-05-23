// Define the start and end time in 24-hour format
// const startTime = 9
// const endTime = 13

/**
 * Formats a JavaScript Date object to 12-hour time with AM/PM.
 * @param {Date} date - The date object to format.
 * @returns {string} - Formatted time string (e.g., "9:00 AM").
 */
function formatAMPM(date) {
  let hours = date.getHours()
  let minutes = date.getMinutes()
  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  minutes = minutes.toString().padStart(2, "0")
  return `${hours}:${minutes} ${ampm}`
}

/**
 * Generates time slots between startTime and endTime.
 * @param {number} startTime - Start hour in 24-hour format.
 * @param {number} endTime - End hour in 24-hour format.
 * @param {number} interval - Interval in minutes for each slot.
 * @returns {Array} - Array of slot objects with start and end times.
 */
export default function generateSlots(startTime, endTime, interval = 30) {
  const slots = []
  // Helper to pad single digit numbers with leading zero
  const pad = (n) => n.toString().padStart(2, "0")
  // Create Date objects for start and end times
  const start = new Date(`1970-01-01T${pad(startTime)}:00:00`)
  const end = new Date(`1970-01-01T${pad(endTime)}:00:00`)

  // Loop to generate slots until reaching the end time
  let current = new Date(start)
  while (current < end) {
    const endSlot = new Date(current.getTime() + interval * 60000)
    if (endSlot <= end) {
      slots.push({
        start: formatAMPM(current),
        end: formatAMPM(endSlot),
      })
    }
    // Move to the next slot
    current = new Date(current.getTime() + interval * 60000)
  }

  return slots
}

// Generate slots and print them
let value = generateSlots(startTime, endTime, 30)
console.log(value)
