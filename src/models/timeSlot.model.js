export default (sequelize, DataTypes) => {
  // for tyhe user to see the event time slot and his own availability
  const TimeSlot = sequelize.define(
    "TimeSlot",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      availabilityId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Availabilities",
          key: "id",
        },
      },
      eventId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "EventTypes",
          key: "id",
        },
      },
      dayOfWeek: {
        type: DataTypes.ENUM("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"),
        allowNull: false,
      },
      startTime: {
        type: DataTypes.STRING, // Store as "09:00am" format
        allowNull: false,
      },
      endTime: {
        type: DataTypes.STRING, // Store as "05:00pm" format
        allowNull: false,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      // status: {
      //   type: DataTypes.ENUM("reserved", "available", "booked"),
      //   defaultValue: "available",
      // },
      // reservedUntill: {
      //   type: DataTypes.DATE,
      //   allowNull: true,
      // },
    },
    {
      timestamps: true,
    }
  )
  return TimeSlot
}
