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
          id: "id",
        },
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("reserved", "available", "booked"),
        defaultValue: "available",
      },
      reservedUntill: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  )
  return TimeSlot
}
