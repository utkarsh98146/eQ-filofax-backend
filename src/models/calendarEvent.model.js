import { UUIDV4 } from "sequelize"

// define the table function based (factory pattern)
export default (sequelize, DataTypes) => {
  const CalendarEvent = sequelize.define(
    "CalendarEvent",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: { msg: "Title cannot be empty" },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          notEmpty: { msg: "Description cannot be empty" },
        },
      },

      // store the dates in UTC the db
      startTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      duration: {
        // duration of the event in minutes
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isNumeric: { msg: "Duration must be a number" },
          min: {
            args: 1,
            msg: "Duration must be greater than 0",
          },
        },
      },
      eventType: {
        // type of the event
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        // location of the event
        type: DataTypes.STRING,
        allowNull: true,
      },
      hostTimeZone: {
        // store the time zone the host own
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "UTC",
      },
      timeSlotId: {
        // refer through the timeSlot table
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "TimeSlots",
          key: "id",
        },
      },
      eventId: {
        // refer to the event id provided by google meet,zoom
        type: DataTypes.STRING,
        allowNull: true,
      },
      organizerEmail: {
        // host email
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: { msg: "Please provide a valid email" },
          notEmpty: { msg: "Organizer email cannot be empty" },
        },
      },
      attendees: {
        // clients mail who attend the meeting
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      status: {
        // status of the event
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "scheduled",
      },
      hostId: {
        // host id
        type: DataTypes.STRING,
        allowNull: true,
      },
      hostName: {
        // host name
        type: DataTypes.STRING,
        allowNull: true,
      },
      hostEmail: {
        // host email
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: { msg: "Please provide a valid email" },
          notEmpty: { msg: "Host email cannot be empty" },
        },
      },
      joinUrl: {
        // join url of the event
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  )
  return CalendarEvent
}
