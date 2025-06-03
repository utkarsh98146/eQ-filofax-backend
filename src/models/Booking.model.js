import db from "./index.model.js"

export default (sequelize, DataTypes) => {
  const Booking = sequelize.define("Booking", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    eventTypeId: {
      type: DataTypes.UUID,
      references: { model: "EventTypes", key: "id" },
      allowNull: false,
    },
    hostId: {
      type: DataTypes.UUID,
      references: { model: "Users", key: "id" },
      allowNull: false,
    },

    // Booking time details
    bookingDate: {
      type: DataTypes.DATEONLY, // Just the date: YYYY-MM-DD
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME, // Time: HH:MM:SS
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    // Attendee information
    attendee_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attendee_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    //   attendee_phone: DataTypes.STRING,

    attendee_timezone: { type: DataTypes.STRING, defaultValue: "Asia/Kolkata" },

    // Booking details
    status: {
      type: DataTypes.ENUM("confirmed", "cancelled", "completed", "no_show"),
      defaultValue: "confirmed",
    },

    //   booking_reference: {
    //     type: DataTypes.STRING,
    //     unique: true,
    //     allowNull: false,
    //   },

    // Custom responses from booking form
    //   custom_responses: {
    //     type: DataTypes.JSONB,
    //     defaultValue: {},
    //   },

    // Notes
    host_notes: DataTypes.TEXT,
    attendee_notes: DataTypes.TEXT,
  })
  return Booking
}
