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
      isBooked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
    }
  )
  return TimeSlot
}
